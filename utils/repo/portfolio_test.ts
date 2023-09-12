import { assertInstanceOf, assert } from "assert";
import { Repo } from "./repo.ts";
import { Portfolio, PortfolioData } from "./portfolio.ts";

Deno.test("Portfolio", async (t) => {
  const repo = await Repo.tmp();
  const name = "JeppeKirkBonde";
  const cis = 2988943;
  const portfolio: Portfolio = new Portfolio(repo, name, cis);
  assertInstanceOf(portfolio, Portfolio);

  await t.step("download", async () => {
    const value: PortfolioData = await portfolio.download();
    assert(value.AggregatedPositions.length > 0);
  });

  await repo.delete();
});