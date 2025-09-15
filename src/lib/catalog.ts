export type BlocksByDay = {
  day: string;
  blocks: BlockItem[];
};

export type BlockItem = {
  crn: number;
  sec: string;
  building: string;
  room: string;
  instructor: string;
  start_time: string;
  end_time: string;
  day: string;
};

export type SectionItem = {
  id: string;
  crn: number;
  sec: string;
  days: BlocksByDay[];
};

export type CourseItem = {
  id: string;
  subject: string;
  number: string;
  title: string;
  description: string;
  sections: SectionItem[];
};

export type CatalogItem = {
  course: CourseItem;
};

export type Block = {
  crn: number;
  sec: string;
  building: string;
  room: string;
  instructor: string;
  start_time: number;
  end_time: number;
  day: string;
};

export type Section = {
  id: string;
  course_id: string;
  crn: number;
  sec: string;
  days: Map<string, Block[]>;
};

export type Course = {
  id: string;
  subject: string;
  number: string;
  title: string;
  description: string;
  sections: Section[];
};

export function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

export function generateSchedules(
  courses: Course[],
  index: number,
  current: Section[],
  results: Section[][],
) {
  // Base case: if we've processed all courses, add the current schedule to results
  if (index === courses.length) {
    results.push([...current]);
    return;
  }

  // Recursive case: try each section of the current course
  for (const section of courses[index].sections) {
    let conflict = false;

    // Check for conflicts with already selected sections
    for (const selected of current) {
      if (sectionsOverlap(selected, section)) {
        conflict = true;
        break;
      }
    }

    // If no conflicts, add this section and recurse
    if (!conflict) {
      current.push(section);
      generateSchedules(courses, index + 1, current, results);
      current.pop(); // Backtrack
    }
  }
}

export function blocksOverlap(block1: Block, block2: Block): boolean {
  if (block1.day !== block2.day) {
    return false;
  }

  const start1 = block1.start_time;
  const end1 = block1.end_time;
  const start2 = block2.start_time;
  const end2 = block2.end_time;

  return start1 < end2 && start2 < end1;
}

export function sectionsOverlap(a: Section, b: Section): boolean {
  if (a.crn == b.crn) {
    return true;
  }

  const byDay = (item: BlocksByDay) => item.day;

  for (const day in a.days) {
    const aDayGroups = a.days.get(day);
    const bDayGroups = b.days.get(day);

    if (aDayGroups && bDayGroups) {
      for (const blockA of aDayGroups) {
        for (const blockB of bDayGroups) {
          if (blocksOverlap(blockA, blockB)) {
            return true;
          }
        }
      }
    }
  }

  return false;
}
