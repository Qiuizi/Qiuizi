"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type SpotlightCommand = {
  id: string;
  group: string;
  title: string;
  hint: string;
  keywords: string;
  pinned: boolean;
  run: () => void;
};

function norm(value: string) {
  return value.toLowerCase().replace(/\s+/g, "");
}

export function Spotlight({ commands, onClose }: { commands: SpotlightCommand[]; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const q = norm(query);
    if (!q) return commands.filter((command) => command.pinned);
    return commands.filter((command) => norm(`${command.title} ${command.hint} ${command.keywords} ${command.group}`).includes(q));
  }, [commands, query]);

  const index = results.length === 0 ? 0 : Math.min(active, results.length - 1);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const node = listRef.current?.querySelector<HTMLElement>(`[data-index="${index}"]`);
    node?.scrollIntoView({ block: "nearest" });
  }, [index, results]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActive((current) => (results.length === 0 ? 0 : (Math.min(current, results.length - 1) + 1) % results.length));
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setActive((current) => {
          if (results.length === 0) return 0;
          const safe = Math.min(current, results.length - 1);
          return (safe - 1 + results.length) % results.length;
        });
      } else if (event.key === "Enter") {
        event.preventDefault();
        results[index]?.run();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, results]);

  return (
    <div className="spot-root">
      <button type="button" className="spot-backdrop" aria-label="关闭搜索" onClick={onClose} />
      <div className="spot-panel" role="dialog" aria-modal="true" aria-label="Spotlight 搜索">
        <input
          ref={inputRef}
          className="spot-input"
          value={query}
          placeholder="搜索项目、演示、下载或操作"
          aria-label="搜索 Qiuizi OS"
          aria-controls="spotlight-list"
          aria-activedescendant={results[index] ? `spot-${results[index].id}` : undefined}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
          }}
        />
        <div ref={listRef} id="spotlight-list" className="spot-list" role="listbox">
          {results.length === 0 ? <p className="spot-empty">没有匹配的条目</p> : null}
          {results.map((command, itemIndex) => {
            const header = itemIndex === 0 || results[itemIndex - 1]?.group !== command.group ? command.group : null;
            return (
              <div key={command.id}>
                {header ? <p className="spot-group">{header}</p> : null}
                <button
                  id={`spot-${command.id}`}
                  type="button"
                  role="option"
                  aria-selected={itemIndex === index}
                  data-index={itemIndex}
                  className={`spot-item${itemIndex === index ? " is-on" : ""}`}
                  onMouseEnter={() => setActive(itemIndex)}
                  onClick={() => command.run()}
                >
                  <span>{command.title}</span>
                  <em>{command.hint}</em>
                </button>
              </div>
            );
          })}
        </div>
        <p className="spot-foot">方向键选择 · Enter 打开 · Esc 关闭</p>
      </div>
    </div>
  );
}
