/* eslint-disable react-hooks/exhaustive-deps */
import Head from "next/head";
import { useEffect, useState } from "react";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import useCandyMachine from "../hooks/useCandyMachine";
import useWalletBalance from "../hooks/useWalletBalance";
import { useWallet } from "@solana/wallet-adapter-react";

import { Toaster } from "react-hot-toast";
import Countdown from "react-countdown";
import useWalletNfts from "../hooks/useWalletNFTs";
import AnNFT from "../components/AnNFT/AnNFT";
import InputRange from 'react-input-range';


export default function Home() {
  const [balance] = useWalletBalance();
  const {
    isSoldOut,
    mintStartDate,
    isMinting,
    startMint,
    startMintMultiple,
    nftsData,
  } = useCandyMachine();

  const [isLoading, nfts] = useWalletNfts();

  const { connected } = useWallet();

  const [isMintLive, setIsMintLive] = useState(false);

  useEffect(() => {
    if (new Date(mintStartDate).getTime() < Date.now()) {
      setIsMintLive(true);
    }
  }, []);

  const MintMany = () => {
    const [mintCount, setMintCount] = useState(1);

    const myMin = 1
    const myMax = 10

    return (
      <>

        <button
          onClick={() => mintCount > myMin ? setMintCount(mintCount - 1) : setMintCount(mintCount)}
          disabled={isMinting}
          className="stepperButton"
        >-</button>
        <button
          onClick={() => startMintMultiple(mintCount)}
          disabled={isMinting}
          className="startMintButton"
        >
          {isMinting ? "loading" : `mint ${mintCount}`}
        </button>
        <button
          onClick={() => mintCount < myMax ? setMintCount(mintCount + 1) : setMintCount(mintCount)}
          disabled={isMinting}
          className="stepperButton"
        >+</button>
      </>
    );
  };


  return (
    <>
      <Head>
        <title>Time Variants</title>
        <meta
          name="description"
          content="Simplified NextJs with typescript example app integrated with Metaplex's Candy Machine"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>


      <div className="background-image">
        <Toaster />
        <div className="navBar">
          <div className="nftHeading tab">
            <p>Remaining {nftsData.itemsRemaining}</p>
          </div>
          <p className="mr-auto text-sm">
            <span className="font-bold">Available/Minted/Total:</span>{" "}
            {nftsData.itemsRemaining}/{nftsData.itemsRedeemed}/
            {nftsData.itemsAvailable}
          </p>
          {connected && (
            <div className="solBalance">
              <p>Balance: {balance.toFixed(2)} SOL</p>
              <p></p>
            </div>
          )}
          <WalletMultiButton />
        </div>

        <div className="mint-container">
          <img src="/imgs/main_image.png" alt="logo" />
          {connected ? (
            <>
              {new Date(mintStartDate).getTime() < Date.now() ? (
                <>
                  {isSoldOut ? (
                  <div className="soldOut">
                    <p>SOLD OUT</p>
                  </div>
                  ) : (
                    <div>
                                <div className="tipsFont">
                        <p>Tips:</p>
                        <p className="tab">1. Use the - and + signs to adjust how many Time Variants you want to mint</p>
                        <p className="tab">2. Once you click approve and see "loading", refresh the page to mint again.  Network issues may cause it to get stuck, refreshing will resolve this issue.</p>
                      </div>
                      <div className="mintButton">
                        <MintMany />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <Countdown
                  date={mintStartDate}
                  onMount={({ completed }) => completed && setIsMintLive(true)}
                  onComplete={() => setIsMintLive(true)}
                  className="connectWalletPrompt specialFont"
                />
              )}
            </>
          ) : (
            <div className="connectWalletPrompt specialFont">
              <p>connect wallet to mint</p>
            </div>
          )}
        </div>


        {connected && (
        <div className="nftContainer">
          <div className="nftHeading">
            <p>My Time Variants</p>
          </div>
          <div className="nftDisplayWrapper">
            {(nfts as any).map((nft: any, i: number) => {
              return <AnNFT key={i} nft={nft} />;
            })}
          </div>
        </div>
        )}
      </div>
        
    </>
  );
}
