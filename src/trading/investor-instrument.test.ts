import { assertEquals, assertInstanceOf } from "@std/assert";
import { InvestorInstrument } from "📚/trading/investor-instrument.ts";
import { investor } from "📚/trading/testdata.ts";
import { DateFormat, diffDate, today } from "📚/time/mod.ts";
import { Bar, Price } from "@sauber/backtest";

Deno.test("Instance", () => {
  assertInstanceOf(new InvestorInstrument(investor), InvestorInstrument);
});

Deno.test("Start is unchanged", () => {
  const startDate: DateFormat = investor.chart.start;
  const investorStart = diffDate(startDate, today());
  const instr = new InvestorInstrument(investor);
  const instrumetStart: Bar = instr.start;
  assertEquals(instrumetStart, investorStart);
});

Deno.test("Extend End", () => {
  const offset = 2;
  const endDate: DateFormat = investor.chart.end;
  const investorEnd = diffDate(endDate, today());
  const instr = new InvestorInstrument(investor);
  const instrumetEnd: Bar = instr.end;
  assertEquals(instrumetEnd, investorEnd - offset);
});

Deno.test("Confirm price availability to offset", () => {
  const endDate: DateFormat = investor.chart.end;
  const price: Price = investor.chart.last;
  const investorEnd = diffDate(endDate, today());
  const instr = new InvestorInstrument(investor);
  const instrumetEnd: Bar = instr.end;

  for (let bar = investorEnd; bar >= instrumetEnd; bar--) {
    assertEquals(instr.price(bar), price);
  }
});