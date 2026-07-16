"use client";

import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
hljs.registerLanguage("javascript", javascript);
import SyntaxHighlighter from "react-syntax-highlighter";
import {
  docco,
  atomOneDark,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import "highlight.js/styles/github-dark.css";

import React, { useEffect, useRef, useState } from "react";
import {
  calculateTextCosineSimilarity,
} from "../../algo";

export const CodeBlock = ({
  children,
  name,
}: {
  children: React.ReactNode;
  name?: string;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [code, setCode] = useState(children?.toString() || "");

  console.log(
    calculateTextCosineSimilarity(
      'function hello() { console.log("hello world") }',
      'function hello() { console.log("hello earth") }'
    )
  );

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={() => textareaRef.current?.focus()}
      onClick={() => textareaRef.current?.focus()}
      className="relative flex bg-[#282a36] rounded-md mt-3  min-h-[100px]"
    >
      <textarea
        name={name}
        className="absolute inset-0 resize-none bg-transparent p-2 font-mono text-transparent caret-white outline-none rounded min-h-[100px]"
        ref={textareaRef}
        value={code}
        required
        rows={10}
        defaultValue={children?.toString() || ""}
        onChange={(e) => setCode(e.target.value)}
      />
      <SyntaxHighlighter
          language="c"
        style={atomOneDark}
        customStyle={{
          flex: "1",
          background: "transparent",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export const CodeBlockSimple = ({
  children,
  name,
}: {
  children: React.ReactNode;
  name?: string;
}) => {
  return (
    <SyntaxHighlighter
        language="c"
      style={atomOneDark}
      customStyle={{
        flex: "1",
        height: "300px",
        background: "transparent",
      }}
    >
      {children?.toString() || ""}
    </SyntaxHighlighter>
  );
};
