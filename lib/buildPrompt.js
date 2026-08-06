export function buildRenovatePrompt({ roomTypeEn, style }) {
  return (
    `Redesign this ${roomTypeEn} in a ${style} style. ` +
    `Preserve the room's main architecture and layout — keep the walls, windows, doors, ceiling, ` +
    `and overall structure exactly the same. Only change the furniture, decorations, colors, ` +
    `textiles, and styling to match a clean ${style} interior design. ` +
    `Make it look photorealistic and professionally staged.`
  );
}
