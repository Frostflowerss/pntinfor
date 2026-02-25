export type CVEmployment = {
  company: string;
  timeframe: string;
  role: string;
  achievements: string[];
};

export type CVEducation = {
  institution: string;
  timeframe: string;
  degree: string;
};

export type CVCourse = {
  title: string;
  timeframe: string;
  note: string;
};

export type CVSkill = {
  name: string;
  level: "Beginner" | "Experienced" | "Skillful" | "Expert";
};

export type CVProject = {
  name: string;
  role: string;
  constructionClass: "I" | "II" | "III" | "Special";
};

/**
 * Centralized CV data.
 *
 * Update here to add:
 * - featuredProjects: add/remove projects
 * - employmentHistory: timeline items
 * - softwareSkills: skills and levels
 * - education / courses
 */
export const cv = {
  yearsExperience: 6,

  contact: {
    phone: "+84 888284998",
    email: "Pnt.architect.work@gmail.com",
    address: "S.106 Vinhomes Smart City, Tay Mo, South Tu Liem, Ha Noi",
    pdfDownloadPath: "/files/PNT_CV_Architect_2025_VN-EN-2.pdf",
  },

  professionalSummary: {
    vi: "Kiến trúc sư với hơn 6 năm kinh nghiệm trong các dự án nhà ở, cơ sở giáo dục và quy hoạch đô thị. Thành thạo trong việc phối hợp BIM, triển khai mô hình và nâng cao sự hợp tác trong nhóm. Sử dụng thành thạo Revit, Navisworks, PowerBI, AutoCAD và tài liệu kỹ thuật, thúc đẩy môi trường chia sẻ tri thức và hỗ trợ phát triển đội ngũ thiết kế.",
    en: "Architect with over 6 years of experience in residential, educational, and urban planning projects. Skilled in BIM coordination, model implementation, and enhancing team collaboration. Proficient in Revit, Navisworks, PowerBI, AutoCAD and technical documentation, fostering a knowledge-sharing environment and supporting the development of design team.",
  },

  employmentHistory: [
    {
      company: "EBROS C&T VIETNAM Joint Stock Company",
      timeframe: "2019 – 2021 (Ha Noi)",
      role: "Internship – Drafting – Concept",
      achievements: [
        "Designed and developed concepts for small-scale projects, including spiritual/ancestral worship spaces.",
        "Created interior designs for residential spaces and produced interior/exterior renders.",
        "Prepared detailed architectural and interior construction drawings.",
      ],
    },
    {
      company:
        "DLLC Urban Development and Architectural Design Consultant Joint Stock Company",
      timeframe: "2021 – 2022 (Ha Noi)",
      role: "Conceptual Architect",
      achievements: [
        "Initiated and developed design concepts for educational facilities and urban planning projects.",
        "Participated in master planning concept development with Nikken Sekkei.",
        "Prepared technical drawings and rendered perspectives for large-scale projects.",
      ],
    },
    {
      company:
        "VietNam National Construction Consultants (VNCC) Consultant Joint Stock Company",
      timeframe: "2022 – Present (Ha Noi)",
      role: "Revit Specialist – BIM Coordinator – BIM Manager",
      achievements: [
        "Developed models and implemented drawings for architectural and industrial projects (SD → CD).",
        "Served as BIM Coordinator on large-scale projects; ensured model quality control and interdisciplinary coordination.",
        "Contributed to BIM Execution Plan (BEP) for Long Thanh International Airport; collaborated with Client/GC/QC/Subcontractors.",
        "Conducted internal Revit training sessions and supported junior staff development.",
      ],
    },
  ] satisfies CVEmployment[],

  education: [
    {
      institution: "Ha Noi Architectural University",
      timeframe: "2016 – 2021 (Ha Noi)",
      degree: "The degree of Architect",
    },
  ] satisfies CVEducation[],

  courses: [
    {
      title: "BIM Coordinator Course, Vecas – Autodesk",
      timeframe: "2023 (Ha Noi)",
      note: "BIM Coordinator Certificate",
    },
    {
      title: "The Application of GIS in Construction Planning, Vecas",
      timeframe: "2025 (Ha Noi)",
      note: "Certificate of Completion for GIS Course",
    },
  ] satisfies CVCourse[],

  softwareSkills: {
    left: [
      { name: "Autodesk Revit", level: "Expert" },
      { name: "Autodesk Naviswork", level: "Expert" },
      { name: "Autodesk AutoCAD", level: "Beginner" },
      { name: "Sketch Up", level: "Beginner" },
      { name: "Lumion", level: "Skillful" },
    ] satisfies CVSkill[],
    right: [
      { name: "Adobe Photoshop", level: "Expert" },
      { name: "Adobe Illustrator", level: "Experienced" },
      { name: "Adobe InDesign", level: "Experienced" },
      { name: "Microsoft Power BI", level: "Experienced" },
      { name: "Microsoft Office", level: "Experienced" },
    ] satisfies CVSkill[],
  },

  featuredProjects: [
    {
      name: "Xuan Dai Bay resort and tourism Complex",
      role: "Main deployment",
      constructionClass: "II",
    },
    {
      name: "Vung Lam Phu Yen resort",
      role: "Main deployment",
      constructionClass: "I",
    },
    {
      name: "Bai Lu resort",
      role: "Main deployment",
      constructionClass: "I",
    },
    {
      name: "Social Housing Project: X2 Apartment Complex",
      role: "Main deployment",
      constructionClass: "II",
    },
    {
      name: "Viet – Han College Quang Ninh",
      role: "Main deployment",
      constructionClass: "II",
    },
    {
      name: "Hue golf clubhouse",
      role: "Main deployment – BIM Coordinator",
      constructionClass: "III",
    },
    {
      name: "VTV.S1 television studio and Central Square",
      role: "Main deployment – BIM Coordinator",
      constructionClass: "II",
    },
    {
      name: "Vung Bau golf clubhouse",
      role: "Main deployment",
      constructionClass: "III",
    },
    {
      name: "Viettel Tower Da Nang",
      role: "BIM Coordinator",
      constructionClass: "I",
    },
    {
      name: "Long Thanh international Airport",
      role: "BIM Coordinator | BIM Manager",
      constructionClass: "Special",
    },
  ] satisfies CVProject[],
} as const;
