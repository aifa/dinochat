"use client"

import {Suspense, useEffect} from 'react'
import {Flex} from '@radix-ui/themes'
import {useWeb3Modal, useWeb3ModalAccount, useWeb3ModalProvider} from '@web3modal/ethers/react'
import { BrowserProvider, Contract } from 'ethers';
import {  redirect, useParams } from 'next/navigation';
import router from 'next/router';
import toast from 'react-hot-toast';
import {Chat, ChatContext, ChatSideBar, Persona, ChatRole, useChatHook} from '@/components'
import Addresses from "@/components/addresses";
import {BuildWithGaladriel} from "@/components/buildwithgaladriel";
import Navbar from "@/components/navbar";
import { ABI } from '@/types/network';

const ChatProvider = async () => {
 
  const {open} = useWeb3Modal();
  const provider = useChatHook();
  const params = useParams<{ id: string }>();
  const nftId : string = params.id;


  const {isConnected} = useWeb3ModalAccount();
  const {walletProvider} = useWeb3ModalProvider();

  if (!walletProvider) {
    toast.error("Not connected")
    return
  }

  const ethersProvider = new BrowserProvider(walletProvider);
  const signer = await ethersProvider.getSigner()
  const contract = new Contract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "", ABI, signer);

  const nftData = await contract.tokenDataMap(nftId);
  console.log(nftData);
  if (nftData[2] == false) {
    //toast.error("Dino does not exist!");
    redirect('/');
  }
  const dino: Persona = {
    id: nftData[3],
    role: 'system', // Use the imported ChatRole enum
    name: nftData[3],  
    prompt: nftData[4],
    isDefault: true
  };

  return (
    <ChatContext.Provider value={provider}>
      {isConnected ?
        <Flex style={{height: 'calc(100% - 56px)', backgroundColor: "var(--background-color)"}} className="relative">
          <>
            <ChatSideBar persona={dino}/>
            <div className="flex-1 relative">
              <Chat ref={provider.chatRef}/>
            </div>
          </>
        </Flex>
        :
        <>
          <Navbar/>
          <main
            className="flex min-h-screen flex-col items-center gap-20 p-2 lg:p-12 justify-between z-2 relative bg-[#0657E0]">
            <div
              className={"flex flex-col gap-6 text-center text-xl"}
              style={{fontFamily: "PPMondwest-Regular"}}
            >
              <div className="text-7xl">
                <div>
                  On-chain ChatGPT built by Galadriel
                </div>
              </div>
              <div className="pt-[100px]">
                <button
                  onClick={() => open()}
                  // className={"p-4 bg-[#00FF66] text-3xl text-black hover:bg-[#00b548] duration-200 " + FONT.className}
                  className={"p-4 bg-[#00FF66] text-3xl text-black hover:bg-[#00b548] duration-200"}
                >
                  Connect wallet to Chat
                </button>
                <div className="pt-4 underline">
                  <a
                    href="https://docs.galadriel.com/setting-up-a-wallet"
                    target="_blank"
                  >
                    (Galadriel testnet)
                  </a>
                </div>
              </div>
            </div>
            <div
              className={"flex w-full flex-col lg:flex-row lg:justify-between items-end text-xl p-4 lg:p-0"}>
              <Addresses/>
              <BuildWithGaladriel/>
            </div>
          </main>
        </>
      }
    </ChatContext.Provider>
  )
}

const ChatPage = () => {
  return (
    <Suspense>
      <ChatProvider/>
    </Suspense>
  )
}

export default ChatPage
