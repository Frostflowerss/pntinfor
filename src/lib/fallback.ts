import type { SiteData, SkillLevel } from "./types";

const levelPercent: Record<SkillLevel, number> = {
  Expert: 100,
  Experienced: 78,
  Skillful: 58,
  Beginner: 32,
};

function skill(title: string, level: SkillLevel, i: number) {
  return { id: `s-${i}`, title, level, percent: levelPercent[level], sortOrder: i };
}

const bimRespVI = [
  "Điều phối BIM, kiểm soát chất lượng mô hình và phối hợp liên bộ môn.",
  "Tham gia xây dựng / triển khai BEP (BIM Execution Plan) theo yêu cầu dự án.",
  "Chuẩn hóa quy trình BIM và hỗ trợ đào tạo nội bộ.",
];
const bimRespEN = [
  "BIM coordination, model quality control, and interdisciplinary coordination.",
  "Contributed to / implemented the BIM Execution Plan (BEP) per project requirements.",
  "Improved BIM standards and supported internal training.",
];
const deliVI = [
  "Triển khai hồ sơ kiến trúc (bản vẽ chi tiết) và phối hợp các bên liên quan.",
  "Thực hiện phối cảnh / render phục vụ trình bày.",
];
const deliEN = [
  "Prepared architectural deliverables (detailed drawings) and coordinated with stakeholders.",
  "Produced render/perspective views for presentation.",
];

let order = 0;
const p = (data: Partial<SiteData["projects"][number]> & { slug: string; titleVI: string; titleEN: string }) => {
  const o = order++;
  return {
    id: `p-${o}`,
    constructionClassVI: "Cấp công trình: II",
    constructionClassEN: "Construction Class: II",
    locationVI: "Việt Nam",
    locationEN: "Viet Nam",
    primaryRoleVI: "Triển khai chính",
    primaryRoleEN: "Main deployment",
    overviewVI: "Thông tin dự án theo CV (Kinh nghiệm – Vai trò chính).",
    overviewEN: "Project information follows the CV (Experience – Primary Role).",
    responsibilitiesVI: deliVI,
    responsibilitiesEN: deliEN,
    coverUrl: "",
    images: [],
    sortOrder: o,
    ...data,
  };
};

