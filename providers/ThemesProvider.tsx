import React, { PropsWithChildren } from 'react'
import { Theme, ThemePanel } from '@radix-ui/themes'
import { ThemeProvider } from '@/components/Themes'

export const ThemesProvider = ({ children }: PropsWithChildren) => {
  return (
    <ThemeProvider forcedTheme={"light"}>
      <Theme appearance="light" accentColor="jade" style={{ height: '100%' }} className="h-full">
        {children}
        {/** <ThemePanel />*/}
      </Theme>
    </ThemeProvider>
  )
}

export default ThemesProvider
