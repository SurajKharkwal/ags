import { rightBox, } from "src/modules/right"
import leftBox from "./src/modules/left"
import { centerBox } from "src/modules/center"
import { wifiWindow } from "src/widgets/wifi"
import { inputAudioWin, outputAudioWin } from "src/widgets/audio"

const css = `${App.configDir}/src/styles/style.scss`

const Bar = (monitorIndex: number) => Widget.Window({
  monitor: monitorIndex,
  name: `Bar${monitorIndex}`,
  anchor: ['top', 'left', 'right'],
  keymode: "on-demand",
  exclusivity: 'exclusive',
  className: `bar${monitorIndex}`,
  child: Widget.CenterBox({
    start_widget: leftBox,
    center_widget: centerBox,
    end_widget: rightBox
  }),
})

App.config({
  windows: [Bar(0), wifiWindow, inputAudioWin, outputAudioWin],
  style: css,
})

