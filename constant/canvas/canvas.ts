export const TOOL_MODE_ENUM = {
  SELECT: "SELECT",
  HAND: "HAND",
} as const;

export type ToolModeType = (typeof TOOL_MODE_ENUM)[keyof typeof TOOL_MODE_ENUM];
