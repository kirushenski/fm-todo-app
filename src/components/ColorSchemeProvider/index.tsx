import React, { useEffect, useState, useContext, createContext } from 'react'

interface ColorSchemeProviderProps {
  /** Content with access to color scheme */
  children: React.ReactNode
}

type ColorSchemeTypes = 'light' | 'dark'

const ColorSchemeContext = createContext<[ColorSchemeTypes, (value: ColorSchemeTypes) => void] | null>(null)

export const useColorScheme = () => {
  const context = useContext(ColorSchemeContext)

  if (!context) throw new Error('This component must be used within a <ColorSchemeProvider> component')

  return context
}

const ColorSchemeProvider = ({ children }: ColorSchemeProviderProps) => {
  const [colorScheme, setColorScheme] = useState<ColorSchemeTypes>('dark')

  useEffect(() => {
    const initialColorScheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    setColorScheme(initialColorScheme)
  }, [])

  const saveColorScheme = (newColorScheme: ColorSchemeTypes) => {
    window.localStorage.setItem('theme', newColorScheme)
    if (newColorScheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    setColorScheme(newColorScheme)
  }

  return <ColorSchemeContext.Provider value={[colorScheme, saveColorScheme]}>{children}</ColorSchemeContext.Provider>
}

export default ColorSchemeProvider
