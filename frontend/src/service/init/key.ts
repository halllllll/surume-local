export const initKeys = {
  just: ['init'] as const,
  //all: ["init"] as const,
  // one: () => [...initKeys.all] as const,
} as const;
