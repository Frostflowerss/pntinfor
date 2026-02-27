import { About, Blog, Gallery, Home, Newsletter, Person, Social, Work } from "@/types";

// NOTE: This project is a UI template. Replace placeholder images in /public/images with your own.

const person: Person = {
  firstName: "Pham",
  lastName: "Ngoc Thiem",
  name: "PHAM NGOC THIEM",
  role: "ARCHITECT",
  avatar: "/images/avatar.jpg",
  email: "pnt.architect.work@gmail.com",
  location: "Asia/Ho_Chi_Minh",
  languages: ["Vietnamese", "English"],
};

// Home does not use the newsletter block in this variant.
const newsletter: Newsletter = {
  display: false,
  title: <>Newsletter</>,
  description: <> </>,
};

// Optional links (kept minimal; primary contacts are displayed on the About page).
const social: Social = [
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
    essential: true,
  },
];

const home: Home = {
  path: "/",
  image: "/images/og/home.jpg",
  label: "Home",
  title: `${person.name} | ${person.role}`,
  description: `Portfolio website of ${person.name} (${person.role})`,
  headline: (
    <>
      <span className="pnt-vi">{person.name}</span> <span className="pnt-en">| {person.role}</span>
    </>
  ),
  featured: {
    display: false,
    title: <></>,
    href: "/work",
  },
  subline: (
    <>
      <div className="pnt-vi">Kiến trúc sư với hơn 6 năm kinh nghiệm trong các dự án nhà ở, cơ sở giáo dục và quy hoạch đô thị.</div>
      <div className="pnt-en">Architect with over 6 years of experience in residential, educational, and urban planning projects.</div>
    </>
  ),
};

