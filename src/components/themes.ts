export interface ColorTheme {
  label: string;
  key: string;
  number: string;
  string: string;
  boolean: string;
  null: string;
  punctuation: string;
}

export const themes: Record<string, ColorTheme> = {
  "One Light": {
    label: "One Light",
    key: "#e45649",
    string: "#50a14f",
    number: "#986801",
    boolean: "#0184bc",
    null: "#a0a1a7",
    punctuation: "#383a42",
  },
  "GitHub": {
    label: "GitHub",
    key: "#953800",
    string: "#0a3069",
    number: "#0550ae",
    boolean: "#0550ae",
    null: "#6e7781",
    punctuation: "#24292f",
  },
  "Catppuccin": {
    label: "Catppuccin",
    key: "#1e66f5",
    string: "#40a02b",
    number: "#fe640b",
    boolean: "#d20f39",
    null: "#9ca0b0",
    punctuation: "#4c4f69",
  },
  "Solarized": {
    label: "Solarized",
    key: "#268bd2",
    string: "#2aa198",
    number: "#d33682",
    boolean: "#cb4b16",
    null: "#93a1a1",
    punctuation: "#586e75",
  },
  "Vitesse": {
    label: "Vitesse",
    key: "#998418",
    string: "#b56959",
    number: "#2f798a",
    boolean: "#1e754f",
    null: "#999999",
    punctuation: "#393a34",
  },
  "Classic": {
    label: "Classic",
    key: "#a52a2a",
    string: "#008000",
    number: "#0000ff",
    boolean: "#cc0000",
    null: "#808080",
    punctuation: "#000000",
  },
};

export const DEFAULT_THEME = "One Light";
