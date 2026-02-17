"use client";

import { useEffect, useRef, useCallback } from "react";
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter, drawSelection } from "@codemirror/view";
import { EditorState, Compartment } from "@codemirror/state";
import { json, jsonParseLinter } from "@codemirror/lang-json";
import { defaultKeymap, indentWithTab, history, historyKeymap } from "@codemirror/commands";
import { bracketMatching, foldGutter, indentOnInput, syntaxHighlighting, HighlightStyle } from "@codemirror/language";
import { linter, lintGutter } from "@codemirror/lint";
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search";
import { closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
import { vim } from "@replit/codemirror-vim";
import { tags } from "@lezer/highlight";

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  vimMode: boolean;
}

const jsonHighlightStyle = HighlightStyle.define([
  { tag: tags.propertyName, color: "#a52a2a", fontWeight: "bold" },
  { tag: tags.string, color: "#008000" },
  { tag: tags.number, color: "#0000ff" },
  { tag: tags.bool, color: "#cc0000" },
  { tag: tags.null, color: "#808080" },
  { tag: tags.punctuation, color: "#000000" },
  { tag: tags.brace, color: "#000000" },
  { tag: tags.squareBracket, color: "#000000" },
]);

const lightTheme = EditorView.theme({
  "&": {
    height: "100%",
    fontSize: "13px",
    backgroundColor: "#ffffff",
  },
  ".cm-content": {
    fontFamily: "'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace",
    padding: "8px 0",
  },
  ".cm-gutters": {
    backgroundColor: "#f8f9fa",
    borderRight: "1px solid #e0e0e0",
    color: "#999",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "#e8f0fe",
  },
  ".cm-activeLine": {
    backgroundColor: "#f0f4ff",
  },
  ".cm-selectionMatch": {
    backgroundColor: "#d7e8ff",
  },
  ".cm-cursor": {
    borderLeftColor: "#333",
  },
  "&.cm-focused .cm-selectionBackground, ::selection": {
    backgroundColor: "#b4d5fe",
  },
  ".cm-foldGutter .cm-gutterElement": {
    cursor: "pointer",
  },
  // Vim cursor styles
  ".cm-fat-cursor": {
    backgroundColor: "rgba(0,0,0,0.3) !important",
    color: "transparent !important",
  },
  "&:not(.cm-focused) .cm-fat-cursor": {
    backgroundColor: "transparent !important",
    outline: "solid 1px rgba(0,0,0,0.3)",
  },
  ".cm-vim-panel": {
    backgroundColor: "#f8f9fa",
    borderTop: "1px solid #e0e0e0",
    padding: "2px 8px",
    fontFamily: "monospace",
    fontSize: "12px",
  },
});

export default function JsonEditor({ value, onChange, vimMode }: JsonEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  const vimCompartment = useRef(new Compartment());
  onChangeRef.current = onChange;

  const createState = useCallback((doc: string) => {
    return EditorState.create({
      doc,
      extensions: [
        vimCompartment.current.of(vimMode ? vim() : []),
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightActiveLine(),
        drawSelection(),
        indentOnInput(),
        bracketMatching(),
        closeBrackets(),
        foldGutter(),
        highlightSelectionMatches(),
        history(),
        lintGutter(),
        json(),
        linter(jsonParseLinter()),
        syntaxHighlighting(jsonHighlightStyle),
        lightTheme,
        keymap.of([
          ...defaultKeymap,
          ...historyKeymap,
          ...searchKeymap,
          ...closeBracketsKeymap,
          indentWithTab,
        ]),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChangeRef.current(update.state.doc.toString());
          }
        }),
        EditorView.lineWrapping,
      ],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const view = new EditorView({
      state: createState(value),
      parent: containerRef.current,
    });
    viewRef.current = view;
    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createState]);

  // Toggle vim mode
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    view.dispatch({
      effects: vimCompartment.current.reconfigure(vimMode ? vim() : []),
    });
  }, [vimMode]);

  // Update editor content when value changes externally
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const currentValue = view.state.doc.toString();
    if (currentValue !== value) {
      view.dispatch({
        changes: { from: 0, to: currentValue.length, insert: value },
      });
    }
  }, [value]);

  return (
    <div
      ref={containerRef}
      className="h-full overflow-auto"
      style={{ minHeight: 0 }}
    />
  );
}
