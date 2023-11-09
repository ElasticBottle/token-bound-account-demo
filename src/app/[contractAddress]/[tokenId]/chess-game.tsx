"use client";

import {
  Box,
  Button,
  Center,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  useDisclosure,
} from "@chakra-ui/react";
import { Chess } from "chess.js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Chessboard } from "react-chessboard";
import { type CustomPieces } from "react-chessboard/dist/chessboard/types";
import { useTokenBoundAccount } from "~/hooks/use-token-bound-account";
import { api } from "~/trpc/react";
import { type SimpleHashResponseType } from "~/types/simple-hash";
import { ChessEngine } from "./chess-engine";

const pieces = [
  "wP",
  "wN",
  "wB",
  "wR",
  "wQ",
  "wK",
  "bP",
  "bN",
  "bB",
  "bR",
  "bQ",
  "bK",
] as const;

export const StockfishVsStockfish = ({
  playerColor,
  opponentNft,
}: {
  playerColor: "white" | "black";
  opponentNft: SimpleHashResponseType["nfts"][number];
}) => {
  const engine = useMemo(() => new ChessEngine(), []);
  const game = useMemo(() => new Chess(), []);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentPlayer, setCurrentPlayer] = useState<"white" | "black">(
    "white",
  );
  const [gameState, setGameState] = useState<"playing" | "draw" | "end">(
    "playing",
  );
  const [chessBoardPosition, setChessBoardPosition] = useState(game.fen());

  const modalHeaderText =
    gameState === "draw"
      ? "Draw"
      : currentPlayer === playerColor
      ? "You Lost"
      : "You Won";

  let modalBody = `You drew against ${
    opponentNft.name ?? `${opponentNft.contract.name} ${opponentNft.token_id}}`
  }`;
  if (modalHeaderText === "You Won") {
    modalBody = `You won against ${
      opponentNft.name ?? `${opponentNft.contract.name} ${opponentNft.token_id}`
    }`;
  } else if (modalHeaderText === "You Lost") {
    modalBody = `You lost against ${
      opponentNft.name ?? `${opponentNft.contract.name} ${opponentNft.token_id}`
    }`;
  }
  const { tokenboundAccount } = useTokenBoundAccount({
    contract_address: opponentNft.contract_address,
    token_id: opponentNft.token_id,
  });

  const { data, isLoading } = api.nft.getUserNft.useQuery(
    {
      address: tokenboundAccount,
      chainId: 1,
    },
    {
      enabled: tokenboundAccount !== "0x",
    },
  );

  const customPieces = useMemo((): CustomPieces => {
    const pieceComponents: CustomPieces = {};
    pieces.forEach((piece) => {
      pieceComponents[piece] = ({ squareWidth }) => (
        <div
          style={{
            width: squareWidth,
            height: squareWidth,
            backgroundImage: `url(/${piece}.png)`,
            backgroundSize: "100%",
          }}
        />
      );
    });
    return pieceComponents;
  }, []);

  const findBestMove = useCallback(() => {
    engine.evaluatePosition(game.fen(), Math.ceil(Math.random() * 10));
    engine.onMessage(({ bestMove }) => {
      if (bestMove) {
        try {
          game.move({
            from: bestMove.substring(0, 2),
            to: bestMove.substring(2, 4),
            promotion: bestMove.substring(4, 5),
          });
          setChessBoardPosition(game.fen());
          setCurrentPlayer((prevPlayer) =>
            prevPlayer === "white" ? "black" : "white",
          );
        } catch (e) {
          // do nothing
        }
      }
    });
  }, [engine, game]);

  useEffect(() => {
    if (game.isThreefoldRepetition()) {
      setGameState("draw");
      onOpen();
      return;
    }
    if (!game.isGameOver() || game.isDraw()) {
      setTimeout(findBestMove, 100);
    } else {
      setGameState("end");
      onOpen();
    }
  }, [chessBoardPosition, findBestMove, game, onOpen]);

  if (isLoading) {
    return (
      <Center minH="100vh">
        <Skeleton w="full" h="80vh" />
      </Center>
    );
  }

  return (
    <>
      <Flex alignItems={"center"} justifyContent={"center"} minH="100vh">
        <Box>
          <Chessboard
            position={chessBoardPosition}
            animationDuration={100}
            boardOrientation="black"
            boardWidth={800}
            customPieces={customPieces}
          />
        </Box>
      </Flex>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        closeOnEsc={false}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{modalHeaderText}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{modalBody}</ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Okay
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
