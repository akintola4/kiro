"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Ghost } from "lucide-react";

interface WorkspaceSwitchContextType {
  isSwitching: boolean;
  setIsSwitching: (value: boolean) => void;
}

const WorkspaceSwitchContext = createContext<WorkspaceSwitchContextType>({
  isSwitching: false,
  setIsSwitching: () => {},
});

export function useWorkspaceSwitch() {
  return useContext(WorkspaceSwitchContext);
}

export function WorkspaceSwitchProvider({ children }: { children: ReactNode }) {
  const [isSwitching, setIsSwitching] = useState(false);

  return (
    <WorkspaceSwitchContext.Provider value={{ isSwitching, setIsSwitching }}>
      {children}
      {isSwitching && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Ghost className="w-16 h-16 text-primary animate-bounce" />
            <p className="text-lg font-semibold">Switching workspace...</p>
            <p className="text-sm text-muted-foreground">Just a moment</p>
          </div>
        </div>
      )}
    </WorkspaceSwitchContext.Provider>
  );
}
