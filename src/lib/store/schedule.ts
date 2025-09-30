import superjson from "superjson";
import { persistentMap } from "@nanostores/persistent";
import type { Course, Section } from "../catalog";

export type ScheduleStore = {
  schedule: ScheduleState;
};

export type ScheduleState = {
  selected: Set<string>;
  courses: Map<string, Course>;
  numCourses: Map<string, number>;
};

/**
 * Add or remove a section from the schedule context.
 * @param section Section to add
 * @param course Course associated to the section
 * @returns Modified state
 */
export function toggleSection(
  state: ScheduleState,
  section: Section,
  course: Course,
): ScheduleState {
  let numCourse = state.numCourses.get(course.id) ?? 0;

  if (isSectionSelected(state, section)) {
    state.selected.delete(section.id);
    numCourse--;
  } else {
    state.selected.add(section.id);
    numCourse++;
  }

  if (numCourse > 0) {
    state.courses.set(course.id, course);
    state.numCourses.set(course.id, numCourse);
  } else {
    state.courses.delete(course.id);
    state.numCourses.delete(course.id);
  }

  return state;
}

/**
 * Check if a section is currently selected.
 * @param section Section to check for existence of
 * @returns Whether or not section is selected
 */
export function isSectionSelected(
  state: ScheduleState,
  section: Section,
): boolean {
  return state.selected.has(section.id);
}

export function getScheduleState(id: string) {
  return persistentMap<ScheduleStore>(
    id + "#",
    {
      schedule: {
        selected: new Set(),
        courses: new Map(),
        numCourses: new Map(),
      },
    },
    {
      encode(schedule) {
        return superjson.stringify(schedule);
      },
      decode(schedule) {
        return superjson.parse<ScheduleState>(schedule);
      },
    },
  );
}