export const fallbackData: SiteData = {
  profile: {
    name: "PHAM NGOC THIEM",
    role: "ARCHITECT",
    email: "pnt.architect.work@gmail.com",
    phone: "0888284998",
    addressVI: "Vinhomes Smart City, Tây Mỗ, Nam Từ Liêm, Hà Nội",
    addressEN: "Vinhomes Smart City, Tay Mo, South Tu Liem, Ha Noi",
    locationLabel: "Ha Noi",
    languages: ["Vietnamese", "English"],
    avatarUrl: "",
    cvUrl: "",
    summaryVI:
      "Kiến trúc sư với hơn 6 năm kinh nghiệm trong các dự án nhà ở, cơ sở giáo dục và quy hoạch đô thị. Thành thạo trong việc phối hợp BIM, triển khai mô hình và nâng cao sự hợp tác trong nhóm. Sử dụng thành thạo Revit, Navisworks, PowerBI, AutoCAD và tài liệu kỹ thuật.",
    summaryEN:
      "Architect with over 6 years of experience in residential, educational, and urban planning projects. Skilled in BIM coordination, model implementation, and enhancing team collaboration. Proficient in Revit, Navisworks, PowerBI, AutoCAD, and technical documentation.",
    homeHeadlineVI: "PHAM NGOC THIEM",
    homeHeadlineEN: "Architect · BIM Coordinator",
    homeSublineVI:
      "Kiến trúc sư với hơn 6 năm kinh nghiệm trong các dự án nhà ở, cơ sở giáo dục và quy hoạch đô thị.",
    homeSublineEN:
      "Architect with over 6 years of experience in residential, educational, and urban planning projects.",
  },
  experiences: [
    {
      id: "e-0",
      company: "VietNam National Construction Consultants (VNCC)",
      timeframe: "2022 – Present (Ha Noi)",
      roleVI: "Chuyên gia Revit – Điều phối viên BIM – Quản lý BIM",
      roleEN: "Revit Specialist – BIM Coordinator – BIM Manager",
      achievementsVI: [
        "Đảm nhận vai trò điều phối viên BIM trong nhiều dự án quy mô lớn, chịu trách nhiệm kiểm soát chất lượng mô hình và phối hợp các bộ môn.",
        "Đóng góp xây dựng Kế hoạch Thi hành BIM (BEP) cho Cảng hàng không quốc tế Long Thành.",
        "Tham gia quản lý chiến lược BIM, phát triển nhóm R&D, cải thiện quy trình thiết kế số và tiêu chuẩn BIM. Tổ chức đào tạo Revit nội bộ.",
      ],
      achievementsEN: [
        "Served as BIM Coordinator on large-scale projects, responsible for model quality control and interdisciplinary coordination.",
        "Contributed to the BIM Execution Plan (BEP) for Long Thanh International Airport.",
        "Participated in BIM strategy management and developed the office's R&D team, improving digital design workflows and BIM standards. Conducted internal Revit training.",
      ],
      sortOrder: 2,
    },
    {
      id: "e-1",
      company: "DLLC Urban Development & Architectural Design Consultant",
      timeframe: "2021 – 2022 (Ha Noi)",
      roleVI: "KTS Concept",
      roleEN: "Conceptual Architect",
      achievementsVI: [
        "Khởi xướng và phát triển ý tưởng thiết kế cho các cơ sở giáo dục và dự án quy hoạch đô thị.",
        "Tham gia giai đoạn phát triển ý tưởng của một dự án quy hoạch tổng thể cùng Nikken Sekkei.",
      ],
      achievementsEN: [
        "Initiated and developed design concepts for educational facilities and urban planning projects.",
        "Participated in the concept development phase of a master planning project with Nikken Sekkei.",
      ],
      sortOrder: 1,
    },
    {
      id: "e-2",
      company: "EBROS C&T VIET NAM Joint Stock Company",
      timeframe: "2019 – 2021 (Ha Noi)",
      roleVI: "Thực tập – Triển khai – KTS Concept",
      roleEN: "Internship – Drafting – Concept",
      achievementsVI: [
        "Thiết kế và phát triển ý tưởng cho các dự án quy mô nhỏ, bao gồm không gian thờ cúng tâm linh.",
        "Tạo thiết kế nội thất cho không gian nhà ở và render ở các góc nhìn nội/ngoại thất.",
      ],
      achievementsEN: [
        "Designed and developed concepts for small-scale projects, including spiritual worship spaces.",
        "Created interior designs for residential spaces and rendered interior/exterior views.",
      ],
      sortOrder: 0,
    },
  ],
  education: [
    {
      id: "ed-0",
      name: "Ha Noi Architectural University",
      descriptionVI: "2016 – 2021 (Hà Nội) – Cử nhân Kiến Trúc",
      descriptionEN: "2016 – 2021 (Ha Noi) – The degree of Architect",
      sortOrder: 0,
    },
    {
      id: "ed-1",
      name: "Vecas – Autodesk (BIM Coordinator Course)",
      descriptionVI: "2023 (Hà Nội) – Chứng nhận Điều phối BIM",
      descriptionEN: "2023 (Ha Noi) – BIM Coordinator Certificate",
      sortOrder: 1,
    },
    {
      id: "ed-2",
      name: "Vecas (GIS in Construction Planning)",
      descriptionVI: "2025 (Hà Nội) – Chứng nhận hoàn thành khóa học GIS",
      descriptionEN: "2025 (Ha Noi) – Certificate of Completion for GIS Course",
      sortOrder: 2,
    },
  ],
  skills: [
    skill("Autodesk Revit", "Expert", 0),
    skill("Autodesk Navisworks", "Expert", 1),
    skill("Adobe Photoshop", "Expert", 2),
    skill("Microsoft Power BI", "Experienced", 3),
    skill("Adobe Illustrator", "Experienced", 4),
    skill("Adobe InDesign", "Experienced", 5),
    skill("Microsoft Office", "Experienced", 6),
    skill("Lumion", "Skillful", 7),
    skill("Autodesk AutoCAD", "Beginner", 8),
    skill("Sketch Up", "Beginner", 9),
  ],
  projects: [
    p({
      slug: "xuan-dai-bay",
      titleVI: "Tổ hợp du lịch nghỉ dưỡng Xuân Đài Bay",
      titleEN: "Xuan Dai Bay resort and tourism Complex",
      constructionClassVI: "Cấp công trình: II",
      constructionClassEN: "Construction Class: II",
      locationVI: "Phú Yên, Việt Nam",
      locationEN: "Phu Yen, Viet Nam",
    }),
    p({
      slug: "vung-lam-phu-yen",
      titleVI: "Khu nghỉ dưỡng Vũng Lâm Phú Yên",
      titleEN: "Vung Lam Phu Yen resort",
      constructionClassVI: "Cấp công trình: I",
      constructionClassEN: "Construction Class: I",
      locationVI: "Phú Yên, Việt Nam",
      locationEN: "Phu Yen, Viet Nam",
      overviewVI: "Vai trò tập trung vào điều phối BIM và triển khai hồ sơ theo CV.",
      overviewEN: "Role focused on BIM coordination and deliverables, as described in the CV.",
      responsibilitiesVI: [...bimRespVI, ...deliVI],
      responsibilitiesEN: [...bimRespEN, ...deliEN],
    }),
    p({
      slug: "bai-lu-resort",
      titleVI: "Khu nghỉ dưỡng Bãi Lữ",
      titleEN: "Bai Lu resort",
      constructionClassVI: "Cấp công trình: I",
      constructionClassEN: "Construction Class: I",
      locationVI: "Nghệ An, Việt Nam",
      locationEN: "Nghe An, Viet Nam",
    }),
    p({
      slug: "social-housing-x2",
      titleVI: "Nhà ở xã hội chung cư X2",
      titleEN: "Social Housing: X2 Apartment Complex",
      locationVI: "Hà Nội, Việt Nam",
      locationEN: "Ha Noi, Viet Nam",
      overviewVI: "Vai trò theo CV, nhấn mạnh điều phối BIM và phối hợp liên bộ môn.",
      overviewEN: "Role follows the CV, emphasizing BIM coordination and interdisciplinary coordination.",
      responsibilitiesVI: [...bimRespVI, ...deliVI],
      responsibilitiesEN: [...bimRespEN, ...deliEN],
    }),
    p({
      slug: "viet-han-college-quang-ninh",
      titleVI: "Trường Cao đẳng Việt – Hàn Quảng Ninh",
      titleEN: "Viet – Han College Quang Ninh",
      locationVI: "Quảng Ninh, Việt Nam",
      locationEN: "Quang Ninh, Viet Nam",
    }),
    p({
      slug: "hue-golf-clubhouse",
      titleVI: "Sân golf Huế",
      titleEN: "Hue golf clubhouse",
      constructionClassVI: "Cấp công trình: III",
      constructionClassEN: "Construction Class: III",
      locationVI: "Huế, Việt Nam",
      locationEN: "Hue, Viet Nam",
      primaryRoleVI: "Triển khai chính – Điều phối BIM",
      primaryRoleEN: "Main deployment – BIM Coordinator",
    }),
    p({
      slug: "vtvs1-studio-central-square",
      titleVI: "Trường quay VTV.S1 và Quảng trường trung tâm",
      titleEN: "VTV.S1 television studio and Central Square",
      locationVI: "Hà Nội, Việt Nam",
      locationEN: "Ha Noi, Viet Nam",
      primaryRoleVI: "Triển khai chính – Điều phối BIM",
      primaryRoleEN: "Main deployment – BIM Coordinator",
    }),
    p({
      slug: "vung-bau-golf-clubhouse",
      titleVI: "Sân golf Vũng Bầu",
      titleEN: "Vung Bau golf clubhouse",
      constructionClassVI: "Cấp công trình: III",
      constructionClassEN: "Construction Class: III",
      locationVI: "Phú Quốc, Việt Nam",
      locationEN: "Phu Quoc, Viet Nam",
      overviewVI: "Vai trò điều phối BIM theo CV.",
      overviewEN: "BIM coordination role per the CV.",
      responsibilitiesVI: bimRespVI,
      responsibilitiesEN: bimRespEN,
    }),
    p({
      slug: "viettel-tower-da-nang",
      titleVI: "Tòa nhà Viettel Đà Nẵng",
      titleEN: "Viettel Tower Da Nang",
      constructionClassVI: "Cấp công trình: I",
      constructionClassEN: "Construction Class: I",
      locationVI: "Đà Nẵng, Việt Nam",
      locationEN: "Da Nang, Viet Nam",
      primaryRoleVI: "Điều phối BIM",
      primaryRoleEN: "BIM Coordinator",
    }),
    p({
      slug: "long-thanh-international-airport",
      titleVI: "Cảng hàng không quốc tế Long Thành",
      titleEN: "Long Thanh International Airport",
      constructionClassVI: "Cấp công trình: Đặc biệt",
      constructionClassEN: "Construction Class: Special",
      locationVI: "Long Thành, Việt Nam",
      locationEN: "Long Thanh, Viet Nam",
      primaryRoleVI: "Điều phối BIM | Quản lý BIM",
      primaryRoleEN: "BIM Coordinator | BIM Manager",
      overviewVI: "Dự án được nêu trong CV với vai trò BIM Coordinator/BIM Manager và tham gia xây dựng BEP.",
      overviewEN: "Listed in the CV with BIM Coordinator/BIM Manager roles and BEP contribution.",
      responsibilitiesVI: bimRespVI,
      responsibilitiesEN: bimRespEN,
    }),
  ],
  gallery: [],
  homeShowcase: [],
};
