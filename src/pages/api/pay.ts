import { NextApiRequest, NextApiResponse } from 'next';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { encodeURL, findReference, validateTransfer } from '@solana/pay';
import BigNumber from 'bignumber.js';

// CONSTANTS

const amount = new BigNumber(0.0201); // 0.0001 SOL
const label = 'Nobi.pay';
const memo = 'Cornfirm your transaction and Pay ';
const quicknodeEndpoint = 'https://nameless-methodical-patron.solana-devnet.discover.quiknode.pro/f9200a91b38605ab87e2fe0d82a8ffc1863464bd/'; 

const paymentRequests = new Map<string, { recipient: PublicKey; amount: BigNumber; memo: string }>();

async function generateUrl(
    recipient: PublicKey,
    amount: BigNumber,
    reference: PublicKey,
    label: string,
    message: string,
    memo: string,
  ) {
    const url: URL = encodeURL({
      recipient,
      amount,
      reference,
      label,
      message,
      memo,
    });
    return { url };
  }
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle Generate Payment Requests
  if (req.method === 'POST') {
    try {
      const { wallet, amount } = req.body; // Extract wallet address and amount from the request body

      if (!wallet || !amount) {
        res.status(400).json({ error: 'Wallet address and/or amount missing in the request body' });
        return;
      }

      const recipient = new PublicKey(wallet);
      const reference = new Keypair().publicKey;
      const message = `Solana${Math.floor(Math.random() * 999999) + 1}`;
      const urlData = await generateUrl(recipient, new BigNumber(amount), reference, label, message, memo);
      const ref = reference.toBase58();
      paymentRequests.set(ref, { recipient, amount, memo });
      const { url } = urlData;
      res.status(200).json({ url: url.toString(), ref });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  
  
  // Handle Verify Payment Requests
  } else  if (req.method === 'GET') {
    // 1 - Get the reference query parameter from the NextApiRequest
    const reference = req.query.reference;
    if (!reference) {
      res.status(400).json({ error: 'Missing reference query parameter' });
      return;
    }
    // 2 - Verify the transaction
    try {
      const referencePublicKey = new PublicKey(reference as string);
      const response = await verifyTransaction(referencePublicKey);
      if (response) {
        res.status(200).json({ status: 'verified' });
      } else {
        res.status(404).json({ status: 'not found' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  
  // Handle Invalid Requests
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
async function verifyTransaction(reference: PublicKey) {
    // 1 - Check that the payment request exists
    const paymentData = paymentRequests.get(reference.toBase58());
    if (!paymentData) {
      throw new Error('Payment request not found');
    }
    const { recipient, amount, memo } = paymentData;
    // 2 - Establish a Connection to the Solana Cluster
    const connection = new Connection(quicknodeEndpoint, 'confirmed');
    console.log('recipient', recipient.toBase58());
    console.log('amount', amount);
    console.log('reference', reference.toBase58());
    console.log('memo', memo);
  
    // 3 - Find the transaction reference
    const found = await findReference(connection, reference);
    console.log(found.signature)
  
    // 4 - Validate the transaction
    const response = await validateTransfer(
      connection,
      found.signature,
      {
        recipient,
        amount,
        splToken: undefined,
        reference,
        //memo
      },
      { commitment: 'confirmed' }
    );
    // 5 - Delete the payment request from local storage and return the response
    if (response) {
      paymentRequests.delete(reference.toBase58());
    }
    return response;
  }