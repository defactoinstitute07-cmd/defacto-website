export type SubjectChapterRecord = {
  subjectName: string;
  assignedTeacherId?: string | null;
};

export type CourseResultsRecord = {
  year: string;
  percentage: string;
  highlight: string;
  stats: { label: string; value: string }[];
};

export type CourseChapterRecord = {
  courseSlug: string;
  assignedTeacherIds?: string[];
  subjects: SubjectChapterRecord[];
  results?: CourseResultsRecord;
};

export type CourseChapterCatalog = {
  courses: CourseChapterRecord[];
};
