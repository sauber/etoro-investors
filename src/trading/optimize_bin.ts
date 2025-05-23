import { Exchange, Instruments } from "@sauber/backtest";
import { Dashboard, Parameters, Status } from "@sauber/optimize";
import { Optimize } from "../trading/optimize.ts";
import { Assets } from "📚/assets/mod.ts";
import { Loader } from "📚/trading/loader.ts";
import { makeRanker, Rater } from "📚/trading/raters.ts";
import { InvestorRanking, Ranking } from "📚/ranking/mod.ts";
import { ParameterData } from "📚/trading/parameters.ts";
import { RankingCache } from "📚/ranking/ranking-cache.ts";


////////////////////////////////////////////////////////////////////////
/// Main
////////////////////////////////////////////////////////////////////////

const modelAssetName = "trading";

// Repo
const path: string = Deno.args[0];
if (!Deno.statSync(path)) throw new Error(`Directory ${path} not found`);
const repo: Assets = Assets.disk(path);
const loader: Loader = new Loader(repo);

// Ranking Model
const ranking: InvestorRanking = await loader.rankingModel();
const cache: Ranking = new RankingCache(ranking);
const ranker: Rater = makeRanker(cache);

// Load training data
const instruments: Instruments = await loader.instrumentSamples(800);
console.log("Instruments loaded:", instruments.length);
const spread = 0.001;
const exchange: Exchange = new Exchange(instruments, spread);

// Load Parameters into model
const config = repo.config;
const settings = await config.get(modelAssetName) as ParameterData;
const loaded: boolean = settings !== null;
const model = loaded
  ? Optimize.import(settings, ranker)
  : Optimize.generate(exchange, 1500, ranker);
if (loaded) console.log("Loaded settings:", settings);
else console.log("No settings found, starting from", model.export());

// Dashboard
const epochs = 100;
const console_width = 88;
const dashboard: Dashboard = new Dashboard(epochs, console_width);
const status: Status = (
  iterations: number,
  _momentum: number,
  parameters: Parameters,
  reward: number[],
) => console.log(dashboard.render(parameters, iterations, reward));

// Run optimizer and save results
const epsilon = 0.01;
const _iterations: number = model.optimize(exchange, epochs, epsilon, status);
const exported: ParameterData = model.export();
console.log("Saved settings: ", exported);
await config.set(modelAssetName, exported);
