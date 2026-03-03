export type WorkProject = {
  id: string;
  titleVI: string;
  titleEN: string;
  constructionClassVI: string;
  constructionClassEN: string;
  locationVI: string;
  locationEN: string;
  primaryRoleVI: string;
  primaryRoleEN: string;
  cover: string; // 9:16 cover (UI crops to 9:16)
  images: string[]; // typically 5 images
  details: {
    overviewVI: string;
    overviewEN: string;
    responsibilitiesVI: string[];
    responsibilitiesEN: string[];
  };
};

// Home showcase images (add/remove items and indicators update automatically).
export const homeShowcaseImages: string[] = [
  "/images/gallery/vertical-1.jpg",
  "/images/gallery/vertical-2.jpg",
  "/images/gallery/vertical-3.jpg",
  "/images/gallery/vertical-4.jpg",
  "/images/gallery/horizontal-1.jpg",
  "/images/gallery/horizontal-2.jpg",
  "/images/gallery/horizontal-3.jpg",
  "/images/gallery/horizontal-4.jpg",
  "/images/projects/project-01/cover-01.jpg",
  "/images/projects/project-01/cover-02.jpg",
];

const commonBimResponsibilitiesVI = [
  "Điều phối BIM, kiểm soát chất lượng mô hình và phối hợp liên bộ môn.",
  "Tham gia xây dựng / triển khai BEP (BIM Execution Plan) theo yêu cầu dự án (theo CV).",
  "Chuẩn hóa quy trình BIM và hỗ trợ đào tạo nội bộ (theo CV).",
];

const commonBimResponsibilitiesEN = [
  "BIM coordination, model quality control, and interdisciplinary coordination.",
  "Contributed to / implemented the BIM Execution Plan (BEP) per project requirements (per CV).",
  "Improved BIM standards and supported internal training (per CV).",
];

const commonDeliveryResponsibilitiesVI = [
  "Triển khai hồ sơ kiến trúc (bản vẽ chi tiết) và phối hợp các bên liên quan (theo CV).",
  "Thực hiện phối cảnh / render phục vụ trình bày (theo CV).",
];

const commonDeliveryResponsibilitiesEN = [
  "Prepared architectural deliverables (detailed drawings) and coordinated with stakeholders (per CV).",
  "Produced render/perspective views for presentation (per CV).",
];

const notSpecifiedVI = "Không có trong CV";
const notSpecifiedEN = "Not specified in the CV";

