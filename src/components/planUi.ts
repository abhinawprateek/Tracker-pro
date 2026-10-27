// src/components/planUi.ts
export const card = 'rounded-2xl border border-gray-800 bg-gray-900/60';
export const field =
  'rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary [color-scheme:dark]';
export const btnPrimary =
  'inline-flex items-center justify-center gap-1 rounded-xl bg-primary/20 px-4 py-2 text-sm font-bold text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary';
export const btnGhost =
  'inline-flex items-center justify-center gap-1 rounded-xl border border-gray-700 px-4 py-2 text-sm text-gray-300 hover:border-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary';
export const chip = (on: boolean) =>
  `rounded-full border px-3 py-1 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
    on ? 'border-primary bg-primary/20 text-primary' : 'border-gray-800 text-gray-400'
  }`;
export const shuffle = <T,>(arr: T[]): T[] => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i];
    a[i] = a[j];
    a[j] = t;
  }
  return a;
};

