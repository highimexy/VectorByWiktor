import { createContext, useContext, useState } from "react";

type OpenPanel = "project" | "scene" | null;

interface PanelContextValue {
  openPanel: OpenPanel;
  setOpenPanel: (panel: OpenPanel) => void;
}

const PanelContext = createContext<PanelContextValue | null>(null);

export function PanelProvider({ children }: { children: React.ReactNode }) {
  const [openPanel, setOpenPanel] = useState<OpenPanel>(null);
  return (
    <PanelContext.Provider value={{ openPanel, setOpenPanel }}>
      {children}
    </PanelContext.Provider>
  );
}

export function usePanelContext() {
  const ctx = useContext(PanelContext);
  if (!ctx) throw new Error("usePanelContext must be used within PanelProvider");
  return ctx;
}
