"use client";

import { Suspense, useEffect, useState } from 'react';
import { useWeb3Modal, useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers/react";
import ChatProvider from '@/components/Chat/ChatProvider';


const ChatPage = () => {
  const { isConnected } = useWeb3ModalAccount()
  const { open } = useWeb3Modal();

  return (
    <>
      {isConnected ?
        <ChatProvider />
        : <button
          onClick={() => open()}
          // className={"p-4 bg-[#00FF66] text-3xl text-black hover:bg-[#00b548] duration-200 " + FONT.className}
          className={"p-4 bg-[#00FF66] text-3xl text-black hover:bg-[#00b548] duration-200"}
        >
          Connect wallet to Chat
        </button>
      }

    </>
  );
} // Add this closing curly brace

export default ChatPage;