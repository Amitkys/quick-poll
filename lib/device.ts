import { createHash } from "crypto";

export function getDeviceId(req: any) {
  let deviceId = req.cookies.deviceId;

  if (!deviceId) {
    deviceId = createHash("sha256")
      .update(req.headers["user-agent"] || "")
      .digest("hex");
  }

  return deviceId;
}
