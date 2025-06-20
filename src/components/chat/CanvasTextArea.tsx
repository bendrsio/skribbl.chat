"use client";

import { useEffect, useRef, useState } from "react";

interface CanvasTextAreaProps {
  /** Controlled value */
  value: string;
  /** Callback whenever value changes */
  onChange: (val: string) => void;
  /** Whether the component should be read-only. When true it will not render the hidden textarea. */
  readOnly?: boolean;
  /** Pixel width of the canvas. Defaults to 400. */
  width?: number;
  /** Pixel height of each line. Defaults to 24. */
  lineHeight?: number;
  /** Number of lines – currently fixed at 4 for the Pictochat layout. */
  lines?: number;
  /** Max characters per line before wrapping. Defaults to 40. */
  charsPerLine?: number;
  /** HEX colour for the underline when showLines is true. */
  lineColor?: string;
  /** Font string used for drawing. */
  font?: string;
  /** Whether to draw the underlines. Defaults to true (only disable for read-only message render). */
  showLines?: boolean;
  /** Callback when the user presses Enter (newline suppressed). */
  onEnter?: () => void;
  /** Whether to show the blinking cursor. Defaults to false. */
  showCursor?: boolean;
  /** HEX colour for the blinking cursor. */
  cursorColor?: string;
}

/**
 * Canvas-based text area that mimics PictoChat-style message composition.
 * It draws four under-lined rows and streams characters onto them as you type.
 * The component is *controlled* – pass `value` and `onChange`.
 */
export function CanvasTextArea({
  value,
  onChange,
  readOnly = false,
  width = 400,
  lineHeight = 24,
  lines = 4,
  charsPerLine = 40,
  lineColor = "#cecdc3", // default border color
  showLines = true,
  onEnter,
  showCursor = false,
  cursorColor,
  font = "16px 'A-OTF Shin Go Pro', sans-serif",
}: CanvasTextAreaProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [cursorVisible, setCursorVisible] = useState(true);

  // Redraw whenever value changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Ensure device-pixel-ratio crispness
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = lines * lineHeight * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${lines * lineHeight}px`;
    ctx.scale(dpr, dpr);

    // Clear
    ctx.clearRect(0, 0, width, lines * lineHeight);

    // Style
    ctx.font = font;
    ctx.fillStyle = "#100f0f"; // matches --foreground
    ctx.textBaseline = "top";

    // Draw underlines and text line-by-line
    const wrapped = wrap(value, charsPerLine, lines);

    for (let i = 0; i < lines; i++) {
      const y = i * lineHeight;

      // Draw text if available
      if (wrapped[i]) {
        ctx.fillText(wrapped[i], 0, y);
      }

      // Draw subtle underline
      if (showLines) {
        ctx.strokeStyle = hexToRgba(lineColor, 0.4);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, y + lineHeight - 5);
        ctx.lineTo(width, y + lineHeight - 5);
        ctx.stroke();
      }
    }

    // Draw blinking cursor
    if (showCursor && cursorVisible) {
      const currentLine = Math.min(
        lines - 1,
        Math.floor(value.length / charsPerLine)
      );
      const charIndexInLine = value.length % charsPerLine;
      const textBefore = wrapped[currentLine]?.slice(0, charIndexInLine) || "";
      const cursorX = ctx.measureText(textBefore).width;
      const cursorY = currentLine * lineHeight;
      ctx.fillStyle = cursorColor || lineColor;
      ctx.fillRect(cursorX, cursorY + 2, 2, lineHeight - 6);
    }
  }, [
    value,
    width,
    lineHeight,
    lines,
    charsPerLine,
    lineColor,
    font,
    showLines,
    showCursor,
    cursorVisible,
    cursorColor,
  ]);

  // Keep textarea value in sync and proxy events → onChange
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Normalise to max length (lines * charsPerLine)
    const maxChars = lines * charsPerLine;
    const next = e.target.value.slice(0, maxChars);
    onChange(next);
  };

  const moveCaretToEnd = () => {
    const t = textareaRef.current;
    if (t) {
      const len = t.value.length;
      t.selectionStart = t.selectionEnd = len;
    }
  };

  // Cursor blink effect
  useEffect(() => {
    if (!showCursor) return;
    const id = setInterval(() => setCursorVisible((v) => !v), 500);
    return () => clearInterval(id);
  }, [showCursor]);

  // Initial focus when component mounts
  useEffect(() => {
    if (readOnly) return;
    // Small timeout to ensure DOM ready
    const id = setTimeout(() => {
      textareaRef.current?.focus();
      moveCaretToEnd();
    }, 0);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative">
      <canvas ref={canvasRef} />
      {readOnly ? null : (
        <textarea
          ref={textareaRef}
          className="absolute inset-0 h-full w-full resize-none bg-transparent text-transparent caret-transparent focus:outline-none"
          value={value}
          onChange={handleChange}
          maxLength={lines * charsPerLine}
          rows={lines}
          onClick={moveCaretToEnd}
          onFocus={moveCaretToEnd}
          onBlur={() => {
            // Refocus to ensure keyboard input always directed here
            requestAnimationFrame(() => {
              textareaRef.current?.focus();
              moveCaretToEnd();
            });
          }}
          // Allow Enter but we'll strip newline characters – we want automatic wrapping only
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (onEnter) onEnter();
            }
          }}
        />
      )}
    </div>
  );
}

/**
 * Very simple hard-wrap: slices the string into fixed-width lines. If the input
 * contains newlines we honour them. No word-wrap intelligence for now.
 */
export function wrap(text: string, charsPerLine: number, maxLines: number) {
  const output: string[] = [];
  const parts = text.split(/\n/);
  for (const segment of parts) {
    let idx = 0;
    while (idx < segment.length && output.length < maxLines) {
      output.push(segment.slice(idx, idx + charsPerLine));
      idx += charsPerLine;
    }
    if (output.length >= maxLines) break;
  }
  // Pad missing lines with empty strings to make rendering easier
  while (output.length < maxLines) output.push("");
  return output;
}

/** Convert hex like "#205EA6" to rgba with given alpha */
function hexToRgba(hex: string, alpha: number) {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
