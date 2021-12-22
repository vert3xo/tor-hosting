export function base64Encode(text: string) {
  let buf = Buffer.from(text);
  return buf.toString("base64");
}

export function base64Decode(text: string) {
  let buf = Buffer.from(text, "base64");
  return buf.toString("ascii");
}
