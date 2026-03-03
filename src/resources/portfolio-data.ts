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
  /** Cover for the project carousel (must be CV01 inside each project folder). */
  cover: string;
  /** Detail images for the project modal (IMG1, IMG2, ... inside each project folder). */
  images: string[];
  details: {
    overviewVI: string;
    overviewEN: string;
    responsibilitiesVI: string[];
    responsibilitiesEN: string[];
  };
};

/**
 * Home showcase images.
 * Requirement: Home uses only assets under /public/images/home.
 */
export const homeShowcaseImages: string[] = [
  "/images/home/IMG1.jpg",
  "/images/home/IMG2.jpg",
  "/images/home/IMG3.jpg",
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

/**
 * Work projects.
 * Requirement: Work uses only assets under /public/images/projects.
 * - Cover: /images/projects/Wxx/CV01.jpg
 * - Details: /images/projects/Wxx/IMG1.jpg, IMG2.jpg, ...
 */
export const workProjects: WorkProject[] = [
  {
    id: "w01",
    titleVI: "Dự án W01",
    titleEN: "Project W01",
    constructionClassVI: "Cấp công trình: II",
    constructionClassEN: "Construction Class: II",
    locationVI: "Hà Nội, Việt Nam",
    locationEN: "Ha Noi, Vietnam",
    primaryRoleVI: "Triển khai chính",
    primaryRoleEN: "Main deployment",
    cover: "/images/projects/W01/CV01.jpg",
    images: [
      "/images/projects/W01/IMG1.jpg",
      "/images/projects/W01/IMG2.jpg",
      "/images/projects/W01/IMG3.jpg",
    ],
    details: {
      overviewVI: "Thông tin dự án thể hiện theo mục “Kinh nghiệm – Vai trò chính” trong CV.",
      overviewEN:
        "Project information is presented as listed in the “Experience – Primary Role” section of the CV.",
      responsibilitiesVI: commonDeliveryResponsibilitiesVI,
      responsibilitiesEN: commonDeliveryResponsibilitiesEN,
    },
  },
  {
    id: "w02",
    titleVI: "Dự án W02",
    titleEN: "Project W02",
    constructionClassVI: "Cấp công trình: III",
    constructionClassEN: "Construction Class: III",
    locationVI: "Huế, Việt Nam",
    locationEN: "Hue, Vietnam",
    primaryRoleVI: "Triển khai chính – Điều phối BIM",
    primaryRoleEN: "Main deployment – BIM Coordinator",
    cover: "/images/projects/W02/CV01.jpg",
    images: [
      "/images/projects/W02/IMG1.jpg",
      "/images/projects/W02/IMG2.jpg",
      "/images/projects/W02/IMG3.jpg",
    ],
    details: {
      overviewVI: "Vai trò tập trung vào điều phối BIM và triển khai hồ sơ theo CV.",
      overviewEN: "Role focused on BIM coordination and deliverables, as described in the CV.",
      responsibilitiesVI: [...commonBimResponsibilitiesVI, ...commonDeliveryResponsibilitiesVI],
      responsibilitiesEN: [...commonBimResponsibilitiesEN, ...commonDeliveryResponsibilitiesEN],
    },
  },
  {
    id: "w03",
    titleVI: "Dự án W03",
    titleEN: "Project W03",
    constructionClassVI: "Cấp công trình: I",
    constructionClassEN: "Construction Class: I",
    locationVI: "Phú Yên, Việt Nam",
    locationEN: "Phu Yen, Vietnam",
    primaryRoleVI: "Triển khai chính",
    primaryRoleEN: "Main deployment",
    cover: "/images/projects/W03/CV01.jpg",
    images: [
      "/images/projects/W03/IMG1.jpg",
      "/images/projects/W03/IMG2.jpg",
      "/images/projects/W03/IMG3.jpg",
    ],
    details: {
      overviewVI: "Thông tin dự án theo CV (Kinh nghiệm – Vai trò chính).",
      overviewEN: "Project information follows the CV (Experience – Primary Role).",
      responsibilitiesVI: commonDeliveryResponsibilitiesVI,
      responsibilitiesEN: commonDeliveryResponsibilitiesEN,
    },
  },
];
