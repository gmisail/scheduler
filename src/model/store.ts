import { persistentMap } from "@nanostores/persistent";

export type ScheduleState = {
  selected: Set<string>;
};

export const scheduleState = persistentMap<ScheduleState>(
  "schedule",
  {
    selected: new Set<string>(),
  },
  {
    encode(selected) {
      return JSON.stringify([...selected]);
    },
    decode(value) {
      try {
        const selectedArr = JSON.parse(value);
        return new Set<string>(selectedArr);
      } catch (e) {
        console.error(e);
        return new Set<string>();
      }
    },
  },
);
