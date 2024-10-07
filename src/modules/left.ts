
import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js';
import { Box, Label, Button } from 'resource:///com/github/Aylur/ags/widget.js';
import { execAsync } from 'resource:///com/github/Aylur/ags/utils.js';
// const icons = {
//   inactive: [
//     '', '󰿤', '󰂕', '󰉖', '󱙌',
//     '󰆉', '󱍚', '󰺶', '󱋢', '󰤑'
//   ],
//   active: [
//     '󰋜', '󰿣', '󰂔', '󰉋', '󱙋',
//     '󰆈', '󱍙', '󰺵', '󱋡', '󰙨'
//   ],
// };

const icons = {
  inactive: ['', '', '', '', '', '', '', '', '', '',],
  active: ['󱐡', '󱐡', '󱐡', '󱐡', '󱐡', '󱐡', '󱐡', '󱐡', '󱐡', '󱐡',]
}
type iconsType = typeof icons;

const createWorkspaceButton = (i: number, active: boolean, hasWindows: boolean, icons: iconsType) => {
  return Button({
    onClicked: () => execAsync(`hyprctl dispatch workspace ${i}`),
    cursor: "pointer",
    child: Label({
      className: "workspace-icon",
      label: active ? icons.active[i - 1] : icons.inactive[i - 1],
    }),
    className: active
      ? 'unset focused'
      : hasWindows
        ? 'unset unfocused has-windows'
        : 'unset unfocused',
  });
};

const Workspaces = () => {


  return Box({
    className: 'workspace-box',
  }).hook(Hyprland, (box) => {
    const workspaceButtons = Array.from({ length: 10 }, (_, i) => {
      const id = i + 1;
      const active = Hyprland.active.workspace.id === id;
      const workspace = Hyprland.workspaces.find((item) => item.id === id);
      const hasWindows = workspace ? workspace.windows > 0 : false;

      return createWorkspaceButton(id, active, hasWindows, icons);
    });

    box.children = workspaceButtons;
  });
};

// Define the left box with the workspaces
const leftBox = Box({
  children: [Workspaces()], // Call Workspaces function to get the widget
  vertical: false, // Horizontal arrangement
});

export default leftBox;
