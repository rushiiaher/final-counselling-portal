"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

/* Lets a page set the shell's top bar (design: desk-shell.jsx → Topbar title / sub / right). */
export type PageHeaderValue = { title?: string; sub?: string; right?: React.ReactNode } | null;

const Ctx = createContext<{ header: PageHeaderValue; setHeader: (h: PageHeaderValue) => void }>({
  header: null,
  setHeader: () => {},
});

export function PageHeaderProvider({ children }: { children: React.ReactNode }) {
  const [header, setHeader] = useState<PageHeaderValue>(null);
  return <Ctx.Provider value={{ header, setHeader }}>{children}</Ctx.Provider>;
}

export function usePageHeader() {
  return useContext(Ctx).header;
}

/** Render inside a page to replace the top bar's title / subtitle / right-hand controls. */
export function DeskTopbar({ title, sub, right }: { title?: string; sub?: string; right?: React.ReactNode }) {
  const { setHeader } = useContext(Ctx);
  useEffect(() => {
    setHeader({ title, sub, right });
  }, [title, sub, right, setHeader]);
  useEffect(() => () => setHeader(null), [setHeader]);
  return null;
}
