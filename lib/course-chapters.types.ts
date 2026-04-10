export const chapterStatusOptions = ["ongoing", "completed"] as const;

export type ChapterStatus = (typeof chapterStatusOptions)[number];

export type ChapterRecord = {
  id: string;
  title: string;
  status: ChapterStatus;
};

export type SubjectChapterRecord = {
  subjectName: string;
  chapters: ChapterRecord[];
};

export type CourseChapterRecord = {
  courseSlug: string;
  subjects: SubjectChapterRecord[];
};

export type CourseChapterCatalog = {
  courses: CourseChapterRecord[];
};
