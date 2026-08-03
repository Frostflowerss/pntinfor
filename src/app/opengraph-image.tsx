import { ImageResponse } from "next/og";
import { getSiteData } from "@/lib/data";

export const alt = "PNT ARCH — Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Ảnh preview khi chia sẻ link (Facebook / Zalo / LinkedIn / X).
 * Dựng runtime từ dữ liệu hồ sơ nên tự cập nhật theo nội dung trong panel,
 * không phải file tĩnh phải sửa tay.
 */
export default async function Image() {
  const { profile, projects } = await getSiteData();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b0c0e",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 40, height: 3, background: "#5c8cff" }} />
          <div
            style={{
              color: "rgba(236,237,240,0.62)",
              fontSize: 22,
              letterSpacing: 6,
              textTransform: "uppercase",
            }}
          >
            {profile.role || "Architect"}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ color: "#ecedf0", fontSize: 84, lineHeight: 1.05, letterSpacing: -2 }}>
            {profile.name}
          </div>
          <div
            style={{
              color: "#7ea2ff",
              fontSize: 32,
              marginTop: 20,
              maxWidth: 900,
              lineHeight: 1.35,
            }}
          >
            {profile.homeSublineEN || profile.summaryEN}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "rgba(236,237,240,0.52)",
            fontSize: 22,
            letterSpacing: 3,
          }}
        >
          <div>{profile.locationLabel}</div>
          {/* Một node text duy nhất: satori yêu cầu display:flex tường minh cho
              mọi div có nhiều hơn một node con. */}
          <div>{`${String(projects.length).padStart(2, "0")} PROJECTS`}</div>
        </div>
      </div>
    ),
    size
  );
}
