import { AudioType, ConnectDev, getDevice } from "src/utils/audio";

const { Button, Label, Box, Window, Slider } = Widget

type Icons = "" | ""

const Audio = await Service.import('audio');

const VolumeSlider = (type: AudioType) => Slider({
  hexpand: true,
  drawValue: false,
  step: 5,
  onChange: ({ value }) => Audio[type].volume = value,
  value: Audio[type].bind('volume'),
})

const createSlider = (icon: Icons, type: AudioType) => Box({
  children: [
    Label(icon),
    VolumeSlider(type)
  ]
});

const audioLabel = (label: string, isActive: boolean, name: string, type: AudioType) => {
  return Button({
    onClicked: () => ConnectDev(name, type),
    className: `${isActive ? "audio-btn-unfocused" : "audio-btn-focused"}`,
    child: Box({
      spacing: 5,
      children: [
        Label({ label: isActive ? "" : "", hpack: "center" }),
        Label({ label: label, hpack: "center" }),
      ]
    })
  });
};

export const AvailableDev = (icon: Icons, type: AudioType) => {
  const createChildren = [createSlider(icon, type), ...getDevice(type).map((ele) => {
    const { isActive, desc, name } = ele
    return audioLabel(desc, isActive, name, type)
  })];
  return Box({
    className: "audio-box",
    spacing: 5,
    vertical: true,
    children: createChildren
  }).hook(Audio, (box) => {
    const newChildren = [createSlider(icon, type), ...getDevice(type).map((ele) => {
      const { isActive, desc, name } = ele
      return audioLabel(desc, isActive, name, type)
    })];
    box.children = newChildren
  });

};

export const outputAudioWin = Window({
  monitor: 0,
  anchor: ['top', 'right'],
  margins: [20, 300],
  visible: false,
  name: "output-audio-window",
  className: "audio-win",
  child: AvailableDev("", "speaker")
})

export const inputAudioWin = Window({
  monitor: 0,
  margins: [5, 300],
  visible: false,
  anchor: ['top', 'right'],
  name: "input-audio-window",
  className: "audio-win",
  child: AvailableDev("", "microphone")
})


