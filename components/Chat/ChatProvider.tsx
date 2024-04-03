import { useEffect } from "react";
import { Flex } from "@radix-ui/themes";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { BrowserProvider, Contract } from "ethers";
import { getMetadataFromIPFS } from "@/providers/ipfs-fetch";
import { ABI } from "@/types/network";
import { NFTMetadata } from "@/types/nftMeta";
import { Chat, ChatContext, ChatSideBar, Persona, useChatHook } from ".";
import Navbar from "../navbar";

export const getDino = async (ethersProvider: BrowserProvider, nftId: string): Promise<Persona> => {

    const signer = await ethersProvider.getSigner()
    const contract = new Contract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "", ABI, signer);
    const tokenData = await contract.getTokenData(nftId);
    const ipfsHash: string = tokenData.metadata_url;
    const nftMetadata: NFTMetadata = await getMetadataFromIPFS(ipfsHash);

    if (nftMetadata == null) {
        console.error("Error getting metadata from ipfs");
        return {
            id: nftId,
            role: 'system', // Use the imported ChatRole enum
            name: 'Dino',
            prompt: 'You are an AI assistant that helps people find information.',
            description: 'You are an AI assistant that helps people find information.',
            isDefault: true
        };
    }
    const dino: Persona = {
        id: nftId,
        role: 'system', // Use the imported ChatRole enum
        name: nftMetadata.name,
        prompt: nftMetadata.sysprompt,
        description: nftMetadata.description,
        avatar_url: tokenData.image_url,
        isDefault: true
    };

    return dino;
}

const ChatProvider = (dino: { persona: Persona | undefined }) => {
    let provider = useChatHook();
    const { isConnected } = useWeb3ModalAccount();

    useEffect(() => {
        if (dino.persona === undefined) {
            return;
        }
        provider.setPersonas([dino.persona]);

        //if (provider.chatList.length === 0) {
        provider.onCreateChat(dino.persona);
        //}

    }, [dino.persona])
    return (
        <ChatContext.Provider value={provider}>
            {isConnected ?
                <Flex style={{ height: 'calc(100% - 56px)', backgroundColor: "var(--accent-2)" }} className="relative">
                    <ChatSideBar persona={provider.personas[0]} />
                    <div className="flex-1 relative">
                        <Chat ref={provider.chatRef} />
                    </div>
                </Flex>
                :
                <div>
                    <Navbar />
                </div>
            }
        </ChatContext.Provider>
    )
};

export default ChatProvider;
