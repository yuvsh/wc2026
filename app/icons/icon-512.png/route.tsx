import { ImageResponse } from "next/og";

export const runtime = "edge";

const SIZE = 512;
const BORDER_RADIUS = 128;
const FONT_SIZE = 320;

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
