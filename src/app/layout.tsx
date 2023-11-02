import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { headers } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";
import { ChakraProviderClient } from "./_components/chakra";
import { ConnectKitProviderClient } from "./_components/connectkit";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "TBA demo",
  description: "Demo token bound account game",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <ChakraProviderClient>
          <ConnectKitProviderClient>
            <TRPCReactProvider headers={headers()}>
              {children}
            </TRPCReactProvider>
          </ConnectKitProviderClient>
        </ChakraProviderClient>
      </body>
    </html>
  );
}
