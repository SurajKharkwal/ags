const Battery = await Service.import('battery');
const { Label, Box } = Widget

const temp = Variable(45, {
  poll: [6000, ['bash', '-c', "acpi -t | awk '{print $4}'"], out => {
    return Number(out)
  }]
})

const ramUsage = Variable({ total: "16Gb", used: "0Gb", free: "0Gb", percent: 0 }, {
  poll: [10000, ['bash', '-c', "free | awk 'NR==2{print $2,$3,$4}'"], out => {
    try {
      const [total, used, free] = out.trim().split(/\s+/).map(Number);
      const toGb = (value: number) => (value / (1024 * 1024)).toFixed(2) + "Gb";
      const percent = Math.round((used / total) * 100);
      print(total, used, free, "okh")
      return {
        total: toGb(total),
        used: toGb(used),
        free: toGb(free),
        percent
      };
    } catch (error) {
      console.error("Error parsing memory usage:", error);
      return { total: "N/A", used: "N/A", free: "N/A", percent: 0 };
    }
  }]
});


const batteryIcons = {
  charging: {
    "100": "󰂅",
    "90": "󰂋",
    "80": "󰂊",
    "70": "󰢞",
    "60": "󰂉",
    "50": "󰢝",
    "40": "󰂈",
    "30": "󰂇",
    "20": "󰂆",
    "10": "󰢜",
    "0": "󰢟"

  },
  normal: {
    "100": "󰁹",
    "90": "󰂂",
    "80": "󰂁",
    "70": "󰂀",
    "60": "󰁿",
    "50": "󰁽",
    "40": "󰁽",
    "30": "󰁼",
    "20": "󰁻",
    "10": "󰁺",
    "0": "󰂎"
  }
}

type IconsType = keyof typeof batteryIcons["charging"]
const batteryBat = (percent: number, charging: boolean) => {
  const safePercent = Math.max(0, Math.min(100, percent));

  const roundPercent = String(Math.round(safePercent / 10) * 10) as IconsType

  const icon = charging
    ? batteryIcons["charging"][roundPercent]
    : batteryIcons["normal"][roundPercent];

  return Label({
    label: icon
  });
};

const batteryPercent = (percent: number) => Label({
  label: `${percent}%`
})

const batteryBox = () => {
  const { percent, charged, charging } = Battery
  const status = `${percent}% | ${charged ? "Full" : charging ? "Charging" : "Unpluged"}`
  return Box({
    spacing: 5,
    tooltipText: status,
    className: "battery",
    children: [batteryPercent(percent,), batteryBat(percent, (charged || charged) ? true : false)]
  }).hook(Battery, box => {
    const { percent, charged, charging } = Battery
    const status = `${percent}% | ${charged ? "Full" : charging ? "Charging" : "Unpluged"}`
    box.tooltip_text = status
    box.children = [batteryPercent(percent), batteryBat(percent, charged || charging ? true : false)]
  })
}


const ramBox = () => {
  const { total, used, percent } = ramUsage.value

  return Box({
    className: "ram",
    tooltip_text: `${used} | ${total}`,
    child: Label(`${percent}% `)

  }).hook(ramUsage, (box) => {
    const { total, used, percent } = ramUsage.value
    box.tooltip_text = `${used} | ${total}`
    box.child = Label(`${percent}% `)
  })
}
const tempIcons = {
  "30": "",
  "40": "",
  "50": "",
  "60": ""
}

const getTempIcon = (tempValue: number): string => {
  if (tempValue <= 30) return tempIcons["30"];
  if (tempValue <= 40) return tempIcons["40"];
  if (tempValue <= 50) return tempIcons["50"];
  return tempIcons["60"];
}

const tempBox = () => {
  print("temp", temp.value)
  return Box({
    className: "temp",
    tooltip_text: `${temp.value}°C`,
    spacing: 5,
    children: [
      Label({ label: `${temp.value}°C` }),
      Label({ label: getTempIcon(temp.value) })
    ]
  }).hook(temp, (box) => {
    box.tooltip_text = `${temp.value}°C`
    box.children = [
      Label({ label: `${temp.value}°C` }),
      Label({ label: getTempIcon(temp.value) })
    ]
  });
}

export const resourseBox = Box({
  className: "resourse-box",
  children: [ramBox(), tempBox(), batteryBox()]
})
