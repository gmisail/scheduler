const ALL_COLORS = [
  "#D1D5DB",
  "#FCA5A5",
  "#FDBA74",
  "#86EFAC",
  "#93C5FD",
  "#C4B5FD",
  "#F9A8D4",
];

export function getColorForCrn(crn: number): string {
  return ALL_COLORS[crn % ALL_COLORS.length];
}
