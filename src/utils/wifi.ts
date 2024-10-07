const icons = {
  lockedPoorSpeed: "󰤬",
  lockedMediumSpeed: "󰤤",
  lockedHighSpeed: "󰤪",
  PoorSpeed: "󰤯",
  MediumSpeed: "󰤢",
  HighSpeed: "󰤨"
}

const { Label } = Widget

const ARROW_UP = "";
const ARROW_DOWN = "";
const SPEED_LIMIT = 1024; // KB threshold for conversion

export const createSpeedLabels = (speedValue: string) => {
  const [upload, download] = speedValue.split("|").map(formatSpeed);
  return [Label(`${upload || "0.00 KB/s"} ${ARROW_UP}  `), Label(` ${download || "0.00 KB/s"} ${ARROW_DOWN}`)];
};



const formatSpeed = (speedInKB: string) => {
  const speedValue = parseFloat(speedInKB);

  if (speedValue > SPEED_LIMIT) {
    const speedInMB = (speedValue / SPEED_LIMIT).toFixed(2);
    return `${speedInMB} MB/s`;
  }

  return `${speedValue.toFixed(2)} KB/s`;
};

export async function getAvailableConnections() {
  const rawData = await Utils.execAsync("nmcli -f SSID,SIGNAL,SECURITY,RATE dev wifi");

  const arrConnections = rawData.split("\n").filter(line => line.trim());

  const connections = arrConnections.slice(1).map((line) => {
    const [ssid, signal, security, rate] = line.trim().split(/\s{2,}/);
    const s = Number(signal);

    let wifiIcon;
    if (s > 70 && security === '--') wifiIcon = icons.HighSpeed;
    else if (s > 70 && security !== '--') wifiIcon = icons.lockedHighSpeed;
    else if (s > 40 && security !== '--') wifiIcon = icons.MediumSpeed;
    else if (s > 40 && security === '--') wifiIcon = icons.lockedMediumSpeed;
    else if (s > 0 && security === '--') wifiIcon = icons.PoorSpeed;
    else wifiIcon = icons.lockedPoorSpeed;

    return {
      ssid,
      icon: wifiIcon,
      rate
    };
  });

  return connections;
}

export type ConnectionsType = Awaited<ReturnType<typeof getAvailableConnections>>[number]
