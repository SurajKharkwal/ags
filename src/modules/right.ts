import { exec } from "resource:///com/github/Aylur/ags/utils/exec.js";
import { createSpeedLabels } from "src/utils/wifi";
import { toggleWin } from "src/widgets/helper";
import { resourseBox } from "src/widgets/resourseUsage";
const { Button, Box } = Widget;

const Speed = Variable("0KB/s  0KB/s ", {
  listen: `${App.configDir}/src/scripts/net-speed.sh`
});

const audioButton = Button({
  className: "audio-btn",
  cursor: 'pointer',
  label: "",
  on_clicked: () => toggleWin("output-audio-window")
});

const microphoneButton = Button({
  className: "micro-btn",
  cursor: 'pointer',
  label: "󰍬",
  on_clicked: () => toggleWin("input-audio-window")
});

const wifiBtn = Button({
  className: "wifi-btn",
  cursor: 'pointer',
  onClicked: () => toggleWin('wifi-window'),
  child: Box({
    spacing: 5,
    children: createSpeedLabels(Speed.value)
  })
}).hook(Speed, (btn) => {
  btn.child = Box({
    children: createSpeedLabels(Speed.value)
  });
});

const shutdownBtn = Button({
  label: "",
  on_primary_click: () => exec("systemctl poweroff"),
  className: "shutdownBtn powerBtn",
  cursor: "pointer"
});

const logoutBtn = Button({
  label: "󰍃",
  on_primary_click: () => exec("hyprctl dispatch exit"),
  className: "logoutBtn powerBtn",
  cursor: "pointer"
});

const restartBtn = Button({
  label: "",
  on_primary_click: () => exec("systemctl reboot"),
  className: "restartBtn powerBtn",
  cursor: "pointer"
});


export const rightBox = Box({
  hpack: "end",
  spacing: 4,
  children: [
    wifiBtn,
    Box({
      cursor: 'pointer',
      children: [audioButton, microphoneButton],
      className: "audio"
    }),
    resourseBox,
    Box({
      children: [logoutBtn, restartBtn, shutdownBtn],
      className: "powerOptions"
    })
  ]
});


