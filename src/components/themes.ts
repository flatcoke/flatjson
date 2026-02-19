export interface ColorTheme {
  label: string;
  key: string;
  number: string;
  string: string;
  boolean: string;
  null: string;
  punctuation: string;
}

interface ThemePair {
  light: ColorTheme;
  dark: ColorTheme;
}

const themePairs: Record<string, ThemePair> = {
  "One Light": {
    light: {
      label: "One Light",
      key: "#e45649",
      string: "#50a14f",
      number: "#986801",
      boolean: "#0184bc",
      null: "#a0a1a7",
      punctuation: "#383a42",
    },
    dark: {
      label: "One Dark",
      key: "#e06c75",
      string: "#98c379",
      number: "#d19a66",
      boolean: "#56b6c2",
      null: "#5c6370",
      punctuation: "#abb2bf",
    },
  },
  "GitHub": {
    light: {
      label: "GitHub",
      key: "#953800",
      string: "#0a3069",
      number: "#0550ae",
      boolean: "#0550ae",
      null: "#6e7781",
      punctuation: "#24292f",
    },
    dark: {
      label: "GitHub Dark",
      key: "#ffa657",
      string: "#a5d6ff",
      number: "#79c0ff",
      boolean: "#79c0ff",
      null: "#8b949e",
      punctuation: "#c9d1d9",
    },
  },
  "Catppuccin": {
    light: {
      label: "Catppuccin",
      key: "#1e66f5",
      string: "#40a02b",
      number: "#fe640b",
      boolean: "#d20f39",
      null: "#9ca0b0",
      punctuation: "#4c4f69",
    },
    dark: {
      label: "Catppuccin Mocha",
      key: "#89b4fa",
      string: "#a6e3a1",
      number: "#fab387",
      boolean: "#f38ba8",
      null: "#6c7086",
      punctuation: "#cdd6f4",
    },
  },
  "Solarized": {
    light: {
      label: "Solarized",
      key: "#268bd2",
      string: "#2aa198",
      number: "#d33682",
      boolean: "#cb4b16",
      null: "#93a1a1",
      punctuation: "#586e75",
    },
    dark: {
      label: "Solarized Dark",
      key: "#268bd2",
      string: "#2aa198",
      number: "#d33682",
      boolean: "#cb4b16",
      null: "#586e75",
      punctuation: "#93a1a1",
    },
  },
  "Vitesse": {
    light: {
      label: "Vitesse",
      key: "#998418",
      string: "#b56959",
      number: "#2f798a",
      boolean: "#1e754f",
      null: "#999999",
      punctuation: "#393a34",
    },
    dark: {
      label: "Vitesse Dark",
      key: "#e6cc77",
      string: "#c98a7d",
      number: "#4c9a91",
      boolean: "#4d9375",
      null: "#666666",
      punctuation: "#dbd7ca",
    },
  },
  "Classic": {
    light: {
      label: "Classic",
      key: "#a52a2a",
      string: "#008000",
      number: "#0000ff",
      boolean: "#cc0000",
      null: "#808080",
      punctuation: "#000000",
    },
    dark: {
      label: "Classic Dark",
      key: "#f28b82",
      string: "#81c995",
      number: "#8ab4f8",
      boolean: "#f28b82",
      null: "#9aa0a6",
      punctuation: "#e8eaed",
    },
  },
};

// Export light themes as the default `themes` map (for theme selector)
export const themes: Record<string, ColorTheme> = Object.fromEntries(
  Object.entries(themePairs).map(([name, pair]) => [name, pair.light])
);

export function getTheme(name: string, dark: boolean): ColorTheme {
  const pair = themePairs[name];
  if (!pair) return themePairs["One Light"][dark ? "dark" : "light"];
  return dark ? pair.dark : pair.light;
}

export const DEFAULT_THEME = "One Light";
