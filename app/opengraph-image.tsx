import { ImageResponse } from "next/og";

export const alt = "Hello Tagbilaran — where every street leads to a story";
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
          position: "relative",
          padding: "76px 84px",
          color: "#26251f",
          background: "#fff9eb",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "0 0 0 62%",
            display: "flex",
            background: "#005c09",
            clipPath: "polygon(18% 0, 100% 0, 100% 100%, 0 100%)",
          }}
        />
        <div
          style={{
          width: "72%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              marginBottom: 34,
              color: "#a84332",
              fontFamily: "monospace",
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            Tagbilaran City · Bohol
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
          <div style={{ display: "flex", marginTop: 38, fontSize: 28 }}>
            Where every street leads to a story.
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            right: 62,
            bottom: 48,
            display: "flex",
            width: 140,
            height: 140,
            alignItems: "center",
            justifyContent: "center",
            color: "#fff9eb",
            border: "4px solid #f4c542",
            borderRadius: "50%",
            fontFamily: "monospace",
            fontSize: 20,
            transform: "rotate(-8deg)",
          }}
        >
          FIELD 01
        </div>
      </div>
    ),
    size,
  );
}
