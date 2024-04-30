export const driveitemkeys = {
  all: ['diriveitems'] as const,
  byname: (name: string) => [...driveitemkeys.all, name] as const,
  byid: (id: string) => [...driveitemkeys.all, id] as const,
} as const;
