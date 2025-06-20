"use client";

import { CanvasTextArea, wrap } from "./CanvasTextArea";
import { useMemo } from "react";

interface CanvasMessageProps {
  text: string;
}

const FULL_LINE_WIDTH = 400;

export function CanvasMessage({ text }: CanvasMessageProps) {
  const linesCount = useMemo(() => {
    const wrapped = wrap(text, 40, 4);
    const filtered = wrapped.filter((l) => l.trim() !== "");
    return Math.max(1, filtered.length);
  }, [text]);

  return (
    <CanvasTextArea
      value={text}
      onChange={() => {}}
      readOnly
      width={FULL_LINE_WIDTH}
      lines={linesCount}
      showLines={false}
    />
  );
}
