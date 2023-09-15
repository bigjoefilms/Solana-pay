import { PublicKey,Connection } from "@solana/web3.js";
import { useEffect, useRef } from "react";
import { findReference, FindReferenceError } from "@solana/pay";
// import { useConnection } from "@solana/wallet-adapter-react";

// import { notify } from "../utilis/notification";


export default function useTransactionListener(reference: PublicKey) {
  const endpoint = 'https://nameless-methodical-patron.solana-devnet.discover.quiknode.pro/f9200a91b38605ab87e2fe0d82a8ffc1863464bd/';
  // const endpoint = clusterApiUrl('https://nameless-methodical-patron.solana-devnet.discover.quiknode.pro/f9200a91b38605ab87e2fe0d82a8ffc1863464bd/');
  const connection = new Connection(endpoint);
  

  const mostRecentNotifiedTransaction = useRef<string | undefined>(undefined);
  

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        // Check if there is any transaction for the reference
        //
        console.log(reference)
        const signatureInfo = await findReference(connection, reference, { until: mostRecentNotifiedTransaction.current });
        console.log(connection)
       
        console.log(mostRecentNotifiedTransaction)

       
        // notify({ type: 'success', message: 'Transaction confirmed', txid: signatureInfo.signature });
        mostRecentNotifiedTransaction.current = signatureInfo.signature;
        console.log('Transaction confirmed', signatureInfo);
      } catch (e) {
        if (e instanceof FindReferenceError) {
          // No transaction found yet, ignore this error
          return;
        }
        console.error('Unknown error', e)
      }
    }, 500)
    return () => {
      clearInterval(interval)
    }
  }, [connection, reference])
}