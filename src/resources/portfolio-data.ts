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
  "/images/home/H01.jpg",
  "/images/home/H02.jpg",
  "/images/home/H03.jpg",
  "/images/home/H04.jpg",
  "/images/home/H05.jpg",
  "/images/home/H06.jpg",
  "/images/home/H07.jpg",
  "/images/home/H08.jpg",
  "/images/home/H09.jpg",
  "/images/home/H10.jpg"
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
    cover: "/images/work/P01/CV01.jpg",
    images: [
      "/images/work/P01/DT01.jpg",
      "/images/work/P01/DT02.jpg",
      "/images/work/P01/DT03.jpg",
      "/images/work/P01/DT04.jpg",
      "/images/work/P01/DT05.jpg",
      "/images/work/P01/DT06.jpg",
      "/images/work/P01/DT07.jpg",
      "/images/work/P01/DT08.jpg",
      "/images/work/P01/DT09.jpg"
    ],
    details: {
      overviewVI: "Thông tin dự án thể hiện theo mục “Kinh nghiệm – Vai trò chính” trong CV.",
      overviewEN: "Project information is presented as listed in the “Experience – Primary Role” section of the CV.",
      responsibilitiesVI: commonDeliveryResponsibilitiesVI,
      responsibilitiesEN: commonDeliveryResponsibilitiesEN,
    },
  },
  {
    id: "vung-lam-phu-yen",
    titleVI: "Đầu tư xây dựng khu nghỉ dưỡng Vũng Lâm Phú Yên",
    titleEN: "Investment in the construction of Vung Lam Phu Yen resort",
    constructionClassVI: "Cấp công trình: I",
    constructionClassEN: "Construction Class: I",
    locationVI: "Phú Yên, Việt Nam",
    locationEN: "Phu Yen, Viet Nam",
    primaryRoleVI: "Triển khai chính",
    primaryRoleEN: "Main deployment",
    cover: "/images/work/P02/CV02.jpg",
    images: [
      "/images/work/P02/DT01.jpg",
      "/images/work/P02/DT02.jpg",
      "/images/work/P02/DT03.jpg",
      "/images/work/P02/DT04.jpg",
      "/images/work/P02/DT05.jpg",
      "/images/work/P02/DT06.jpg",
      "/images/work/P02/DT07.jpg",
      "/images/work/P02/DT08.jpg",
      "/images/work/P02/DT09.jpg"
    ],
    details: {
      overviewVI: "Vai trò tập trung vào điều phối BIM và triển khai hồ sơ theo CV.",
      overviewEN: "Role focused on BIM coordination and deliverables, as described in the CV.",
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
    locationVI: "Nghệ An, Việt Nam",
    locationEN: "Nghe An, Viet Nam",
    primaryRoleVI: "Triển khai chính",
    primaryRoleEN: "Main deployment",
    cover: "/images/work/P03/CV03.jpg",
    images: [
      "/images/work/P03/DT01.jpg",
      "/images/work/P03/DT02.jpg",
      "/images/work/P03/DT03.jpg",
      "/images/work/P03/DT04.jpg",
      "/images/work/P03/DT05.jpg",
      "/images/work/P03/DT06.jpg",
      "/images/work/P03/DT07.jpg",
      "/images/work/P03/DT08.jpg",
      "/images/work/P03/DT09.jpg"
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
    locationVI: "Hà Mội, Việt Nam",
    locationEN: "Ha Noi, Viet Nam",
    primaryRoleVI: "Triển khai chính",
    primaryRoleEN: "Main deployment",
    cover: "/images/work/P04/CV04.jpg",
    images: [
      "/images/work/P04/DT01.jpg",
      "/images/work/P04/DT02.jpg",
      "/images/work/P04/DT03.jpg",
      "/images/work/P04/DT04.jpg",
      "/images/work/P04/DT05.jpg"
    ],
    details: {
      overviewVI: "Vai trò theo CV, nhấn mạnh điều phối BIM và phối hợp liên bộ môn.",
      overviewEN: "Role follows the CV, emphasizing BIM coordination and interdisciplinary coordination.",
      responsibilitiesVI: [...commonBimResponsibilitiesVI, ...commonDeliveryResponsibilitiesVI],
      responsibilitiesEN: [...commonBimResponsibilitiesEN, ...commonDeliveryResponsibilitiesEN],
    },
  },
  {
    id: "viet-han-college-quang-ninh",
    titleVI: "Trường Cao đẳng Việt – Hàn Quảng Ninh",
    titleEN: "Viet – Han College Quang Ninh",
    constructionClassVI: "Cấp công trình: II",
    constructionClassEN: "Construction Class: II",
    locationVI: "Quảng Ninh, Việt Nam",
    locationEN: "Quang Ninh, Viet Nam",
    primaryRoleVI: "Triển khai chính",
    primaryRoleEN: "Main deployment",
    cover: "/images/work/P05/CV05.jpg",
    images: [
      "/images/work/P05/DT01.jpg",
      "/images/work/P05/DT02.jpg",
      "/images/work/P05/DT03.jpg",
      "/images/work/P05/DT04.jpg",
      "/images/work/P05/DT05.jpg"
    ],
    details: {
      overviewVI: "Thông tin dự án theo CV (Kinh nghiệm – Vai trò chính).",
      overviewEN: "Project information follows the CV (Experience – Primary Role).",
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
    locationEN: "Hue, Viet Nam",
    primaryRoleVI: "Triển khai chính – Điều phối BIM",
    primaryRoleEN: "Main deployment – BIM Coordinator",
    cover: "/images/work/P06/CV06.jpg",
    images: [
      "/images/work/P06/DT01.jpg",
      "/images/work/P06/DT02.jpg",
      "/images/work/P06/DT03.jpg",
      "/images/work/P06/DT04.jpg",
      "/images/work/P06/DT05.jpg",
      "/images/work/P06/DT06.jpg"
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
    locationVI: "Hà Nội, Việt Nam",
    locationEN: "Ha Noi, Viet Nam",
    primaryRoleVI: "Triển khai chính – Điều phối BIM",
    primaryRoleEN: "Main deployment – BIM Coordinator",
    cover: "/images/work/P07/CV07.jpg",
    images: [
      "/images/work/P07/DT01.jpg",
      "/images/work/P07/DT02.jpg",
      "/images/work/P07/DT03.jpg",
      "/images/work/P07/DT04.jpg",
      "/images/work/P07/DT05.jpg",
      "/images/work/P07/DT06.jpg",
      "/images/work/P07/DT07.jpg"
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
    locationVI: "Phú Quốc, Việt Nam",
    locationEN: "Phu Quoc, Viet Nam",
    primaryRoleVI: "Triển khai chính",
    primaryRoleEN: "Main deployment",
    cover: "/images/work/P08/CV08.jpg",
    images: [
      "/images/work/P08/DT01.jpg",
      "/images/work/P08/DT02.jpg",
      "/images/work/P08/DT03.jpg",
      "/images/work/P08/DT04.jpg",
      "/images/work/P08/DT05.jpg",
      "/images/work/P08/DT06.jpg",
      "/images/work/P08/DT07.jpg",
      "/images/work/P08/DT08.jpg",
      "/images/work/P08/DT09.jpg"
    ],
    details: {
      overviewVI: "Vai trò điều phối BIM theo CV.",
      overviewEN: "BIM coordination role per the CV.",
      responsibilitiesVI: commonBimResponsibilitiesVI,
      responsibilitiesEN: commonBimResponsibilitiesEN,
    },
  },
  {
    id: "viettel-tower-da-nang",
    titleVI: "Tòa nhà Viettel Đà Nẵng",
    titleEN: "Viettel Tower Da Nang",
    constructionClassVI: "Cấp công trình: I",
    constructionClassEN: "Construction Class: I",
    locationVI: "Đà Nẵng, Việt Nam",
    locationEN: "Da Nang, Viet Nam",
    primaryRoleVI: "Điều phối BIM",
    primaryRoleEN: "BIM Coordinator",
    cover: "/images/work/P09/CV09.jpg",
    images: [
      "/images/work/P09/DT01.jpg",
      "/images/work/P09/DT02.jpg",
      "/images/work/P09/DT03.jpg",
      "/images/work/P09/DT04.jpg",
      "/images/work/P09/DT05.jpg",
      "/images/work/P09/DT06.jpg",
      "/images/work/P09/DT07.jpg"
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
    locationEN: "Long Thanh, Viet Nam",
    primaryRoleVI: "Điều phối BIM | Quản lý BIM",
    primaryRoleEN: "BIM Coordinator | BIM Manager",
    cover: "/images/work/P10/CV10.jpg",
    images: [
      "/images/work/P10/DT01.jpg",
      "/images/work/P10/DT02.jpg",
      "/images/work/P10/DT03.jpg",
      "/images/work/P10/DT04.jpg",
      "/images/work/P10/DT05.jpg",
      "/images/work/P10/DT06.jpg",
      "/images/work/P10/DT07.jpg",
      "/images/work/P10/DT08.jpg"
    ],
    details: {
      overviewVI: "Dự án được nêu trong CV với vai trò BIM Coordinator/BIM Manager và tham gia xây dựng BEP.",
      overviewEN: "Listed in the CV with BIM Coordinator/BIM Manager roles and BEP contribution.",
      responsibilitiesVI: commonBimResponsibilitiesVI,
      responsibilitiesEN: commonBimResponsibilitiesEN,
    },
  },
];
