"use client";
import { Suspense, useEffect, useState } from 'react';
import { useWeb3Modal, useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers/react";
import { BrowserProvider } from 'ethers';
import { useParams } from 'next/navigation';
import ChatProvider, { getDino } from '@/components/Chat/ChatProvider';
import { Persona } from '@/components/Chat/interface';

const ChatPage = () => {
  const params = useParams<{ id: string }>();
  const nftId: string = params.id;

  const { isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const { open } = useWeb3Modal();

  const [dino, setDino] = useState<Persona>();

  useEffect(() => {
    if (!isConnected || !walletProvider) {
      open();
      return;
    }
    const ethersProvider = new BrowserProvider(walletProvider);
    (async () => {
      setDino(await getDino(ethersProvider, nftId));
    })().catch(console.error);;

    return () => {
      // this now gets called when the component unmounts
    };
  }, [isConnected, walletProvider, nftId]);

  if (!isConnected || !walletProvider) {
    open();
    return;
  }

  return (
    <Suspense>
      <ChatProvider persona={dino} />
    </Suspense>
  )
}

export default ChatPage