"use client";

import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useTokenBoundAccount } from "~/hooks/use-token-bound-account";
import { api } from "~/trpc/react";
import { type SimpleHashResponseType } from "~/types/simple-hash";
import { StockfishVsStockfish } from "./chess-game";

export default function GamePage() {
  const { contractAddress, tokenId } = useParams();
  if (typeof contractAddress !== "string" || typeof tokenId !== "string") {
    throw new Error("missing required params");
  }
  const utils = api.useUtils();
  const { tokenboundAccount } = useTokenBoundAccount({
    contract_address: contractAddress,
    token_id: tokenId,
  });

  const [chainId, setChainId] = useState(1);
  const [opponentContractAddress, setOpponentContractAddress] = useState("");
  const [opponentTokenId, setOpponentTokenId] = useState("");
  const [opponentNFt, setOpponentNft] = useState<
    null | SimpleHashResponseType["nfts"][number]
  >(null);
  const [isLoading, setIsLoading] = useState(false);

  const onChooseOpponent = async () => {
    if (!opponentContractAddress || !opponentTokenId) {
      return;
    }
    setIsLoading(true);
    try {
      const nft = await utils.client.nft.getNftByToken.query({
        chainId: 1,
        contractAddress: opponentContractAddress,
        tokenId: opponentTokenId,
      });
      setOpponentNft(nft);
    } finally {
      setIsLoading(false);
    }
  };

  if (!opponentNFt) {
    return (
      <Modal
        isOpen={true}
        onClose={() => {
          // nothing
        }}
        closeOnEsc={false}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Choose your opponent</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Chain Id</FormLabel>
              <NumberInput
                defaultValue={1}
                precision={0}
                step={1}
                value={chainId}
                onChange={(valueString) => setChainId(parseInt(valueString))}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormHelperText>
                The chain Id of the NFT you want to compete against
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>Contract Address</FormLabel>
              <Input
                type="text"
                value={opponentContractAddress}
                onChange={(e) => {
                  setOpponentContractAddress(e.target.value);
                }}
              />
              <FormHelperText>
                The contract address of the NFT you want to compete against
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>Token Id</FormLabel>
              <Input
                type="text"
                value={opponentTokenId}
                onChange={(e) => {
                  setOpponentTokenId(e.target.value);
                }}
              />
              <FormHelperText>
                The token ID of the specific NFT you want to compete against
              </FormHelperText>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="ghost"
              disabled={!opponentContractAddress || !opponentTokenId}
              onClick={onChooseOpponent}
              isLoading={isLoading}
            >
              Select
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }

  return <StockfishVsStockfish playerColor="black" opponentNft={opponentNFt} />;
}
