import { IntegerParameter, Parameter, Parameters } from "@sauber/optimize";

type Weekday = number;
type Smoothing = number;
type BuyThreshold = number;
type SellThreshold = number;
type PositionSize = number;
type StopLoss = number;
type Limit = number;

/** Parameters to strategies */
export type ParameterData = {
  weekday: Weekday;
  smoothing: Smoothing;
  buy_threshold: BuyThreshold;
  sell_threshold: SellThreshold;
  position_size: PositionSize;
  stoploss: StopLoss;
  limit: Limit;
};

/** Default parameter values */
export const default_parameters: ParameterData = {
  weekday: 1,
  smoothing: 14,
  buy_threshold: 30,
  sell_threshold: 70,
  position_size: 0.1,
  stoploss: 0.85,
  limit: 1,
};

/** Only the values in sequence */
export type ParameterValues = [
  Weekday,
  Smoothing,
  BuyThreshold,
  SellThreshold,
  PositionSize,
  StopLoss,
  Limit,
];

/** Generate list of parameters optionally with initial values */
export function makeParameters(value: ParameterValues | [] = []): Parameters {
  return [
    new IntegerParameter("weekday", 1, 5, value[0]),
    new IntegerParameter("smoothing", 3, 30, value[1]),
    new IntegerParameter("buy_threshold", 5, 45, value[2]),
    new IntegerParameter("sell_threshold", 55, 95, value[3]),
    new Parameter("position_size", 0.01, 0.07, value[4]),
    new Parameter("stoploss", 0.05, 0.95, value[5]),
    new IntegerParameter("limit", 1, 5, value[6]),
  ];
}
