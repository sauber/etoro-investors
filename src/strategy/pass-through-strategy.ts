import {
  Positions,
  PurchaseOrders,
  Strategy,
  StrategyContext,
} from "@sauber/backtest";

/** Buy all, sell all */
export class PassThroughStrategy implements Strategy {
  public open(context: StrategyContext): PurchaseOrders {
    return context.purchaseorders;
  }

  public close(context: StrategyContext): Positions {
    return context.positions;
  }
}