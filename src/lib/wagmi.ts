import { getDefaultConfig } from "connectkit";
import { createConfig, mainnet } from "wagmi";
import {
  base,
  baseGoerli,
  goerli,
  linea,
  lineaTestnet,
  optimism,
  optimismGoerli,
  polygon,
  polygonMumbai,
} from "wagmi/chains";
import { env } from "~/env.mjs";

const chains = [
  polygonMumbai,
  goerli,
  optimismGoerli,
  baseGoerli,
  lineaTestnet,
  polygon,
  mainnet,
  optimism,
  base,
  linea,
];

export const wagmiConfig = createConfig(
  getDefaultConfig({
    walletConnectProjectId: env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    chains,
    appName: "Token bound demo game",
    appDescription: "Token bound demo game",
  }),
);
