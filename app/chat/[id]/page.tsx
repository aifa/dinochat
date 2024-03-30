"use client"

import { Suspense } from 'react';
import { useWeb3Modal, useWeb3ModalProvider } from "@web3modal/ethers/react";
import { BrowserProvider } from 'ethers';
import { useParams } from 'next/navigation';
import ChatProvider from '@/components/Chat/ChatProvider';




// eslint-disable-next-line @next/next/no-async-client-component
const ChatPage = () => {
  const params = useParams<{ id: string }>();
  const nftId: string = params.id;

  const { walletProvider } = useWeb3ModalProvider();
  const { open } = useWeb3Modal();


  if (!walletProvider) {
    open();
    return;
  }
  const ethersProvider = new BrowserProvider(walletProvider);

  return (
    <Suspense>
      <ChatProvider etherProvider={ethersProvider} nftId={nftId} />
    </Suspense>
  )
}

export default ChatPage