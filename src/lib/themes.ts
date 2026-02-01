export const themes = [
  {
    name: 'default',
  },
  {
    name: 'rose',
  },
  {
    name: 'mint',
  },
  {
    name: 'golden',
  },
  {
    name: 'violet',
  },
  {
    name: 'sunset',
  },
] as const;

export type Theme = (typeof themes)[number];
export type ThemeName = Theme['name'];
