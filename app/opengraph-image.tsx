import { ImageResponse } from "next/og";

export const alt = "Qiuizi OS — Building practical desktop & Android tools";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#05070c",
          color: "#f5f7fc",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -160,
            left: -80,
            width: 520,
            height: 520,
            borderRadius: 520,
            backgroundColor: "#1a2748",
            opacity: 0.85,
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -120,
            bottom: -180,
            width: 480,
            height: 480,
            borderRadius: 480,
            backgroundColor: "#241838",
            opacity: 0.8,
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 12, height: 12, borderRadius: 12, backgroundColor: "#38bdf8" }} />
          <div style={{ fontSize: 22, letterSpacing: 4, color: "#9ec3dd" }}>QIUZI OS</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 92, fontWeight: 700, letterSpacing: -2 }}>Qiuizi</div>
          <div style={{ fontSize: 34, color: "#d5deec" }}>Building practical desktop & Android tools</div>
        </div>
        <div style={{ display: "flex", gap: 22, fontSize: 22, color: "#b7c3d6" }}>
          <div>Qisland</div>
          <div>DeepUnpack</div>
          <div>CourseWorkspace</div>
          <div>LightSkip</div>
          <div>XiangqiStudio</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
