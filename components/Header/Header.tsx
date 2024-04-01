'use client'

import React, { useCallback, useState } from 'react'
import { HamburgerMenuIcon } from '@radix-ui/react-icons'
import { Avatar, Flex, Heading, IconButton, Tooltip } from '@radix-ui/themes'
import { useWeb3ModalAccount } from '@web3modal/ethers/react'
import cs from 'classnames'
import Link from "next/link";
import NextLink from 'next/link'
import { FaGithub } from 'react-icons/fa'
import { useTheme } from '../Themes'

export const Header = () => {
  const { isConnected } = useWeb3ModalAccount()

  const { theme, setTheme } = useTheme()
  const [, setShow] = useState(false)

  const toggleNavBar = useCallback(() => {
    setShow((state) => !state)
  }, [])

  if (!isConnected) {
    return <></>
  }
  return (
    <header
      className={cs('block shadow-sm sticky top-0 dark:shadow-gray-500 py-3 px-4 z-20')}
      style={{ backgroundColor: 'var(--background-color)' }}
    >
      <Flex align="center" gap="3">
        <NextLink href="/">
          <Heading as="h2" size="9" style={{ maxWidth: 1200, fontFamily: "PPNeueBit-Bold" }}>
            DinoAI
          </Heading>
        </NextLink>
        <Flex align="center" gap="3" className="ml-auto">
          <Link href="https://discord.gg/4UuffUbkjb" target="_blank"
            className="px-3 py-2 rounded-md font-medium hover:underline hidden lg:inline">Galadriel discord / faucet</Link>
          <w3m-account-button />
        </Flex>
        <Tooltip content="Navigation">
          <IconButton
            size="3"
            variant="ghost"
            color="gray"
            className="md:hidden"
            onClick={toggleNavBar}
          >
            <HamburgerMenuIcon width="16" height="16" />
          </IconButton>
        </Tooltip>
      </Flex>
    </header>
  )
}
