import { ImageResponse } from "next/og";

export const alt = "Hello Tagbilaran, Living City Archive";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          padding: "76px 84px",
          color: "#26251f",
          background: "#fff9eb",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            left: 0,
            display: "flex",
            height: 12,
            background: "#f4c542",
          }}
        />
        <div
          style={{
            display: "flex",
            width: "100%",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              marginBottom: 34,
              color: "#a84332",
              fontFamily: "monospace",
              fontSize: 22,
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            Living City Archive
          </div>
          <div style={{ display: "flex", fontSize: 92, lineHeight: 0.95 }}>
            Hello,
          </div>
          <div
            style={{
              display: "flex",
              color: "#005c09",
              fontSize: 112,
              lineHeight: 0.94,
            }}
          >
            Tagbilaran.
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 38,
              color: "#696253",
              fontSize: 26,
            }}
          >
            A city told through memory, place, and everyday life.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
