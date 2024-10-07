
import { ConnectionsType, getAvailableConnections } from "src/utils/wifi"
const connections = Variable<ConnectionsType[]>(await getAvailableConnections())
const loading = Variable(false)
const { Label, CenterBox, Box, Button, Window, EventBox, Entry } = Widget
const showEntry = Variable<ConnectionsType | null>(null)  // store the ConnectionsType object of the wifi to show entry

const PasswordInput = (placeholder: string, ssid: string) => Widget.Entry({
  placeholderText: placeholder || "Enter password",  // Ensure there's always a placeholder
  onAccept: async ({ text }) => {
    try {
      showEntry.setValue(null)
      await Utils.execAsync(`nmcli dev wifi connect "${ssid}" password "${text?.toString()}"`);
      print(`Connected to ${ssid}`);
    } catch (err) {
      print(`Error connecting to ${ssid}: ${err}`);
    }
  },
});



const wifiLabel = (data: ConnectionsType) => {
  if (!data.ssid) return Widget.Label("Invalid Wi-Fi data");

  const isInputVisible = Variable(false);  // Track password input visibility

  const wifiLabels = Widget.Box({
    children: [
      Widget.Label(data.icon),  // Wi-Fi icon
      Widget.Label(`${data.ssid} (${data.rate} Mbps)`),  // SSID and rate display
      Widget.Button({
        label: "󰛂",  // Toggle input visibility button
        on_clicked: () => { isInputVisible.setValue(!isInputVisible.value); console.log(isInputVisible.value) }
      }),
    ],
  });
  return EventBox({
    on_primary_click: () => showEntry.setValue(data),
    child: Box({
      vertical: true,
      children: [wifiLabels, PasswordInput("Enter wifi password", data.ssid)
      ],
      setup: self => self.hook(showEntry, () => {
        if (showEntry.value == data) return self.children = [wifiLabels, PasswordInput("Enter the password", data.ssid)]
        return self.children = [wifiLabels]
      })
    })
  })
}

const wifiHeader = CenterBox({
  startWidget: Label("Wifi "),
  endWidget: Button({
    on_primary_click: async () => {
      loading.setValue(true)
      connections.setValue(await getAvailableConnections())
      loading.setValue(false)
    }
    , label: "󰑓"
  })
})

const wifiSate = (state: 'Loading ...' | 'No wifi Available') => CenterBox({
  centerWidget: Label(state)
})

connections.connect("changed", () => {
  loading.setValue(!loading.value)
})

const createChildren = () => {
  if (loading.value) return [wifiSate("Loading ...")]
  if (connections.value.length > 0) return connections.value.map((ele) => wifiLabel(ele))
  else return [wifiSate("No wifi Available")]
}

export const wifiMenu = Box({
  vertical: true,
  children: [wifiHeader, ...createChildren()]
}).hook(loading, box => box.children = [wifiHeader, ...createChildren()]
)

export const wifiWindow = Window({
  monitor: 0,
  visible: false,
  name: "wifi-window",
  keymode: "on-demand",
  child: wifiMenu
});