const about: About = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `Professional summary and experience of ${person.name}`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: false,
    link: "",
  },
  intro: {
    display: true,
    title: "TÓM TẮT CHUYÊN MÔN / PROFESSIONAL SUMMARY",
    description: (
      <>
        <div className="pnt-vi">
          Kiến trúc sư với hơn 6 năm kinh nghiệm trong các dự án nhà ở, cơ sở giáo dục và quy hoạch đô thị. Thành thạo trong việc phối hợp BIM, triển khai mô hình và nâng cao sự hợp tác trong nhóm. Sử dụng thành thạo Revit, Navisworks, PowerBI, AutoCAD và tài liệu kỹ thuật, thúc đẩy môi trường chia sẻ tri thức và hỗ trợ phát triển đội ngũ thiết kế.
        </div>
        <div className="pnt-en">
          Architect with over 6 years of experience in residential, educational, and urban planning projects. Skilled in BIM coordination, model implementation, and enhancing team collaboration. Proficient in Revit, Navisworks, PowerBI, AutoCAD, and technical documentation, fostering a knowledge-sharing environment and supporting the development of design team.
        </div>
      </>
    ),
  },
  work: {
    display: true,
    title: "LỊCH SỬ CÔNG VIỆC / EMPLOYMENT HISTORY",
    experiences: [
      {
        company: "EBROS C&T VIET NAM Joint Stock Company",
        timeframe: "2019 – 2021 (Ha Noi)",
        role: "Thực tập – Triển khai – KTS Concept / Internship – Drafting – Concept",
        achievements: [
          <>
            <span className="pnt-vi">
              Thiết kế và phát triển ý tưởng cho các dự án quy mô nhỏ, bao gồm tham gia thiết kế các không gian thờ cúng tâm linh và tổ tiên. Tạo thiết kế nội thất cho không gian nhà ở và render cho công trình ở các góc nhìn nội thất và ngoại thất. Triển khai các bản vẽ chi tiết về kiến trúc và nội thất.
            </span>
            <br />
            <span className="pnt-en">
              Designed and developed concepts for small-scale projects, including participation in the design of spiritual and ancestral worship spaces. Created interior designs for residential spaces and rendered views for both interior and exterior perspectives. Prepared detailed architectural and interior construction drawings.
            </span>
          </>,
        ],
        images: [
          {
            src: "/images/projects/project-01/cover-01.jpg",
            alt: "Work sample",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        company: "DLLC Urban Development and Architectural Design Consultant Joint Stock Company",
        timeframe: "2021 – 2022 (Ha Noi)",
        role: "KTS Concept / Conceptual Architect",
        achievements: [
          <>
            <span className="pnt-vi">
              Có kinh nghiệm trong việc khởi xướng và phát triển các ý tưởng thiết kế cho các cơ sở giáo dục và dự án quy hoạch đô thị. Tham gia giai đoạn phát triển ý tưởng của một dự án quy hoạch tổng thể cùng với Nikken Sekkei. Chuẩn bị các bản vẽ kỹ thuật và render các góc nhìn phối cảnh cho các dự án quy hoạch và kiến trúc quy mô lớn.
            </span>
            <br />
            <span className="pnt-en">
              Experienced in initiating and developing design concepts for educational facilities and urban planning projects. Participated in the concept development phase of a master planning project in collaboration with Nikken Sekkei. Prepared technical drawings and rendered perspective views for large-scale planning and architectural projects.
            </span>
          </>,
        ],
        images: [
          {
            src: "/images/projects/project-01/cover-02.jpg",
            alt: "Work sample",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        company: "VietNam National Construction Consultants (VNCC) Consultant Joint Stock Company",
        timeframe: "2022 – Present (Ha Noi)",
        role: "Chuyên gia Revit – Điều phối viên BIM – Quản lý BIM / Revit Specialist – BIM Coordinator – BIM Manager",
        achievements: [
          <>
            <span className="pnt-vi">
              Đảm nhận vai trò điều phối viên BIM trong nhiều dự án quy mô lớn, chịu trách nhiệm kiểm soát chất lượng mô hình và phối hợp gia các bộ môn. Đóng góp xây dựng Kế hoạch Thi hành BIM (BEP) cho Cảng hàng không quốc tế Long Thành, phối hợp cùng Chủ đầu tư, Tổng thầu, Kiểm soát chất lượng và Nhà thầu phụ. Tham gia quản lý chiến lược BIM, phát triển nhóm R&D, cải thiện quy trình thiết kế số và tiêu chuẩn BIM. Tổ chức đào tạo Revit nội bộ và hỗ trợ nâng cao kỹ năng cho nhân sự.
            </span>
            <br />
            <span className="pnt-en">
              Served as BIM Coordinator on large-scale projects, responsible for model quality control and interdisciplinary coordination. Contributed to the BIM Execution Plan (BEP) for Long Thanh International Airport, collaborating with the Client, General Contractor, Quality Control, and Subcontractors. Participated in BIM strategy management and developed the office’s R&D team, improving digital design workflows and BIM standards. Conducted internal Revit training sessions and supported the skill development of junior staff.
            </span>
          </>,
        ],
        images: [
          {
            src: "/images/projects/project-01/cover-03.jpg",
            alt: "Work sample",
            width: 16,
            height: 9,
          },
        ],
      },
    ],
  },
  studies: {
    display: true,
    title: "HỌC VẤN & KHÓA HỌC / EDUCATION & COURSES",
    institutions: [
      {
        name: "Trường Đại Học Kiến Trúc Hà Nội / Ha Noi Architectural University",
        description: (
          <>
            <span className="pnt-vi">2016 – 2021 (Hà Nội) – Cử nhân Kiến Trúc</span>
            <br />
            <span className="pnt-en">2016 – 2021 (Ha Noi) – The degree of Architect</span>
          </>
        ),
      },
      {
        name: "Vecas – Autodesk (BIM Coordinator Course)",
        description: (
          <>
            <span className="pnt-vi">2023 (Hà Nội) – Chứng nhận Điều phối BIM</span>
            <br />
            <span className="pnt-en">2023 (Ha Noi) – BIM Coordinator Certificate</span>
          </>
        ),
      },
      {
        name: "Vecas (GIS in Construction Planning)",
        description: (
          <>
            <span className="pnt-vi">2025 (Hà Nội) – Chứng nhận hoàn thành khóa học GIS</span>
            <br />
            <span className="pnt-en">2025 (Ha Noi) – Certificate of Completion for GIS Course</span>
          </>
        ),
      },
    ],
  },
  technical: {
    display: true,
    title: "KĨ NĂNG PHẦN MỀM / SOFTWARE SKILLS",
    skills: [
      {
        title: "Autodesk Revit",
        tags: [{ name: "Expert" }],
        description: (
          <>
            <span className="pnt-vi">Chuyên gia</span>
            <br />
            <span className="pnt-en">Expert</span>
          </>
        ),
      },
      {
        title: "Autodesk Naviswork",
        tags: [{ name: "Expert" }],
        description: (
          <>
            <span className="pnt-vi">Chuyên gia</span>
            <br />
            <span className="pnt-en">Expert</span>
          </>
        ),
      },
      {
        title: "Autodesk AutoCAD",
        tags: [{ name: "Beginner" }],
        description: (
          <>
            <span className="pnt-vi">Cơ bản</span>
            <br />
            <span className="pnt-en">Beginner</span>
          </>
        ),
      },
      {
        title: "Sketch Up",
        tags: [{ name: "Beginner" }],
        description: (
          <>
            <span className="pnt-vi">Cơ bản</span>
            <br />
            <span className="pnt-en">Beginner</span>
          </>
        ),
      },
      {
        title: "Lumion",
        tags: [{ name: "Skillful" }],
        description: (
          <>
            <span className="pnt-vi">Thành thạo</span>
            <br />
            <span className="pnt-en">Skillful</span>
          </>
        ),
      },
      {
        title: "Adobe Photoshop",
        tags: [{ name: "Expert" }],
        description: (
          <>
            <span className="pnt-vi">Chuyên gia</span>
            <br />
            <span className="pnt-en">Expert</span>
          </>
        ),
      },
      {
        title: "Adobe Illustrator",
        tags: [{ name: "Experienced" }],
        description: (
          <>
            <span className="pnt-vi">Kinh nghiệm</span>
            <br />
            <span className="pnt-en">Experienced</span>
          </>
        ),
      },
      {
        title: "Adobe InDesign",
        tags: [{ name: "Experienced" }],
        description: (
          <>
            <span className="pnt-vi">Kinh nghiệm</span>
            <br />
            <span className="pnt-en">Experienced</span>
          </>
        ),
      },
      {
        title: "Microsoft Power BI",
        tags: [{ name: "Experienced" }],
        description: (
          <>
            <span className="pnt-vi">Kinh nghiệm</span>
            <br />
            <span className="pnt-en">Experienced</span>
          </>
        ),
      },
      {
        title: "Microsoft Office",
        tags: [{ name: "Experienced" }],
        description: (
          <>
            <span className="pnt-vi">Kinh nghiệm</span>
            <br />
            <span className="pnt-en">Experienced</span>
          </>
        ),
      },

    ],
  },
};

const blog: Blog = {
  path: "/blog",
  label: "Blog",
  title: "Blog",
  description: "Disabled",
};

const work: Work = {
  path: "/work",
  label: "Work",
  title: `Work – ${person.name}`,
  description: `Selected projects of ${person.name}`,
};

const gallery: Gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Gallery – ${person.name}`,
  description: `Photo gallery of ${person.name}`,
  images: [
    { src: "/images/gallery/horizontal-1.jpg", alt: "image", orientation: "horizontal" },
    { src: "/images/gallery/vertical-4.jpg", alt: "image", orientation: "vertical" },
    { src: "/images/gallery/horizontal-3.jpg", alt: "image", orientation: "horizontal" },
    { src: "/images/gallery/vertical-1.jpg", alt: "image", orientation: "vertical" },
    { src: "/images/gallery/vertical-2.jpg", alt: "image", orientation: "vertical" },
    { src: "/images/gallery/horizontal-2.jpg", alt: "image", orientation: "horizontal" },
    { src: "/images/gallery/horizontal-4.jpg", alt: "image", orientation: "horizontal" },
    { src: "/images/gallery/vertical-3.jpg", alt: "image", orientation: "vertical" },
  ],
};

export { person, social, newsletter, home, about, blog, work, gallery };
