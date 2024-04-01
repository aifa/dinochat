import { useEffect } from "react";
import { Flex } from "@radix-ui/themes";
import { useWeb3Modal, useWeb3ModalAccount } from "@web3modal/ethers/react";
import { BrowserProvider, Contract } from "ethers";
import { getMetadataFromIPFS } from "@/providers/ipfs-fetch";
import { ABI } from "@/types/network";
import { NFTMetadata } from "@/types/nftMeta";
import { Chat, ChatContext, ChatSideBar, Persona, useChatHook } from ".";
import Navbar from "../navbar";

export const getDino = async (ethersProvider: BrowserProvider, nftId: string): Promise<Persona> => {

    const signer = await ethersProvider.getSigner()
    const contract = new Contract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "", ABI, signer);
    const tokeData = await contract.getTokenData(nftId);
    const ipfsHash: string = tokeData.metadata_url;
    const nftMetadata: NFTMetadata = await getMetadataFromIPFS(ipfsHash);

    if (nftMetadata == null) {
        console.error("Error getting metadata from ipfs");
        return {
            id: nftId,
            role: 'system', // Use the imported ChatRole enum
            name: 'Dino',
            prompt: 'You are an AI assistant that helps people find information.',
            avatar: 'https://cdn.pixabay.com/photo/2016/08/31/11/54/user-1633249_960_720.png',
            isDefault: true
        };
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

const ChatProvider = (dino: { persona: Persona | undefined }) => {
    let provider = useChatHook();
    const { isConnected } = useWeb3ModalAccount();
    const { open } = useWeb3Modal();

    useEffect(() => {
        if (dino.persona === undefined) {
            return;
        }
        provider.setPersonas([dino.persona]);
        if (provider.chatList.length === 0) {
            provider.onCreateChat(dino.persona);
        }

    }, [dino.persona])
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
                    </div>
                </div>
            }
        </ChatContext.Provider>
    )
};

export default ChatProvider;
