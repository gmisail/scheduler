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
  if (index === courses.length) {
    results.push([...current]);
    return;
  }

  for (const section of courses[index].sections) {
    let conflict = false;

    for (const selected of current) {
      if (sectionsOverlap(selected, section)) {
        conflict = true;
        break;
      }
    }

    if (!conflict) {
      current.push(section);
      generateSchedules(courses, index + 1, current, results);
      current.pop();
    }
  }
}

export function sectionsOverlap(a: Section, b: Section): boolean {
  if (a.crn == b.crn) {
    return true;
  }

  const aBlocks = a.days
    .values()
    .flatMap((blocks) => blocks)
    .toArray();

  const bBlocks = b.days
    .values()
    .flatMap((blocks) => blocks)
    .toArray();

  for (const aBlock of aBlocks) {
    for (const bBlock of bBlocks) {
      if (blocksOverlap(aBlock, bBlock)) {
        return true;
      }
    }
  }

  return false;
}

export function blocksOverlap(a: Block, b: Block): boolean {
  if (a.day !== b.day) {
    return false;
  }

  if (b.start_time >= a.end_time) {
    return false;
  }

  if (a.start_time >= b.end_time) {
    return false;
  }

  return true;
}

export function ingestCourseItem(course: CourseItem): Course {
  const sections = course.sections
    .map((section): Section => {
      const days = new Map(
        section.days.map((day) => {
          const blocks = day.blocks
            .map((block) => {
              return {
                ...block,
                day: day.day,
                start_time: timeToMinutes(block.start_time),
                end_time: timeToMinutes(block.end_time),
              };
            })
            .toSorted((a, b) => a.start_time - b.start_time);

          return [day.day, blocks];
        }),
      );

      return {
        id: section.id,
        course_id: course.id,
        crn: section.crn,
        sec: section.sec,
        days,
      };
    })
    .toSorted((a: Section, b: Section) => {
      return a.crn - b.crn;
    });

  return {
    ...course,
    sections,
  };
}
