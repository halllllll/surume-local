export const entraIdKeys = {
  all: ["entraid"] as const,
  one: () => [...entraIdKeys.all] as const
} as const;
