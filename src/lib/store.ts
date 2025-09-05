import { persistentMap } from "@nanostores/persistent";
import type { CourseData, Section } from "./catalog";

class ScheduleState {
  selected: Set<string>;

  courses: Map<string, CourseData>;
  numCourses: Map<string, number>;

  constructor() {
    this.selected = new Set<string>();
    this.courses = new Map();
    this.numCourses = new Map();
  }

  /**
   * Add or remove a section from the schedule context.
   * @param section Section to add
   * @param course Course associated to the section
   * @returns Modified state
   */
  toggleSection(section: Section, course: CourseData): ScheduleState {
    let numCourse = this.numCourses.get(course.id) ?? 0;

    if (this.isSectionSelected(section)) {
      this.selected.delete(section.id);
      numCourse--;
    } else {
      this.selected.add(section.id);
      numCourse++;
    }

    if (numCourse > 0) {
      this.courses.set(course.id, course);
      this.numCourses.set(course.id, numCourse);
    } else {
      this.courses.delete(course.id);
      this.numCourses.delete(course.id);
    }

    return this;
  }

  /**
   * Check if a section is currently selected.
   * @param section Section to check for existence of
   * @returns Whether or not section is selected
   */
  isSectionSelected(section: Section): boolean {
    return this.selected.has(section.id);
  }

  encode() {
    const selected = [...this.selected];

    return JSON.stringify({
      courses: [...this.courses.entries()],
      numCourses: [...this.numCourses.entries()],
      selected,
    });
  }

  decode(payload: string) {
    try {
      const state = JSON.parse(payload);

      let schedule = new ScheduleState();

      schedule.selected = new Set<string>([...state?.selected]);
      schedule.courses = new Map(state?.courses ?? []);
      schedule.numCourses = new Map(state?.numCourses ?? []);

      return schedule;
    } catch (e) {
      console.error(e);
      return new ScheduleState();
    }
  }
}

interface ScheduleStore {
  schedule: ScheduleState;
}

export const scheduleState = persistentMap<ScheduleStore>(
  "schedule",
  {
    schedule: new ScheduleState(),
  },
  {
    encode(schedule) {
      return schedule.encode();
    },
    decode(schedule) {
      return new ScheduleState().decode(schedule);
    },
  },
);
