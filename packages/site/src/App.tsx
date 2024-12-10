
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { QuestionForm } from "./components/QuestionForm";
import { QuestionList } from "./components/QuestionList";
import { useEffect, useState } from 'react';
import { arbitrum } from "wagmi/chains";
import './App.css';

export default function Home() {
    const { isConnected, chain } = useAccount();
    const { connectors, connect } = useConnect();
    const { disconnect } = useDisconnect();
    const { switchChain } = useSwitchChain();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const initializeConnector = async () => {
            const connector = connectors[0]; // MetaMask connector
            if (connector) {
                const provider = await connector.getProvider();
                setReady(!!provider);
            }
        };
        initializeConnector();
    }, [connectors]);

    useEffect(() => {
        if (isConnected && chain?.id !== arbitrum.id) {
            switchChain({ chainId: arbitrum.id });
        }
    }, [isConnected, chain?.id, switchChain]);

    return (
        <main className="min-h-screen">
            <div className="app-container">
                <div className="header">
                    <h1 className="text-3xl font-bold">Glia Info Markets</h1>
                    <button
                        disabled={!ready}
                        onClick={() => {
                            if (isConnected) {
                                disconnect();
                            } else {
                                connect({ connector: connectors[0] });
                            }
                        }}
                        className="disabled:opacity-50"
                    >
                        {!ready ? 'Loading...' : isConnected ? 'Disconnect Wallet' : 'Connect Wallet'}
                    </button>
                </div>

                {isConnected ? (
                    <div className="space-y-8">
                        <QuestionForm />
                        <QuestionList />
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-xl">Please connect your wallet to participate</p>
                    </div>
                )}
            </div>
        </main>
    );
}
