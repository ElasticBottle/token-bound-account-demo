"use client";

import { Center, Heading, Stack } from "@chakra-ui/react";
import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";
import { AccountSelection } from "./_components/account-selection";

export default function Home() {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <Center minH="100vh">
        <Stack spacing={5} alignItems={"center"}>
          <Heading>The TBA Game</Heading>
          <ConnectKitButton />
        </Stack>
      </Center>
    );
  }

  return <AccountSelection />;
}
