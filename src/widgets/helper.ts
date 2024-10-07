const windows = ['wifi-window', 'input-audio-window', 'output-audio-window']
export function toggleWin(win: string) {
  print("win", win)
  windows.forEach(ele => {
    if (ele != win) {
      App.closeWindow(ele)
      return
    }
    App.toggleWindow(ele)
  })
}
