import { ImageResponse } from "next/og";

export const runtime = "edge";

const SIZE = 192;
const BORDER_RADIUS = 48;
const FONT_SIZE = 120;

export function GET(): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: SIZE,
          height: SIZE,
          background: "#0D9488",
          borderRadius: BORDER_RADIUS,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: "bold",
          fontSize: FONT_SIZE,
          fontFamily: "sans-serif",
        }}
      >
        מ
      </div>
    ),
    { width: SIZE, height: SIZE }
  );
}
