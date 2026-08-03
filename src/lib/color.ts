/**
 * Tiện ích tương phản màu (WCAG 2.1).
 *
 * Bảng màu accent/EN do người dùng tự đặt trong panel, nên không thể hardcode
 * một giá trị "sáng" cố định. Thay vào đó ta tối dần màu cho tới khi đạt ngưỡng
 * tương phản trên nền giấy sáng — giữ được màu thương hiệu mà vẫn đọc được.
 */

const LIGHT_PAPER = "#f4f3ef";

export function parseHex(input: string): [number, number, number] | null {
  const s = (input || "").trim();
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(s);
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function toHex([r, g, b]: [number, number, number]): string {
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
}

/** Độ chói tương đối theo WCAG. */
export function luminance([r, g, b]: [number, number, number]): number {
  const ch = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
}

/** Tỉ lệ tương phản giữa hai màu, từ 1:1 tới 21:1. */
export function contrast(
  a: [number, number, number],
  b: [number, number, number]
): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/**
 * Tối dần `color` (trộn về đen) cho tới khi đạt `target` tương phản trên nền
 * `bg`. Trả về hex. Nếu màu đã đủ tương phản thì giữ nguyên.
 */
export function darkenToContrast(
  color: string,
  target = 4.5,
  bg = LIGHT_PAPER
): string {
  const rgb = parseHex(color);
  const bgRgb = parseHex(bg);
  if (!rgb || !bgRgb) return color;
  if (contrast(rgb, bgRgb) >= target) return toHex(rgb);

  // Trộn về đen theo từng bước 2%; 50 bước là chạm đen tuyền, luôn hội tụ vì
  // đen trên nền giấy sáng đạt ~18:1.
  for (let i = 1; i <= 50; i++) {
    const t = i / 50;
    const mixed: [number, number, number] = [
      rgb[0] * (1 - t),
      rgb[1] * (1 - t),
      rgb[2] * (1 - t),
    ];
    if (contrast(mixed, bgRgb) >= target) return toHex(mixed);
  }
  return "#000000";
}
