import {
  Backend,
  CachingBackend,
  DiskBackend,
  HeapBackend,
} from "@sauber/journal";
import { Community, TestCommunity } from "📚/repository/mod.ts";
import { Config } from "📚/config/mod.ts";
import { InvestorRanking } from "📚/ranking/mod.ts";
import { Timing } from "📚/timing/mod.ts";
import { default_parameters, type ParameterData } from "📚/trading/mod.ts";

export class Assets {
  public readonly config: Config;
  public readonly community: Community;
  public readonly testcommunity: TestCommunity;
  public readonly ranking: InvestorRanking;

  constructor(private readonly repo: Backend) {
    this.config = new Config(repo);
    this.community = new Community(repo);
    this.testcommunity = new TestCommunity(repo);
    this.ranking = new InvestorRanking(repo);
  }

  /** Create backend using disk repository */
  public static disk(diskpath: string): Assets {
    const disk = new DiskBackend(diskpath);
    const repo = new CachingBackend(disk);
    return new Assets(repo);
  }

  /** Create backend using heap */
  public static heap(): Assets {
    const repo = new HeapBackend();
    return new Assets(repo);
  }

  /** Initiate Timing model with parameters from config */
  public async timing(): Promise<Timing> {
    // TODO: Doesn't belong here. 
    // This code should not impose defaults. 
    // Higher level code should decide how to handle potential missing data.
    // Ranking also leaves decision to higher level code.
    const settings = await this.config.get("trading") as ParameterData ||
      default_parameters;
    const model = new Timing(
      settings.smoothing,
      settings.buy_threshold,
      settings.sell_threshold,
    );
    return model;
  }
}
