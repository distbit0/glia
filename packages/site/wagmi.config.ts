
import { http, createConfig } from "wagmi";
import { arbitrum } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";

export const config = createConfig({
    chains: [arbitrum],
    connectors: [
        metaMask({
            dappMetadata: {
                name: 'Glia'
            },
            extensionOnly: true
        }),
    ],
    transports: {
        [arbitrum.id]: http(),
    },
});