export const workProjects: WorkProject[] = [
  {
    id: "xuan-dai-bay",
    titleVI: "Đầu tư xây dựng tổ hợp du lịch nghỉ dưỡng Xuân Đài Bay",
    titleEN: "Investment in the construction of XDB resort and tourism Complex",
    constructionClassVI: "Cấp công trình: II",
    constructionClassEN: "Construction Class: II",
    locationVI: notSpecifiedVI,
    locationEN: notSpecifiedEN,
    primaryRoleVI: "Triển khai chính",
    primaryRoleEN: "Main deployment",
    cover: "/images/gallery/vertical-1.jpg",
    images: [
      "/images/projects/project-01/image-01.jpg",
      "/images/projects/project-01/image-02.jpg",
      "/images/projects/project-01/image-03.jpg",
      "/images/gallery/horizontal-1.jpg",
      "/images/gallery/horizontal-2.jpg",
    ],
    details: {
      overviewVI: "Thông tin dự án thể hiện theo mục “Kinh nghiệm – Vai trò chính” trong CV.",
      overviewEN: "Project information is presented as listed in the “Experience – Primary Role” section of the CV.",
      responsibilitiesVI: commonDeliveryResponsibilitiesVI,
      responsibilitiesEN: commonDeliveryResponsibilitiesEN,
    },
  },
  {
    id: "hue-golf-clubhouse",
    titleVI: "Sân golf Huế",
    titleEN: "Hue golf clubhouse",
    constructionClassVI: "Cấp công trình: III",
    constructionClassEN: "Construction Class: III",
    locationVI: "Huế, Việt Nam",
    locationEN: "Hue, Vietnam",
    primaryRoleVI: "Triển khai chính – Điều phối BIM",
    primaryRoleEN: "Main deployment – BIM Coordinator",
    cover: "/images/gallery/vertical-2.jpg",
    images: [
      "/images/gallery/vertical-2.jpg",
      "/images/projects/project-01/cover-03.jpg",
      "/images/gallery/horizontal-3.jpg",
      "/images/projects/project-01/image-02.jpg",
      "/images/projects/project-01/image-01.jpg",
    ],
    details: {
      overviewVI: "Vai trò tập trung vào điều phối BIM và triển khai hồ sơ theo CV.",
      overviewEN: "Role focused on BIM coordination and deliverables, as described in the CV.",
      responsibilitiesVI: [...commonBimResponsibilitiesVI, ...commonDeliveryResponsibilitiesVI],
      responsibilitiesEN: [...commonBimResponsibilitiesEN, ...commonDeliveryResponsibilitiesEN],
    },
  },
  {
    id: "vung-lam-phu-yen",
    titleVI: "Đầu tư xây dựng khu nghỉ dưỡng Vũng Lâm Phú Yên",
    titleEN: "Investment in the construction of Vung Lam Phu Yen resort",
    constructionClassVI: "Cấp công trình: I",
    constructionClassEN: "Construction Class: I",
    locationVI: "Phú Yên, Việt Nam",
    locationEN: "Phu Yen, Vietnam",
    primaryRoleVI: "Triển khai chính",
    primaryRoleEN: "Main deployment",
    cover: "/images/gallery/vertical-3.jpg",
    images: [
      "/images/gallery/vertical-3.jpg",
      "/images/projects/project-01/cover-01.jpg",
      "/images/gallery/horizontal-4.jpg",
      "/images/projects/project-01/image-03.jpg",
      "/images/gallery/horizontal-1.jpg",
    ],
    details: {
      overviewVI: "Thông tin dự án theo CV (Kinh nghiệm – Vai trò chính).",
      overviewEN: "Project information follows the CV (Experience – Primary Role).",
      responsibilitiesVI: commonDeliveryResponsibilitiesVI,
      responsibilitiesEN: commonDeliveryResponsibilitiesEN,
    },
  },
  {
    id: "vtvs1-studio-central-square",
    titleVI: "Trường quay VTV.S1 và Quảng trường trung tâm",
    titleEN: "VTV.S1 television studio and Central Square",
    constructionClassVI: "Cấp công trình: II",
    constructionClassEN: "Construction Class: II",
    locationVI: notSpecifiedVI,
    locationEN: notSpecifiedEN,
    primaryRoleVI: "Triển khai chính – Điều phối BIM",
    primaryRoleEN: "Main deployment – BIM Coordinator",
    cover: "/images/gallery/vertical-4.jpg",
    images: [
      "/images/gallery/vertical-4.jpg",
      "/images/projects/project-01/cover-02.jpg",
      "/images/projects/project-01/cover-04.jpg",
      "/images/projects/project-01/image-01.jpg",
      "/images/gallery/horizontal-2.jpg",
    ],
    details: {
      overviewVI: "Vai trò theo CV, nhấn mạnh điều phối BIM và phối hợp liên bộ môn.",
      overviewEN: "Role follows the CV, emphasizing BIM coordination and interdisciplinary coordination.",
      responsibilitiesVI: [...commonBimResponsibilitiesVI, ...commonDeliveryResponsibilitiesVI],
      responsibilitiesEN: [...commonBimResponsibilitiesEN, ...commonDeliveryResponsibilitiesEN],
    },
  },
  {
    id: "bai-lu-resort",
    titleVI: "Đầu tư xây dựng khu nghỉ dưỡng Bãi Lữ",
    titleEN: "Investment in the construction of Bai Lu resort",
    constructionClassVI: "Cấp công trình: I",
    constructionClassEN: "Construction Class: I",
    locationVI: notSpecifiedVI,
    locationEN: notSpecifiedEN,
    primaryRoleVI: "Triển khai chính",
    primaryRoleEN: "Main deployment",
    cover: "/images/gallery/vertical-1.jpg",
    images: [
      "/images/projects/project-01/cover-01.jpg",
      "/images/projects/project-01/cover-02.jpg",
      "/images/projects/project-01/cover-03.jpg",
      "/images/projects/project-01/image-02.jpg",
      "/images/gallery/horizontal-3.jpg",
    ],
    details: {
      overviewVI: "Thông tin dự án theo CV (Kinh nghiệm – Vai trò chính).",
      overviewEN: "Project information follows the CV (Experience – Primary Role).",
      responsibilitiesVI: commonDeliveryResponsibilitiesVI,
      responsibilitiesEN: commonDeliveryResponsibilitiesEN,
    },
  },
  {
    id: "vung-bau-golf-clubhouse",
    titleVI: "Sân golf Vũng Bầu",
    titleEN: "Vung Bau golf clubhouse",
    constructionClassVI: "Cấp công trình: III",
    constructionClassEN: "Construction Class: III",
    locationVI: notSpecifiedVI,
    locationEN: notSpecifiedEN,
    primaryRoleVI: "Triển khai chính",
    primaryRoleEN: "Main deployment",
    cover: "/images/gallery/vertical-2.jpg",
    images: [
      "/images/projects/project-01/cover-02.jpg",
      "/images/gallery/horizontal-4.jpg",
      "/images/gallery/vertical-1.jpg",
      "/images/projects/project-01/image-03.jpg",
      "/images/projects/project-01/image-01.jpg",
    ],
    details: {
      overviewVI: "Thông tin dự án theo CV (Kinh nghiệm – Vai trò chính).",
      overviewEN: "Project information follows the CV (Experience – Primary Role).",
      responsibilitiesVI: commonDeliveryResponsibilitiesVI,
      responsibilitiesEN: commonDeliveryResponsibilitiesEN,
    },
  },
  {
    id: "social-housing-x2",
    titleVI: "Dự án nhà ở xã hội chung cư X2",
    titleEN: "Social Housing Project: X2 Apartment Complex",
    constructionClassVI: "Cấp công trình: II",
    constructionClassEN: "Construction Class: II",
    locationVI: notSpecifiedVI,
    locationEN: notSpecifiedEN,
    primaryRoleVI: "Triển khai chính",
    primaryRoleEN: "Main deployment",
    cover: "/images/gallery/vertical-3.jpg",
    images: [
      "/images/projects/project-01/cover-03.jpg",
      "/images/projects/project-01/image-01.jpg",
      "/images/projects/project-01/image-02.jpg",
      "/images/gallery/horizontal-1.jpg",
      "/images/gallery/vertical-2.jpg",
    ],
    details: {
      overviewVI: "Thông tin dự án theo CV (Kinh nghiệm – Vai trò chính).",
      overviewEN: "Project information follows the CV (Experience – Primary Role).",
      responsibilitiesVI: commonDeliveryResponsibilitiesVI,
      responsibilitiesEN: commonDeliveryResponsibilitiesEN,
    },
  },
  {
    id: "viettel-tower-da-nang",
    titleVI: "Tòa nhà Viettel Đà Nẵng",
    titleEN: "Viettel Tower Da Nang",
    constructionClassVI: "Cấp công trình: I",
    constructionClassEN: "Construction Class: I",
    locationVI: "Đà Nẵng, Việt Nam",
    locationEN: "Da Nang, Vietnam",
    primaryRoleVI: "Điều phối BIM",
    primaryRoleEN: "BIM Coordinator",
    cover: "/images/gallery/vertical-4.jpg",
    images: [
      "/images/projects/project-01/cover-04.jpg",
      "/images/projects/project-01/image-03.jpg",
      "/images/gallery/horizontal-2.jpg",
      "/images/gallery/vertical-3.jpg",
      "/images/projects/project-01/image-02.jpg",
    ],
    details: {
      overviewVI: "Vai trò điều phối BIM theo CV.",
      overviewEN: "BIM coordination role per the CV.",
      responsibilitiesVI: commonBimResponsibilitiesVI,
      responsibilitiesEN: commonBimResponsibilitiesEN,
    },
  },
  {
    id: "viet-han-college-quang-ninh",
    titleVI: "Trường Cao đẳng Việt – Hàn Quảng Ninh",
    titleEN: "Viet – Han College Quang Ninh",
    constructionClassVI: "Cấp công trình: II",
    constructionClassEN: "Construction Class: II",
    locationVI: "Quảng Ninh, Việt Nam",
    locationEN: "Quang Ninh, Vietnam",
    primaryRoleVI: "Triển khai chính",
    primaryRoleEN: "Main deployment",
    cover: "/images/gallery/vertical-1.jpg",
    images: [
      "/images/gallery/horizontal-1.jpg",
      "/images/gallery/horizontal-3.jpg",
      "/images/projects/project-01/cover-01.jpg",
      "/images/projects/project-01/image-01.jpg",
      "/images/gallery/vertical-4.jpg",
    ],
    details: {
      overviewVI: "Thông tin dự án theo CV (Kinh nghiệm – Vai trò chính).",
      overviewEN: "Project information follows the CV (Experience – Primary Role).",
      responsibilitiesVI: commonDeliveryResponsibilitiesVI,
      responsibilitiesEN: commonDeliveryResponsibilitiesEN,
    },
  },
  {
    id: "long-thanh-international-airport",
    titleVI: "Cảng hàng không quốc tế Long Thành",
    titleEN: "Long Thanh international Airport",
    constructionClassVI: "Cấp công trình: Đặc biệt",
    constructionClassEN: "Construction Class: Special",
    locationVI: "Long Thành, Việt Nam",
    locationEN: "Long Thanh, Vietnam",
    primaryRoleVI: "Điều phối BIM | Quản lý BIM",
    primaryRoleEN: "BIM Coordinator | BIM Manager",
    cover: "/images/gallery/vertical-2.jpg",
    images: [
      "/images/gallery/horizontal-2.jpg",
      "/images/projects/project-01/cover-03.jpg",
      "/images/projects/project-01/image-02.jpg",
      "/images/projects/project-01/image-03.jpg",
      "/images/gallery/horizontal-4.jpg",
    ],
    details: {
      overviewVI: "Dự án được nêu trong CV với vai trò BIM Coordinator/BIM Manager và tham gia xây dựng BEP.",
      overviewEN: "Listed in the CV with BIM Coordinator/BIM Manager roles and BEP contribution.",
      responsibilitiesVI: commonBimResponsibilitiesVI,
      responsibilitiesEN: commonBimResponsibilitiesEN,
    },
  },
];
