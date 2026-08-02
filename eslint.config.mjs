import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) });

/**
 * Flat config cho ESLint 9.
 * package.json vốn khai script "lint" nhưng repo không có file cấu hình nào và
 * cũng không cài eslint — script chưa từng chạy được.
 */
export default [
  { ignores: [".next/**", "node_modules/**", "next-env.d.ts"] },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Tầng data map dữ liệu thô từ Supabase nên dùng `any` có chủ đích; đã
      // ghi nhận là nợ kỹ thuật, xử lý bằng cách generate type ở giai đoạn sau.
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
];
