const Audio = await Service.import('audio');
export type AudioType = 'speaker' | 'microphone';

const reMapDevices = {
  speaker: [
    { oldName: "Zeb SoundMX Analog Stereo", newName: "HeadPhone" },
    { oldName: "Raptor Lake High Definition Audio Controller Speaker", newName: "System Speaker" }
  ],
  microphone: [
    { oldName: "Raptor Lake High Definition Audio Controller Headphones Stereo Microphone", newName: "HeadPhone" },
    { oldName: "Raptor Lake High Definition Audio Controller Digital Microphone", newName: "System Microphone" }
  ]
};

const toIgnoreSpeakers = [
  "Raptor Lake High Definition Audio Controller HDMI / DisplayPort 3 Output",
  "Raptor Lake High Definition Audio Controller HDMI / DisplayPort 2 Output",
  "Raptor Lake High Definition Audio Controller HDMI / DisplayPort 1 Output"
];

const getRemappedDeviceName = (description: string | undefined, remapList: { oldName: string, newName: string }[], defaultName: string, i: number) => {
  const mappedDevice = remapList.find(element => element.oldName === description);
  return mappedDevice ? mappedDevice.newName : description || `${defaultName}${i}`;
};

const getDevices = (devices: any[], activeDeviceName: string, type: AudioType, toIgnore: string[] = []) => {
  const remapList = reMapDevices[type];
  return devices
    .filter(ele => !toIgnore.includes(ele.description || ""))
    .map((ele, i) => ({
      desc: getRemappedDeviceName(ele.description, remapList, `${type}_dev`, i),
      isActive: ele.name === activeDeviceName,
      name: ele.name || ""
    }));
};

export const getDevice = (type: AudioType) => {
  const activeDeviceName = Audio[type]?.name || "";
  const devices = type === 'speaker' ? Audio.speakers : Audio.microphones;
  const ignoreList = type === 'speaker' ? toIgnoreSpeakers : [];
  return getDevices(devices, activeDeviceName, type, ignoreList);
};

export const ConnectDev = (name: string, type: AudioType) => {
  const devices = Audio[type === 'speaker' ? 'speakers' : 'microphones'];
  const device = devices.find(ele => ele.name === name);
  if (device) {
    Audio[type] = device;
  }
};
