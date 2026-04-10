export interface Course {
  id: string;
  slug: string;
  title: string;
  variant: string;
  description: string;
  subjects: string[];
  accentColor: string;
  lightBg: string;
  iconColor: string;
  headerImageUrl: string;
  teachers: { name: string; designation: string; imageUrl: string }[];
  results: { year: string; highlight: string; percentage: string; stats: { label: string; value: string }[] };
}

export const COURSES_DATA: Course[] = [
  {
    id: "c4-8-all",
    slug: "class-4-to-8-all-subjects",
    title: "Class 4 to 8",
    variant: "All Subjects",
    description:
      "Complete academic support for Classes 4 to 8 across all major school subjects, with concept-building, homework guidance, and regular progress checks.",
    subjects: ["Mathematics", "Science", "English", "Social Studies", "Hindi"],
    accentColor: "from-cyan-500 to-sky-600",
    lightBg: "bg-cyan-50",
    iconColor: "text-cyan-600",
    headerImageUrl:
      "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&q=80&w=1600",
    teachers: [
      {
        name: "Mr. Gopal Negi",
        designation: "Foundation Program Mentor",
        imageUrl:
          "https://res.cloudinary.com/dmswb6fya/image/upload/v1775581707/de-facto/kkoyiko8qr6ppzesg7gf.jpg",
      },
      {
        name: "Mrs. Meera Joshi",
        designation: "Primary & Middle School Specialist",
        imageUrl:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200",
      },
    ],
    results: {
      year: "2024-25",
      highlight:
        "Strong class performance with visible improvement in fundamentals, confidence, and school exam readiness.",
      percentage: "95%",
      stats: [
        { label: "Students Improved", value: "40+" },
        { label: "Core Subjects", value: "5" },
        { label: "Parent Satisfaction", value: "98%" },
      ],
    },
  },
  {
    id: "c9-cbse",
    slug: "class-9-cbse",
    title: "Class 9",
    variant: "CBSE",
    description: "Build a rock-solid foundation for board exams with our comprehensive CBSE curriculum coverage.",
    subjects: ["Mathematics", "Physics", "Chemistry", "Biology"],
    accentColor: "from-blue-500 to-indigo-600",
    lightBg: "bg-blue-50",
    iconColor: "text-blue-600",
    headerImageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1600",
    teachers: [
      {
        name: "Mr. Gopal Negi",
        designation: "Senior Mathematics & Science Faculty",
        imageUrl: "https://res.cloudinary.com/dmswb6fya/image/upload/v1775581707/de-facto/kkoyiko8qr6ppzesg7gf.jpg",
      },
      {
        name: "Mrs. Meera Joshi",
        designation: "Expert Science Specialist",
        imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200",
      }
    ],
    results: {
      year: "2024-25",
      highlight: "Excellent academic performance with consistent top scores.",
      percentage: "96%",
      stats: [
        { label: "Distinctions", value: "25+" },
        { label: "Perfect Scores", value: "8" },
        { label: "Overall Pass", value: "100%" }
      ],
    },
  },
  {
    id: "c9-icse",
    slug: "class-9-icse",
    title: "Class 9",
    variant: "ICSE",
    description: "Master the detailed ICSE syllabus with focused modules designed for conceptual depth and rigor.",
    subjects: ["Mathematics", "Physics", "Chemistry", "Biology"],
    accentColor: "from-indigo-500 to-purple-600",
    lightBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    headerImageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=1600",
    teachers: [
      {
        name: "Mr. Gopal Negi",
        designation: "Senior Mathematics & Science Faculty",
        imageUrl: "https://res.cloudinary.com/dmswb6fya/image/upload/v1775581707/de-facto/kkoyiko8qr6ppzesg7gf.jpg",
      }
    ],
    results: {
      year: "2024-25",
      highlight: "Rigorous ICSE standards met with exceptional clarity.",
      percentage: "94%",
      stats: [
        { label: "Merits", value: "15+" },
        { label: "Subject Toppers", value: "5" },
        { label: "Overall Pass", value: "100%" }
      ],
    },
  },
  {
    id: "c10-cbse",
    slug: "class-10-cbse",
    title: "Class 10",
    variant: "CBSE",
    description: "Ace your first board exams with high-impact revision, mock tests, and answer-writing mastery.",
    subjects: ["Mathematics", "Physics", "Chemistry", "Biology"],
    accentColor: "from-emerald-500 to-teal-600",
    lightBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    headerImageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1600",
    teachers: [
      {
        name: "Mr. Gopal Negi",
        designation: "Head of Institute & Senior Faculty",
        imageUrl: "https://res.cloudinary.com/dmswb6fya/image/upload/v1775581707/de-facto/kkoyiko8qr6ppzesg7gf.jpg",
      },
      {
        name: "Dr. Anuj Sharma",
        designation: "Biology & Chemistry Expert",
        imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200&h=200",
      }
    ],
    results: {
      year: "2024-25",
      highlight: "Outstanding board results with multiple school toppers.",
      percentage: "98%",
      stats: [
        { label: "Above 90%", value: "22" },
        { label: "Perfect 100s", value: "12" },
        { label: "Avg Score", value: "88%" }
      ],
    },
  },
  {
    id: "c10-icse",
    slug: "class-10-icse",
    title: "Class 10",
    variant: "ICSE",
    description: "Strategic preparation for ICSE boards focusing on complex concepts and high-scoring techniques.",
    subjects: ["Mathematics", "Physics", "Chemistry", "Biology"],
    accentColor: "from-orange-500 to-amber-600",
    lightBg: "bg-orange-50",
    iconColor: "text-orange-600",
    headerImageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1600",
    teachers: [
      {
        name: "Mr. Gopal Negi",
        designation: "Senior Science Expert",
        imageUrl: "https://res.cloudinary.com/dmswb6fya/image/upload/v1775581707/de-facto/kkoyiko8qr6ppzesg7gf.jpg",
      }
    ],
    results: {
      year: "2024-25",
      highlight: "Exceptional mastery of ICSE board requirements.",
      percentage: "97%",
      stats: [
        { label: "Distinctions", value: "18" },
        { label: "Merit Holders", value: "6" },
        { label: "Overall Pass", value: "100%" }
      ],
    },
  },
  {
    id: "c11",
    slug: "class-11-science",
    title: "Class 11",
    variant: "Science",
    description: "Transition smoothly to higher secondary education with in-depth focus on specialized subjects.",
    subjects: ["Mathematics", "Physics", "Chemistry", "Biology"],
    accentColor: "from-rose-500 to-pink-600",
    lightBg: "bg-rose-50",
    iconColor: "text-rose-600",
    headerImageUrl: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&q=80&w=1600",
    teachers: [
      {
        name: "Mr. Gopal Negi",
        designation: "Mathematics Specialist",
        imageUrl: "https://res.cloudinary.com/dmswb6fya/image/upload/v1775581707/de-facto/kkoyiko8qr6ppzesg7gf.jpg",
      }
    ],
    results: {
      year: "2024-25",
      highlight: "Solid conceptual base for upcoming board and entrance exams.",
      percentage: "92%",
      stats: [
        { label: "A+ Grades", value: "30+" },
        { label: "Concept Ready", value: "95%" },
        { label: "Pass Rate", value: "100%" }
      ],
    },
  },
  {
    id: "c12",
    slug: "class-12-science",
    title: "Class 12",
    variant: "Science",
    description: "The ultimate preparation for board results and competitive entrance benchmarks.",
    subjects: ["Mathematics", "Physics", "Chemistry", "Biology"],
    accentColor: "from-violet-500 to-purple-600",
    lightBg: "bg-violet-50",
    iconColor: "text-violet-600",
    headerImageUrl: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=1600",
    teachers: [
      {
        name: "Mr. Gopal Negi",
        designation: "Advanced Physics & Math",
        imageUrl: "https://res.cloudinary.com/dmswb6fya/image/upload/v1775581707/de-facto/kkoyiko8qr6ppzesg7gf.jpg",
      }
    ],
    results: {
      year: "2024-25",
      highlight: "Stellar performance in boards and entrance exams like JEE/NEET.",
      percentage: "99%",
      stats: [
        { label: "IIT/NEET Qualify", value: "12" },
        { label: "Board Distinction", value: "45+" },
        { label: "Top Percentile", value: "99.8" }
      ],
    },
  },
];
