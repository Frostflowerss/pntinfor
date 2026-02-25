# PNT Portfolio (Next.js 16)

Portfolio/CV site built with **Next.js 16 (App Router)** and **once-ui**.

The site content is **data-driven** from a single file so you can extend:
- Featured projects
- Work timeline (employment history)
- Software skills
- Education & courses

## Tech
- Next.js 16 (App Router)
- TypeScript
- once-ui (`@once-ui-system/*`)
- SCSS Modules

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run start
```

## Edit content

All CV data is centralized here:

- `src/resources/cv-data.ts`

Update sections:
- `cv.featuredProjects`
- `cv.employmentHistory`
- `cv.softwareSkills`
- `cv.education`
- `cv.courses`

## PDF download

Put the CV PDF here:

- `public/files/PNT_CV_Architect_2025_VN-EN-2.pdf`

The About page uses:

- `cv.contact.pdfDownloadPath`

## Deploy (Vercel)

- Framework preset: **Next.js**
- Build command: `npm run build`
- Output: default
