"use client";

import { useEffect, useRef } from "react";
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter, drawSelection } from "@codemirror/view";
import { EditorState, Compartment } from "@codemirror/state";
import { json, jsonParseLinter } from "@codemirror/lang-json";
import { yaml as yamlLang } from "@codemirror/lang-yaml";
import { defaultKeymap, indentWithTab, history, historyKeymap } from "@codemirror/commands";
import { bracketMatching, foldGutter, indentOnInput, syntaxHighlighting, HighlightStyle } from "@codemirror/language";
import { linter, lintGutter, type Diagnostic } from "@codemirror/lint";
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search";
import { closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
import { vim } from "@replit/codemirror-vim";
import { emacs } from "@replit/codemirror-emacs";
import { tags } from "@lezer/highlight";
import { parse as parseYaml, YAMLParseError } from "yaml";

const LARGE_THRESHOLD = 5 * 1024 * 1024; // 5MB

const highlighting = HighlightStyle.define([
  { tag: tags.propertyName, color: "var(--color-editor-text)" },
  { tag: tags.string, color: "var(--color-editor-text)" },
  { tag: tags.number, color: "var(--color-editor-text)" },
  { tag: tags.bool, color: "var(--color-editor-text)" },
  { tag: tags.null, color: "var(--color-muted)" },
  { tag: tags.punctuation, color: "var(--color-muted)" },
  { tag: tags.brace, color: "var(--color-muted)" },
  { tag: tags.squareBracket, color: "var(--color-muted)" },
]);

const editorTheme = EditorView.theme({
  "&": { height: "100%", fontSize: "var(--text-code)" },
  ".cm-content": { fontFamily: "var(--font-jetbrains), var(--font-pretendard), monospace", padding: "8px 0", fontWeight: "400", color: "var(--color-editor-text)" },
  ".cm-gutters": { borderRight: "1px solid var(--color-border)", color: "var(--color-muted)", fontWeight: "400", backgroundColor: "transparent" },
  ".cm-activeLineGutter": { backgroundColor: "var(--color-active-gutter)" },
  ".cm-activeLine": { backgroundColor: "var(--color-active-line)" },
  ".cm-selectionMatch": { backgroundColor: "var(--color-selection-match)" },
  ".cm-cursor": { borderLeftColor: "var(--color-editor-text)" },
  "&.cm-focused .cm-selectionBackground, ::selection": { backgroundColor: "var(--color-selection)" },
  ".cm-fat-cursor": { backgroundColor: "rgba(128,128,128,0.4) !important", color: "transparent !important" },
  "&:not(.cm-focused) .cm-fat-cursor": { backgroundColor: "transparent !important", outline: "solid 1px rgba(128,128,128,0.4)" },
  ".cm-vim-panel": { borderTop: "1px solid var(--color-border)", padding: "2px 8px", fontFamily: "monospace", fontSize: "var(--text-code)", color: "var(--color-editor-text)" },
});

function isLikelyYaml(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  try { JSON.parse(trimmed); return false; } catch {}
  return /^[\w-]+\s*:/m.test(trimmed);
}

const yamlLinter = linter((view: EditorView): Diagnostic[] => {
  const text = view.state.doc.toString().trim();
  if (!text) return [];
  try {
    parseYaml(text, { strict: true });
    return [];
  } catch (e) {
    if (e instanceof YAMLParseError && e.linePos) {
      const pos = e.linePos[0];
      const line = view.state.doc.line(Math.min(pos.line, view.state.doc.lines));
      const from = line.from + Math.min(pos.col - 1, line.length);
      return [{ from, to: from + 1, severity: "error", message: e.message.split("\n")[0] }];
    }
    return [{ from: 0, to: 1, severity: "error", message: String(e) }];
  }
});

const jsonLinter = linter((view: EditorView): Diagnostic[] => {
  const text = view.state.doc.toString().trim();
  if (!text) return [];
  return jsonParseLinter()(view);
});
const jsonMode = [json(), lintGutter(), jsonLinter];
const yamlMode = [yamlLang(), lintGutter(), yamlLinter];
const lightMode: [] = [];

export type Keybinding = "default" | "vim" | "emacs";

function keybindingExtension(kb: Keybinding) {
  if (kb === "vim") return vim();
  if (kb === "emacs") return emacs();
  return [];
}

export default function JsonEditor({ value, onChange, keybinding = "default", onLargeFile }: {
  value: string;
  onChange: (v: string) => void;
  keybinding?: Keybinding;
  onLargeFile?: (large: boolean) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const kbComp = useRef(new Compartment());
  const langComp = useRef(new Compartment());
  const heavyComp = useRef(new Compartment());
  const isYamlRef = useRef(false);
  const isLargeRef = useRef(false);
  const onChangeRef = useRef(onChange);
  const onLargeFileRef = useRef(onLargeFile);
  onChangeRef.current = onChange;
  onLargeFileRef.current = onLargeFile;

  function heavyExtensions() {
    return [
      bracketMatching(),
      closeBrackets(),
      foldGutter(),
      highlightSelectionMatches(),
      highlightActiveLine(),
      highlightActiveLineGutter(),
      indentOnInput(),
      syntaxHighlighting(highlighting),
    ];
  }

  function checkLargeMode(text: string, view: EditorView) {
    const large = text.length > LARGE_THRESHOLD;
    if (large !== isLargeRef.current) {
      isLargeRef.current = large;
      view.dispatch({
        effects: heavyComp.current.reconfigure(large ? lightMode : heavyExtensions()),
      });
      onLargeFileRef.current?.(large);
    }
  }

  useEffect(() => {
    if (!containerRef.current) return;

    const initialYaml = isLikelyYaml(value);
    const initialLarge = value.length > LARGE_THRESHOLD;
    isYamlRef.current = initialYaml;
    isLargeRef.current = initialLarge;

    const view = new EditorView({
      parent: containerRef.current,
      state: EditorState.create({
        doc: value,
        extensions: [
          kbComp.current.of(keybindingExtension(keybinding)),
          lineNumbers(),
          drawSelection(),
          history(),
          langComp.current.of(initialLarge ? lightMode : (initialYaml ? yamlMode : jsonMode)),
          heavyComp.current.of(initialLarge ? lightMode : heavyExtensions()),
          editorTheme,
          keymap.of([
            ...defaultKeymap,
            ...historyKeymap,
            ...searchKeymap,
            ...closeBracketsKeymap,
            indentWithTab,
          ]),
          EditorView.updateListener.of((u) => {
            if (!u.docChanged) return;
            const text = u.state.doc.toString();
            onChangeRef.current(text);

            const large = text.length > LARGE_THRESHOLD;
            const yaml = isLikelyYaml(text);
            const effects: ReturnType<Compartment["reconfigure"]>[] = [];

            if (large !== isLargeRef.current) {
              isLargeRef.current = large;
              effects.push(heavyComp.current.reconfigure(large ? lightMode : heavyExtensions()));
              effects.push(langComp.current.reconfigure(large ? lightMode : (yaml ? yamlMode : jsonMode)));
              isYamlRef.current = yaml;
              onLargeFileRef.current?.(large);
            } else if (!large && yaml !== isYamlRef.current) {
              isYamlRef.current = yaml;
              effects.push(langComp.current.reconfigure(yaml ? yamlMode : jsonMode));
            }

            if (effects.length) {
              u.view.dispatch({ effects });
            }
          }),
          EditorView.lineWrapping,
        ],
      }),
    });
    viewRef.current = view;
    if (initialLarge) onLargeFileRef.current?.(true);
    return () => { view.destroy(); viewRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    viewRef.current?.dispatch({
      effects: kbComp.current.reconfigure(keybindingExtension(keybinding)),
    });
  }, [keybinding]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    if (view.state.doc.toString() === value) return;

    const yaml = isLikelyYaml(value);
    const large = value.length > LARGE_THRESHOLD;
    const effects: ReturnType<Compartment["reconfigure"]>[] = [];

    if (large !== isLargeRef.current) {
      isLargeRef.current = large;
      effects.push(heavyComp.current.reconfigure(large ? lightMode : heavyExtensions()));
      effects.push(langComp.current.reconfigure(large ? lightMode : (yaml ? yamlMode : jsonMode)));
      isYamlRef.current = yaml;
      onLargeFileRef.current?.(large);
    } else if (!large && yaml !== isYamlRef.current) {
      isYamlRef.current = yaml;
      effects.push(langComp.current.reconfigure(yaml ? yamlMode : jsonMode));
    }

    view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: value }, effects });
  }, [value]);

  return <div ref={containerRef} className="h-full overflow-auto min-h-0" />;
}
