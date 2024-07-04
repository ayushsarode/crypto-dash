import { createContext, ReactNode } from "react";

export const CoinContext = createContext({});

interface CoinContextProviderProps {
    children: ReactNode;  // Define children prop explicitly
}

const CoinContextProvider = (props: CoinContextProviderProps) => {
    const contextValue = {}

    return (
        <CoinContext.Provider value={contextValue}>
            {props.children} 
        </CoinContext.Provider>
    );
};

export default CoinContextProvider;
