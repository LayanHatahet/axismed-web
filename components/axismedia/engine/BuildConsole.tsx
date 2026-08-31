"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/**
 * The Engine's build log: lines stream in character by character like an AI
 * run, then hand off to the reveal. Skippable, and instant for reduced motion.
 */
export function BuildConsole({ lines, onDone }: { lines: string[]; onDone: () => void }) {
  const [rendered, setRendered] = useState<string[]>([]);
  const [pct, setPct] = useState(0);
  const doneRef = useRef(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      const show = setTimeout(() => {
        setRendered(lines);
        setPct(100);
      }, 0);
      const t = setTimeout(onDone, 500);
      return () => {
        clearTimeout(show);
        clearTimeout(t);
      };
    }

    let line = 0;
    let chr = 0;
    let out: string[] = [];
    let timer: ReturnType<typeof setTimeout>;

    function tick() {
      if (line >= lines.length) {
        if (!doneRef.current) {
          doneRef.current = true;
          setPct(100);
          timer = setTimeout(onDone, 550);
        }
        return;
      }
      const current = lines[line];
      chr = Math.min(chr + 2, current.length);
      out = [...out.slice(0, line), current.slice(0, chr)];
      setRendered(out);
      setPct(Math.round(((line + chr / current.length) / lines.length) * 100));
      if (chr >= current.length) {
        line++;
        chr = 0;
        timer = setTimeout(tick, 210);
      } else {
        timer = setTimeout(tick, 14);
      }
    }
    timer = setTimeout(tick, 350);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full max-w-lg">
      <div className="overflow-hidden rounded-xl border border-[var(--axm-line-2)] bg-[rgba(10,6,24,0.85)] backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-[var(--axm-line)] px-4 py-2.5">
          <span className="axm-mono flex items-center gap-2 !text-[0.55rem]">
            <span className="axm-live-dot !h-1.5 !w-1.5" aria-hidden="true" />
            axis engine v2.1
          </span>
          <span className="axm-mono !text-[0.55rem] tabular-nums text-[var(--axm-accent)]">{pct}%</span>
        </div>
        <div className="min-h-[13.5rem] p-4 font-[family-name:var(--axm-mono)] text-[0.72rem] leading-relaxed text-[var(--axm-accent-soft)]">
          {rendered.map((l, i) => (
            <p key={i}>
              <span className="text-[var(--axm-faint)]">{"> "}</span>
              {l}
              {i === rendered.length - 1 && <span className="axm-blink">▊</span>}
            </p>
          ))}
        </div>
        <div className="h-1 w-full bg-[var(--axm-elevated)]">
          <motion.div
            className="h-full bg-[var(--axm-accent)]"
            animate={{ width: `${pct}%` }}
            transition={{ ease: "easeOut", duration: 0.3 }}
          />
        </div>
      </div>
      <button
        onClick={onDone}
        className="axm-mono mx-auto mt-4 block !text-[0.55rem] underline decoration-[var(--axm-line-2)] underline-offset-4 transition-colors hover:!text-[var(--axm-accent)]"
      >
        skip the boot sequence →
      </button>
    </div>
  );
}
