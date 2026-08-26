import { createContext, useContext } from "react";

export const trainerContext = createContext({});

export function trainerProvider({ children }) {
  return (
    <trainerContext.Provider value={{}}>{children}</trainerContext.Provider>
  );
}

export function useTrainerContext() {
  return useContext(trainerContext);
}
