import React, { createContext, useContext, ReactNode } from 'react'

interface AppContextType {
  // Placeholder pour compatibilité - remplacé par Zustand
}

const AppContext = createContext<AppContextType>({})

export const useAppContextLegacy = () => useContext(AppContext)

interface AppProviderProps {
  children: ReactNode
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <AppContext.Provider value={{}}>
      {children}
    </AppContext.Provider>
  )
}
