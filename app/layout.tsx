import { IBM_Plex_Mono } from 'next/font/google'
import { Header } from '@/components/Header'
import '@/styles/globals.scss'
import '@/styles/theme-config.css'


import { EthersWeb3Modal } from '@/context/ethersWeb3Modal'
import ThemesProvider from '@/providers/ThemesProvider'


export const metadata = {
  title: {
    default: 'DinoAI Chat',
    template: `%s - Chat`
  },
  description: 'DinoAI assistants powered by ChatGPT on Galadriel testnet',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png'
  }
}

// const inter = Inter({subsets: ['latin'], variable: '--font-inter'})
const plexmono = IBM_Plex_Mono(
  { weight: "400", subsets: ["latin"] },
);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={plexmono.className}>
        <ThemesProvider>
          <Header />
          <EthersWeb3Modal>{children}</EthersWeb3Modal>
        </ThemesProvider>
      </body>
    </html>
  )
};
