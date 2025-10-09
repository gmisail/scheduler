import superjson from "superjson";
import type { Course, Section } from "../catalog";
import type { Term } from "@lib/term";

// This allows us to version changes to the schema stored in local storage. It is potentially dangerous, as
// updating it will invalidate _all_ schedules currently in use. Be very careful when updating it. In the future
// it might be useful to migrate data instead.
const STATE_VERSION = 1;

export type ScheduleState = {
  selected: Set<string>;
  courses: Map<string, Course>;
  numCourses: Map<string, number>;
};

function stateKey(term: Term): string {
  return `schedule#${term.id}#${STATE_VERSION}`;
}

/**
 * Add or remove a section from the schedule context.
 * @param section Section to add
 * @param course Course associated to the section
 * @returns Modified state
 */
export function toggleSection(
  term: Term,
  section: Section,
  course: Course,
): ScheduleState {
  const state = getTermState(term);

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

  saveTermState(term, state);

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

/**
 * Load a schedule's current state for a given term.
 * @param term
 * @returns
 */
export function getTermState(term: Term): ScheduleState {
  const buffer = window.localStorage.getItem(stateKey(term));

  if (buffer) {
    return superjson.parse<ScheduleState>(buffer);
  } else {
    return {
      selected: new Set(),
      courses: new Map(),
      numCourses: new Map(),
    };
  }
}

function saveTermState(term: Term, state: ScheduleState) {
  const buffer = superjson.stringify(state);
  window.localStorage.setItem(stateKey(term), buffer);
}
