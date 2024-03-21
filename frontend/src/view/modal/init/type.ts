export const initDBTargets = ["entraid_info", "history"] as const;

export type CheckBoxType = { [K in (typeof initDBTargets)[number]]: boolean };
