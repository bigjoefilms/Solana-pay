import { createQR, encodeURL, TransferRequestURLFields } from "@solana/pay";
import { Keypair, PublicKey } from "@solana/web3.js";
import BigNumber from "bignumber.js";
import { FC, useEffect, useRef,useState } from "react";

type TransferRequestQRProps = {
  reference: PublicKey,
  amount:any
  walletAddress:any
};

export const TransferRequestQR: FC<TransferRequestQRProps> = ({ reference ,amount, walletAddress}) => {
  const qrRef = useRef<HTMLDivElement>(null);
 

  useEffect(() => {
    // Create a transfer request QR code
    const urlParams: TransferRequestURLFields = {
      recipient : new PublicKey(walletAddress),
      amount: new BigNumber(amount), // amount in SOL
      reference,
      label: 'Solana.Finance',
      message: 'Thank you for your purchase!',
    };
    const solanaUrl = encodeURL(urlParams);
    const qr = createQR(solanaUrl, 300, 'transparent')
    qr.update({ backgroundOptions: { round: 1000 } });
    if (qrRef.current) {
      qrRef.current.innerHTML = ''
      qr.append(qrRef.current)
    }
  }, [amount,reference]);


  return (
    <div className="rounded-2xl ">
         
      <div ref={qrRef} className="xl" />
    </div>
  )
}