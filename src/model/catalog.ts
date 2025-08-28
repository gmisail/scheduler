export type Block = {
  crn: number;
  sec: string;
  building: string;
  room: string;
  instructor: string;
  start_time: string;
  end_time: string;
  day: string;
};

export type Section = {
  id: string;
  crn: number;
  sec: string;
  blocks: Block[];
};

export type CourseData = {
  id: string;
  subject: string;
  number: string;
  title: string;
  description: string;
  sections: Section[];
};

export type CatalogItem = {
  course: CourseData;
};
