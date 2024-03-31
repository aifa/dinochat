"use client";
import { useEffect } from "react";
import { Flex } from "@radix-ui/themes";
import { useWeb3Modal, useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers/react";
import { BrowserProvider, Contract, Eip1193Provider } from "ethers";
import { redirect, useParams } from "next/dist/client/components/navigation";
import { getMetadataFromIPFS } from "@/providers/ipfs-fetch";
import { ABI } from "@/types/network";
import { NFTMetadata } from "@/types/nftMeta";
import { Chat, ChatContext, ChatSideBar, Persona, useChatHook } from ".";
import Addresses from "../addresses";
import { BuildWithGaladriel } from "../buildwithgaladriel";
import Navbar from "../navbar";

export const getDino = async (walletProvider: Eip1193Provider, nftId: string): Promise<Persona | undefined> => {
    if (walletProvider === undefined) {
        return undefined;
    }
    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner()
    const contract = new Contract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "", ABI, signer);

    const tokeData = await contract.getTokenData(nftId);
    const ipfsUrl: string = tokeData.metadata_url;
    const ipfsHash = ipfsUrl.replace("https://ipfs.io/ipfs/", "");
    const nftMetadata: NFTMetadata = await getMetadataFromIPFS(ipfsHash);

    if (nftMetadata === undefined) {
        toast.error("Dino does not exist!");
        return undefined;
    }
    const dino: Persona = {
        id: nftId,
        role: 'system', // Use the imported ChatRole enum
        name: nftMetadata.name,
        prompt: nftMetadata.sysprompt,
        avatar: nftMetadata.description,
        isDefault: true
    };

    return dino;
}

const ChatProvider = () => {
    const params = useParams<{ id: string }>();
    const nftId: string = params.id;
    const provider = useChatHook()
    const { open } = useWeb3Modal()
    const { isConnected } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();
    useEffect(() => {
        async function fetchPersonas() {
            if (!isConnected || walletProvider === undefined) {
                return;
            }
            const dino = await getDino(walletProvider, nftId);
            if (dino !== undefined) {
                provider.setPersonas([dino]);
                if (provider.chatList.length == 0)
                    provider.onCreateChat(dino);
            }
        }
        fetchPersonas();
    }, [walletProvider]);

    return (
        <ChatContext.Provider value={provider}>
            {isConnected ?
                <Flex style={{ height: 'calc(100% - 56px)', backgroundColor: "var(--background-color)" }} className="relative">
                    <ChatSideBar persona={provider.personas[0]} />
                    <div className="flex-1 relative">
                        <Chat ref={provider.chatRef} />
                    </div>
                </Flex>
                :
                <div>
                    <Navbar />
                    <div
                        className="flex min-h-screen flex-col items-center gap-20 p-2 lg:p-12 justify-between z-2 relative bg-[#0657E0]">
                        <div
                            className={"flex flex-col gap-6 text-center text-xl"}
                            style={{ fontFamily: "PPMondwest-Regular" }}
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
                        </div>
                    </div>
                </div>
            }
        </ChatContext.Provider>
    )
};

export default ChatProvider;
