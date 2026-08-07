import { createContext, useState, useContext } from 'react';

// 1. Export the raw Context object
export const trainerContext = createContext(null);

// 2. Export the Provider Component
export function trainerProvider({ children }) {
  

  

  // Combine values to pass down
  const value = {
    
  };

  // React 19 syntax: Use <AppContext value={value}> directly
  return (
    <AppContext value={value}>
      {children}
    </AppContext>
  );
}

// 3. Export the Custom Hook for consumption
export function trainerContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}




