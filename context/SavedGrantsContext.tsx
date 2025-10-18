// context/SavedGrantsContext.tsx
import React, { createContext, useContext, useMemo, useState } from "react";

export type Grant = {
  id: number | string;
  agency: string;
  logo?: string;
  title: string;
  fundingAmount?: string | number;
  status?: string;
  applicationDueDate?: string;
  categories?: string[];
  website?: string;
};

type Ctx = {
  saved: Grant[];
  addGrant: (g: Grant) => void;
  removeGrant: (id: Grant["id"]) => void;
  clear: () => void;
};

const SavedGrantsContext = createContext<Ctx | undefined>(undefined);

export function SavedGrantsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [saved, setSaved] = useState<Grant[]>([]);

  const addGrant = (g: Grant) =>
    setSaved((prev) => (prev.find((x) => x.id === g.id) ? prev : [g, ...prev]));

  const removeGrant = (id: Grant["id"]) =>
    setSaved((prev) => prev.filter((g) => g.id !== id));

  const clear = () => setSaved([]);

  const value = useMemo(
    () => ({ saved, addGrant, removeGrant, clear }),
    [saved]
  );
  return (
    <SavedGrantsContext.Provider value={value}>
      {children}
    </SavedGrantsContext.Provider>
  );
}

export function useSavedGrants() {
  const ctx = useContext(SavedGrantsContext);
  if (!ctx)
    throw new Error("useSavedGrants must be used within SavedGrantsProvider");
  return ctx;
}
