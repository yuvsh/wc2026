import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon(): ImageResponse {
  const imgData = readFileSync(join(process.cwd(), "public/icons/wc26_app_icon.jpeg"));
  const dataUrl = `data:image/jpeg;base64,${imgData.toString("base64")}`;

  return new ImageResponse(
    // eslint-disable-next-line @next/next/no-img-element
    <img src={dataUrl} width={180} height={180} style={{ borderRadius: 40 }} alt="" />,
    { ...size }
  );
}
