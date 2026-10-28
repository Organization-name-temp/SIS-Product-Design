export type Student = {
  id: string;
  name: string;
  email: string;
  program: string;
  year: number;
  gpa: number;
  credits: number;
  status: "Registered" | "On hold" | "Needs review";
};

export const initialStudents: Student[] = [
  {
    id: "2026-0142",
    name: "Omar Khaled",
    email: "omar.khaled@ejust.edu.eg",
    program: "Computer Engineering",
    year: 2,
    gpa: 3.4,
    credits: 18,
    status: "Registered",
  },
  {
    id: "2026-0286",
    name: "Mariam Adel",
    email: "mariam.adel@ejust.edu.eg",
    program: "Business Administration",
    year: 3,
    gpa: 3.8,
    credits: 15,
    status: "On hold",
  },
  {
    id: "2026-0315",
    name: "Youssef Nabil",
    email: "youssef.nabil@ejust.edu.eg",
    program: "Computer Engineering",
    year: 1,
    gpa: 2.9,
    credits: 18,
    status: "Registered",
  },
  {
    id: "2026-0401",
    name: "Salma Hassan",
    email: "salma.hassan@ejust.edu.eg",
    program: "Architecture",
    year: 4,
    gpa: 3.9,
    credits: 21,
    status: "Registered",
  },
  {
    id: "2026-0523",
    name: "Karim Fouad",
    email: "karim.fouad@ejust.edu.eg",
    program: "Mechanical Engineering",
    year: 2,
    gpa: 2.1,
    credits: 12,
    status: "Needs review",
  },
  {
    id: "2026-0618",
    name: "Farida Mostafa",
    email: "farida.mostafa@ejust.edu.eg",
    program: "Business Administration",
    year: 1,
    gpa: 3.7,
    credits: 18,
    status: "Registered",
  },
  {
    id: "2026-0724",
    name: "Ahmed Tarek",
    email: "ahmed.tarek@ejust.edu.eg",
    program: "Architecture",
    year: 3,
    gpa: 3.2,
    credits: 15,
    status: "On hold",
  },
  {
    id: "2026-0810",
    name: "Hana Ibrahim",
    email: "hana.ibrahim@ejust.edu.eg",
    program: "Mechanical Engineering",
    year: 2,
    gpa: 3.6,
    credits: 18,
    status: "Registered",
  },
  {
    id: "2026-0936",
    name: "Ali Sherif",
    email: "ali.sherif@ejust.edu.eg",
    program: "Computer Engineering",
    year: 4,
    gpa: 3.5,
    credits: 18,
    status: "Registered",
  },
  {
    id: "2026-1045",
    name: "Laila Hossam",
    email: "laila.hossam@ejust.edu.eg",
    program: "Architecture",
    year: 1,
    gpa: 3.3,
    credits: 15,
    status: "Registered",
  },
  {
    id: "2026-1132",
    name: "Mostafa Hany",
    email: "mostafa.hany@ejust.edu.eg",
    program: "Business Administration",
    year: 3,
    gpa: 2.4,
    credits: 12,
    status: "Needs review",
  },
  {
    id: "2026-1208",
    name: "Dina Samir",
    email: "dina.samir@ejust.edu.eg",
    program: "Mechanical Engineering",
    year: 2,
    gpa: 3.8,
    credits: 18,
    status: "Registered",
  },
];

export const programs = [
  ...new Set(initialStudents.map((student) => student.program)),
];
export const courses = [
  {
    code: "MATH 201",
    title: "Calculus II",
    department: "Mathematics",
    instructor: "Dr. Rania Mostafa",
    credits: 3,
    enrolled: 84,
    capacity: 100,
    schedule: "Sunday & Tuesday · 10:00–11:30",
    room: "Science Building · A204",
  },
  {
    code: "CSE 301",
    title: "Data Structures",
    department: "Computer Engineering",
    instructor: "Dr. Ahmed Soliman",
    credits: 3,
    enrolled: 60,
    capacity: 60,
    schedule: "Monday & Wednesday · 09:00–10:30",
    room: "Engineering Building · B102",
  },
  {
    code: "BUS 102",
    title: "Principles of Management",
    department: "Business Administration",
    instructor: "Dr. Sara Adel",
    credits: 3,
    enrolled: 72,
    capacity: 90,
    schedule: "Sunday & Tuesday · 12:00–13:30",
    room: "Business Building · C301",
  },
  {
    code: "ARC 204",
    title: "Architectural Design II",
    department: "Architecture",
    instructor: "Dr. Mohamed Nasser",
    credits: 4,
    enrolled: 28,
    capacity: 30,
    schedule: "Monday & Thursday · 10:00–13:00",
    room: "Design Studio · D108",
  },
  {
    code: "MEC 202",
    title: "Engineering Mechanics",
    department: "Mechanical Engineering",
    instructor: "Dr. Hala Youssef",
    credits: 3,
    enrolled: 45,
    capacity: 60,
    schedule: "Tuesday & Thursday · 09:00–10:30",
    room: "Engineering Building · B206",
  },
  {
    code: "ENG 101",
    title: "Academic English",
    department: "Languages",
    instructor: "Dr. Nour Hassan",
    credits: 2,
    enrolled: 38,
    capacity: 50,
    schedule: "Monday & Wednesday · 13:00–14:00",
    room: "Main Building · A105",
  },
];

export type Page =
  "overview" | "students" | "courses" | "assistant" | "settings" | "gallery";
export const pageNames: Record<Page, string> = {
  overview: "Overview",
  students: "Students",
  courses: "Course catalog",
  assistant: "Registrar assistant",
  settings: "Institution settings",
  gallery: "Component gallery",
};

export function readSaved<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) || "null") ?? fallback;
  } catch {
    return fallback;
  }
}

export function saveLocal(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function downloadStudents(students: Student[]) {
  const fields = [
    "id",
    "name",
    "email",
    "program",
    "year",
    "gpa",
    "credits",
    "status",
  ] as const;
  const cell = (value: string | number) => {
    const text = String(value);
    return `"${(/^[=+@\-\t\r]/.test(text) ? "'" : "") + text.replaceAll('"', '""')}"`;
  };
  const csv = [
    fields.join(","),
    ...students.map((student) =>
      fields.map((field) => cell(student[field])).join(","),
    ),
  ].join("\r\n");
  const url = URL.createObjectURL(
    new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "sis-students-fall-2026.csv";
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export type InstitutionSettings = {
  office: string;
  email: string;
  opens: string;
  closes: string;
  credits: string;
  notifications: boolean;
};
export const defaultSettings: InstitutionSettings = {
  office: "Registrar office",
  email: "registrar@ejust.edu.eg",
  opens: "2026-08-24",
  closes: "2026-10-30",
  credits: "21",
  notifications: true,
};
export const previewDate = "2026-10-28";
export function windowStatus(settings: InstitutionSettings) {
  if (settings.opens > previewDate) return "Registration upcoming";
  return settings.closes < previewDate
    ? "Registration closed"
    : "Registration open";
}
