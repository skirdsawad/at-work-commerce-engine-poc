import { DayOfWeek } from "./opening-hours";

export enum PriceRuleType {
  AsRequested = "asRequested",
  TimeRange = "timeRange",
  Hours = "hours",
}

export const PRICE_RULE_LABELS: Record<PriceRuleType, string> = {
  [PriceRuleType.AsRequested]: "As requested",
  [PriceRuleType.TimeRange]: "Time Range",
  [PriceRuleType.Hours]: "Hours",
};

export enum TimeRangeRuleField {
  FromTime = "fromTime",
  ToTime = "toTime",
  Price = "price",
}

export enum HoursRuleField {
  MaxHours = "maxHours",
  Price = "price",
}

export enum DayPricingField {
  RuleType = "ruleType",
  TimeRangeRules = "timeRangeRules",
  HoursRules = "hoursRules",
}

export interface TimeRangeRule {
  [TimeRangeRuleField.FromTime]: string;
  [TimeRangeRuleField.ToTime]: string;
  [TimeRangeRuleField.Price]: string;
}

export interface HoursRule {
  [HoursRuleField.MaxHours]: string;
  [HoursRuleField.Price]: string;
}

export interface DayPricing {
  [DayPricingField.RuleType]: PriceRuleType;
  [DayPricingField.TimeRangeRules]: TimeRangeRule[];
  [DayPricingField.HoursRules]: HoursRule[];
}

export type PricingMap = Record<DayOfWeek, DayPricing>;

export const EMPTY_TIME_RANGE_RULE: TimeRangeRule = {
  [TimeRangeRuleField.FromTime]: "09:00",
  [TimeRangeRuleField.ToTime]: "18:00",
  [TimeRangeRuleField.Price]: "",
};

export const EMPTY_HOURS_RULE: HoursRule = {
  [HoursRuleField.MaxHours]: "",
  [HoursRuleField.Price]: "",
};

const EMPTY_DAY_PRICING: DayPricing = {
  [DayPricingField.RuleType]: PriceRuleType.AsRequested,
  [DayPricingField.TimeRangeRules]: [],
  [DayPricingField.HoursRules]: [],
};

export const EMPTY_PRICING: PricingMap = {
  [DayOfWeek.Monday]: { ...EMPTY_DAY_PRICING, [DayPricingField.TimeRangeRules]: [], [DayPricingField.HoursRules]: [] },
  [DayOfWeek.Tuesday]: { ...EMPTY_DAY_PRICING, [DayPricingField.TimeRangeRules]: [], [DayPricingField.HoursRules]: [] },
  [DayOfWeek.Wednesday]: { ...EMPTY_DAY_PRICING, [DayPricingField.TimeRangeRules]: [], [DayPricingField.HoursRules]: [] },
  [DayOfWeek.Thursday]: { ...EMPTY_DAY_PRICING, [DayPricingField.TimeRangeRules]: [], [DayPricingField.HoursRules]: [] },
  [DayOfWeek.Friday]: { ...EMPTY_DAY_PRICING, [DayPricingField.TimeRangeRules]: [], [DayPricingField.HoursRules]: [] },
  [DayOfWeek.Saturday]: { ...EMPTY_DAY_PRICING, [DayPricingField.TimeRangeRules]: [], [DayPricingField.HoursRules]: [] },
  [DayOfWeek.Sunday]: { ...EMPTY_DAY_PRICING, [DayPricingField.TimeRangeRules]: [], [DayPricingField.HoursRules]: [] },
};
