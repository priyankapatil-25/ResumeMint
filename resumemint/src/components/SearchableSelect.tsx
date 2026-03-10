"use client";

import { useState, useRef, useEffect } from "react";
import { FiSearch, FiChevronDown } from "react-icons/fi";

interface SearchableSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
}

export default function SearchableSelect({ value, onChange, options, placeholder = "Select..." }: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = options.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => { setOpen(!open); setSearch(""); }}
        className="input-field"
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          textAlign: "left",
          color: value ? "var(--text-primary)" : "var(--text-muted)",
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {value || placeholder}
        </span>
        <FiChevronDown size={16} style={{ flexShrink: 0, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0)" }} />
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: 4,
            background: "#fff",
            border: "1px solid var(--border)",
            borderRadius: 12,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            zIndex: 50,
            maxHeight: 260,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ padding: "8px 10px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
            <FiSearch size={14} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search branch..."
              style={{
                border: "none",
                outline: "none",
                width: "100%",
                fontSize: 13,
                color: "var(--text-primary)",
                background: "transparent",
              }}
            />
          </div>
          <div style={{ overflowY: "auto", maxHeight: 210 }}>
            {filtered.length === 0 ? (
              <div style={{ padding: "12px 14px", fontSize: 13, color: "var(--text-muted)", textAlign: "center" }}>
                No branches found
              </div>
            ) : (
              filtered.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => { onChange(opt); setOpen(false); setSearch(""); }}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "10px 14px",
                    fontSize: 13,
                    textAlign: "left",
                    border: "none",
                    cursor: "pointer",
                    background: opt === value ? "var(--surface-light)" : "transparent",
                    color: opt === value ? "#1A3A5C" : "var(--text-primary)",
                    fontWeight: opt === value ? 600 : 400,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--surface-light)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = opt === value ? "var(--surface-light)" : "transparent"; }}
                >
                  {opt}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
