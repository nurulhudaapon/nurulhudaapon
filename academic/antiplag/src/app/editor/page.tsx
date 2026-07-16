"use client";

import { useEffect, useRef, useState } from "react";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

export default function MyEditor() {
  const [editor, setEditor] =
    useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const editorRef = useRef<HTMLDivElement>(null!);

  // Instantiate Monaco Editor
  useEffect(() => {
    const options = {
      value: "# Hello World",
      language: "markdown",
    };
    const myEditor = monaco.editor.create(editorRef.current, {
      // value: "# Hello World",
      // language: "javascript",
      theme: "vs-dark",
      automaticLayout: true,
      minimap: {
        enabled: false,
      },
    });

    if (!editor) return;

    setEditor(myEditor);
    return () => {
      editor?.dispose();
    };
  }, [editorRef]);

  return (
    <div
      style={{
        height: "100%",
      }}
      ref={editorRef}
    ></div>
  );
}
