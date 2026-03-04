export enum DayOfWeek {
  Monday = "monday",
  Tuesday = "tuesday",
  Wednesday = "wednesday",
  Thursday = "thursday",
  Friday = "friday",
  Saturday = "saturday",
  Sunday = "sunday",
}

export enum OpeningHoursField {
  Enabled = "enabled",
  OpenTime = "openTime",
  CloseTime = "closeTime",
}

export interface DayOpeningHours {
  [OpeningHoursField.Enabled]: boolean;
  [OpeningHoursField.OpenTime]: string;
  [OpeningHoursField.CloseTime]: string;
}

export type OpeningHoursMap = Record<DayOfWeek, DayOpeningHours>;

export const DAYS_ORDERED: DayOfWeek[] = [
  DayOfWeek.Monday,
  DayOfWeek.Tuesday,
  DayOfWeek.Wednesday,
  DayOfWeek.Thursday,
  DayOfWeek.Friday,
  DayOfWeek.Saturday,
  DayOfWeek.Sunday,
];

export const DAY_LABELS: Record<DayOfWeek, string> = {
  [DayOfWeek.Monday]: "Monday",
  [DayOfWeek.Tuesday]: "Tuesday",
  [DayOfWeek.Wednesday]: "Wednesday",
  [DayOfWeek.Thursday]: "Thursday",
  [DayOfWeek.Friday]: "Friday",
  [DayOfWeek.Saturday]: "Saturday",
  [DayOfWeek.Sunday]: "Sunday",
};

export const EMPTY_OPENING_HOURS: OpeningHoursMap = {
  [DayOfWeek.Monday]: { [OpeningHoursField.Enabled]: false, [OpeningHoursField.OpenTime]: "09:00", [OpeningHoursField.CloseTime]: "18:00" },
  [DayOfWeek.Tuesday]: { [OpeningHoursField.Enabled]: false, [OpeningHoursField.OpenTime]: "09:00", [OpeningHoursField.CloseTime]: "18:00" },
  [DayOfWeek.Wednesday]: { [OpeningHoursField.Enabled]: false, [OpeningHoursField.OpenTime]: "09:00", [OpeningHoursField.CloseTime]: "18:00" },
  [DayOfWeek.Thursday]: { [OpeningHoursField.Enabled]: false, [OpeningHoursField.OpenTime]: "09:00", [OpeningHoursField.CloseTime]: "18:00" },
  [DayOfWeek.Friday]: { [OpeningHoursField.Enabled]: false, [OpeningHoursField.OpenTime]: "09:00", [OpeningHoursField.CloseTime]: "18:00" },
  [DayOfWeek.Saturday]: { [OpeningHoursField.Enabled]: false, [OpeningHoursField.OpenTime]: "09:00", [OpeningHoursField.CloseTime]: "18:00" },
  [DayOfWeek.Sunday]: { [OpeningHoursField.Enabled]: false, [OpeningHoursField.OpenTime]: "09:00", [OpeningHoursField.CloseTime]: "18:00" },
};
