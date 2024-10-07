
const Bluetooth = await Service.import("bluetooth")

export function getAvailableDev() {
  const dev = Bluetooth.devices
  if (dev.length === 0) print("No dev found")
  else dev.forEach(ele => print(ele.name))

}

