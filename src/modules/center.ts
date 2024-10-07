const FormatedDate = Variable('', {
  poll: [1000, () => {
    const now = new Date();

    // Format date as "23 September 2024"
    const datePart = now.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    // Format time as "02:30 pm"
    const timePart = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    // Combine both date and time
    return `${datePart} | ${timePart}`;
  }]
});

export const centerBox = Widget.Box({
  className: "centerBox",
  child: Widget.Label({ className: "time", label: FormatedDate.value })
}).hook(FormatedDate, cBox => cBox.child = Widget.Label({ className: "time", label: FormatedDate.value }))
