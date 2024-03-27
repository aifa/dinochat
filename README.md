# ChatGPT Lite

chat forked from [chatgpt-lite](https://github.com/galadriel-ai/chatgpt-lite)

This is a chat app used by DinoAI

## Development

### Running Locally

1. Install NodeJS 18.
2. Clone the repository.
3. Install dependencies with `npm install`.
4. Copy `.env.example` to `.env.local` and update environment variables.  
   Edit .env.local
   `NEXT_PUBLIC_NETWORK` "local" defaults to `http://localhost:8545/`  
   and anything else uses `https://testnet.galadriel.com/` as the RPC url  
   The default contract address is Galadriel testnet contract address
5. Start the application using `npm run dev`.
6. Visit `http://localhost:3001` in your browser.
