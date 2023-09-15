import Head from "next/head";
import Image from "next/image";
import { useState, useEffect , useMemo, useRef} from "react";
import BigNumber from "bignumber.js";
import Link from "next/link";
import { TransferRequestQR } from "../components/TransferRequestQR";
import {ConnectionProvider,WalletProvider,} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import {
  Connection,
  clusterApiUrl,
  PublicKey,
  Keypair,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";


require("@solana/wallet-adapter-react-ui/styles.css");

export default function Payment() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [amount, setAmount] = useState<BigNumber>();
  const [verificationStatus, setVerificationStatus] = useState(false);
  const [error, setError] = useState("");
  const [amountToString, setAmountToString] = useState("");
  const [balance, setBalance] = useState<number | null>(null);
  const reference = useMemo(() => Keypair.generate().publicKey, []);
  const [isQRVisible, setIsQRVisible] = useState(false);
  const QUICKNODE_RPC =
    "https://few-cool-water.solana-devnet.discover.quiknode.pro/34694b75986a1c86677328b2f079135fbc1a538c/";
  const SOLANA_CONNECTION = new Connection(QUICKNODE_RPC);
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(() => [new PhantomWalletAdapter()], [network]);

  const handleShowQRClick = () => {
    setIsQRVisible(true);
  };

  const handleShareViaEmail = () => {
    if (isQRVisible) {
      const emailSubject = "Check out this QR code";
      const emailBody = "Please Scan the attached QR code to make Payment:";
      const emailLink = `mailto:?subject=${encodeURIComponent(
        emailSubject
      )}&body=${encodeURIComponent(emailBody)}&attachment=${encodeURIComponent(
        isQRVisible
      )}`;

      window.location.href = emailLink;
    } else {
      // Handle the case where qrCodeUrl is not available
      alert("QR code URL is missing.");
    }
  };
  const handleShareToWhatsApp = () => {
    if (isQRVisible) {
      const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
        "Check out this QR code: "
      )}${encodeURIComponent(isQRVisible)}`;
      window.open(whatsappShareUrl, "_blank");
    } else {
      // Handle the case where qrCodeUrl is not available
      alert("QR code URL is missing.");
    }
  };
  const goBack = () => {
    setIsQRVisible(false);
  };
  const Back = () => {
    setVerificationStatus(false);
  };
 
  function truncate(number: any, places: any) {
    return Math.trunc(number * 10 ** places) / 10 ** places;
  }
 
  useEffect(() => {
    async function connectWallet() {
      try {
        // Initialize the selected wallet adapter (in this case, Phantom)
        const selectedWalletAdapter = wallets[0];

        // Connect to the wallet
        await selectedWalletAdapter.connect();

        // Get the wallet address
        const address = selectedWalletAdapter.publicKey?.toBase58();
        setWalletAddress(address || null);
      } catch (error) {
        setError("Error connecting to wallet:");
        console.error("Error connecting to wallet:", error);
        
      }
    }
    connectWallet();
  }, [wallets]);

  useEffect(() => {
    if (walletAddress !== null) {
      const fetchBalance = async () => {
        try {
          let newBalance = await SOLANA_CONNECTION.getBalance(
            new PublicKey(walletAddress)
          );
          newBalance = newBalance / LAMPORTS_PER_SOL;

          if (balance !== null && newBalance !== balance) {
            // The balance has changed
            setVerificationStatus(true);
          }

          setBalance(newBalance);
          console.log(`Wallet Balance: ${newBalance}`);

         
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      };
      fetchBalance();
      const intervalId = setInterval(fetchBalance, 1000);
      return () => clearInterval(intervalId);
    }
  }, [walletAddress, balance]);

  return (
    <>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <Head>
              <title>Solana.Finance</title>
              <meta name="description" content="Nobi.finance" />
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1"
              />
              <link rel="shortcut icon" href="/favicon.ico" />
            </Head>
            <header className="header shadow-lg">
              <div className="image">
                <Image
                  src="/logosol.png" // Path to the image in the public directory
                  alt="My Image"
                  width="20"
                  height="0"
                  className=""
                />
                <span className="hea">
                  <Link href="/">Solana.Finance</Link>
                </span>
              </div>

              <div className="line">
                <WalletMultiButton />
               
              </div>
            </header>
            <main className=" main">
              <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
                {isQRVisible && (
                  <p className="bac" onClick={goBack}>
              
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M14.9998 19.9201L8.47984 13.4001C7.70984 12.6301 7.70984 11.3701 8.47984 10.6001L14.9998 4.08008"
                        stroke="#292D32"
                        stroke-width="1.5"
                        stroke-miterlimit="10"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <p>Go Back</p>
                  </p>
                )}

                <h1 className="text text-5xl md:pl-12 font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mb-4 scan">
                  {isQRVisible ? "Scan this To pay" : "Input Amount"}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M7.99967 14.6666C11.6663 14.6666 14.6663 11.6666 14.6663 7.99992C14.6663 4.33325 11.6663 1.33325 7.99967 1.33325C4.33301 1.33325 1.33301 4.33325 1.33301 7.99992C1.33301 11.6666 4.33301 14.6666 7.99967 14.6666Z"
                      stroke="#98A2B3"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 5.33325V8.66659"
                      stroke="#98A2B3"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7.99609 10.6667H8.00208"
                      stroke="#98A2B3"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </h1>
              </div>
            

              <div className="xl">
                {isQRVisible && (
                  <TransferRequestQR
                    reference={reference}
                    amount={amount}
                    walletAddress={walletAddress}
                  />
                )}
              </div>

            
              <div>
                {isQRVisible ? null : (
                  <div className="input">
                    <input
                      type="number"
                      id="amount"
                      value={amount?.toString()} // Convert BigNumber to string
                      onChange={(e) => {
                        const newValue = e.target.value;
                        setAmountToString(newValue); // Update the temporary variable
                        const parsedAmount = new BigNumber(newValue);
                        setAmount(parsedAmount); // Update the BigNumber state
                      }}
                    />
                   
                  </div>
                )}
                <div className="btnss">
                  <div className="btn">
                    {isQRVisible ? null : (
                      <button
                        style={{
                          cursor: "pointer",
                          padding: "10px",
                          marginRight: "10px",
                        }}
                        onClick={handleShowQRClick}
                        className="img"
                      >
                        Generate Solana Pay Order
                      </button>
                    )}
                  </div>
              
                  <div className="btn " >
                     
                      <button
                        style={{
                          cursor: "pointer",
                          padding: "10.4px",
                          display:"flex",
                          gap:"8px",
                          marginRight: "10px",
                        }}
                        onClick={handleShowQRClick}
                        className="img"
                      >
                         <Image
                      src="/sol.png" 
                      alt="My Image"
                      width="20"
                      height="0"
                      className=""
                    />
                    
                        {balance}
                      </button>
                    
                  </div>

                 
                
                  {/* <div className="balance">
                   
                    
                    <Image
                      src="/sol.png" 
                      alt="My Image"
                      width="20"
                      height="0"
                      className=""
                    />
                    {balance}
                  </div> */}
                </div>

         
              </div>
              {isQRVisible && (
                <div className="via">
                  {" "}
                  Share via{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="15"
                    viewBox="0 0 12 15"
                    fill="none"
                    className="svg"
                  >
                    <path
                      d="M10 14.1668C9.44444 14.1668 8.97222 13.9724 8.58333 13.5835C8.19444 13.1946 8 12.7224 8 12.1668C8 12.0891 8.00556 12.0084 8.01667 11.9248C8.02778 11.8413 8.04445 11.7664 8.06667 11.7002L3.36667 8.96683C3.17778 9.1335 2.96667 9.26416 2.73333 9.35883C2.5 9.4535 2.25556 9.50061 2 9.50016C1.44444 9.50016 0.972222 9.30572 0.583333 8.91683C0.194444 8.52794 0 8.05572 0 7.50016C0 6.94461 0.194444 6.47238 0.583333 6.0835C0.972222 5.69461 1.44444 5.50016 2 5.50016C2.25556 5.50016 2.5 5.5475 2.73333 5.64216C2.96667 5.73683 3.17778 5.86727 3.36667 6.0335L8.06667 3.30016C8.04445 3.2335 8.02778 3.15861 8.01667 3.0755C8.00556 2.99238 8 2.91172 8 2.8335C8 2.27794 8.19444 1.80572 8.58333 1.41683C8.97222 1.02794 9.44444 0.833496 10 0.833496C10.5556 0.833496 11.0278 1.02794 11.4167 1.41683C11.8056 1.80572 12 2.27794 12 2.8335C12 3.38905 11.8056 3.86127 11.4167 4.25016C11.0278 4.63905 10.5556 4.8335 10 4.8335C9.74444 4.8335 9.5 4.78638 9.26667 4.69216C9.03333 4.59794 8.82222 4.46727 8.63333 4.30016L3.93333 7.0335C3.95556 7.10016 3.97222 7.17527 3.98333 7.25883C3.99444 7.34238 4 7.42283 4 7.50016C4 7.57794 3.99444 7.65861 3.98333 7.74216C3.97222 7.82572 3.95556 7.90061 3.93333 7.96683L8.63333 10.7002C8.82222 10.5335 9.03333 10.4031 9.26667 10.3088C9.5 10.2146 9.74444 10.1673 10 10.1668C10.5556 10.1668 11.0278 10.3613 11.4167 10.7502C11.8056 11.1391 12 11.6113 12 12.1668C12 12.7224 11.8056 13.1946 11.4167 13.5835C11.0278 13.9724 10.5556 14.1668 10 14.1668Z"
                      fill="#1D2939"
                    />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="svg"
                    onClick={handleShareToWhatsApp}
                  >
                    <path
                      d="M18.3172 9.50829C18.0339 4.67496 13.6422 0.949968 8.5839 1.7833C5.10056 2.3583 2.3089 5.18328 1.76724 8.66662C1.45057 10.6833 1.86725 12.5916 2.77559 14.1666L2.03391 16.925C1.86724 17.55 2.44223 18.1166 3.05889 17.9416L5.77557 17.1916C7.0089 17.9166 8.45057 18.3333 9.99223 18.3333C14.6922 18.3333 18.5922 14.1916 18.3172 9.50829ZM14.0672 13.1C13.9922 13.25 13.9006 13.3916 13.7839 13.525C13.5756 13.75 13.3505 13.9166 13.1005 14.0166C12.8505 14.125 12.5756 14.175 12.2839 14.175C11.8589 14.175 11.4006 14.075 10.9256 13.8666C10.4422 13.6583 9.96725 13.3833 9.49225 13.0416C9.00892 12.6916 8.55891 12.3 8.12557 11.875C7.69224 11.4416 7.30889 10.9833 6.95889 10.5083C6.61722 10.0333 6.34224 9.55828 6.14224 9.08328C5.94224 8.60828 5.84225 8.14996 5.84225 7.71663C5.84225 7.4333 5.89224 7.1583 5.99224 6.9083C6.09224 6.64996 6.25059 6.41663 6.47559 6.2083C6.74226 5.94163 7.0339 5.81663 7.34224 5.81663C7.4589 5.81663 7.57555 5.84163 7.68388 5.89163C7.79222 5.94163 7.89224 6.01663 7.96724 6.12496L8.93388 7.49161C9.00888 7.59995 9.06723 7.69162 9.10056 7.78329C9.14223 7.87495 9.1589 7.95828 9.1589 8.04162C9.1589 8.14162 9.12558 8.24163 9.06724 8.34163C9.00891 8.44163 8.93389 8.54162 8.83389 8.64162L8.51722 8.97495C8.46722 9.02495 8.45059 9.07496 8.45059 9.14162C8.45059 9.17496 8.45888 9.20829 8.46722 9.24162C8.48388 9.27495 8.49225 9.29996 8.50058 9.32496C8.57558 9.46662 8.70889 9.64161 8.89223 9.85828C9.08389 10.0749 9.28393 10.3 9.50059 10.5166C9.72559 10.7416 9.94225 10.9416 10.1672 11.1333C10.3839 11.3166 10.5672 11.4416 10.7089 11.5166C10.7339 11.525 10.7589 11.5416 10.7839 11.5499C10.8172 11.5666 10.8506 11.5666 10.8922 11.5666C10.9672 11.5666 11.0173 11.5416 11.0673 11.4916L11.3839 11.175C11.4922 11.0666 11.5923 10.9916 11.6839 10.9416C11.7839 10.8833 11.8756 10.8499 11.9839 10.8499C12.0672 10.8499 12.1506 10.8666 12.2422 10.9083C12.3339 10.95 12.4339 11 12.5339 11.075L13.9172 12.0583C14.0256 12.1333 14.1006 12.225 14.1506 12.325C14.1922 12.4333 14.2172 12.5333 14.2172 12.65C14.1672 12.7916 14.1339 12.95 14.0672 13.1Z"
                      fill="#25D366"
                    />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="svg"
                    onClick={handleShareViaEmail}
                  >
                    <path
                      d="M14.166 17.0834H5.83268C3.33268 17.0834 1.66602 15.8334 1.66602 12.9167V7.08341C1.66602 4.16675 3.33268 2.91675 5.83268 2.91675H14.166C16.666 2.91675 18.3327 4.16675 18.3327 7.08341V12.9167C18.3327 15.8334 16.666 17.0834 14.166 17.0834Z"
                      stroke="#475467"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14.1673 7.5L11.559 9.58333C10.7006 10.2667 9.29231 10.2667 8.43398 9.58333L5.83398 7.5"
                      stroke="#475467"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </main>
            {verificationStatus && (
              <div className="trans">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="vuesax/linear/info-circle">
                    <g id="info-circle">
                      <path
                        id="Vector"
                        d="M7.99967 14.6666C11.6663 14.6666 14.6663 11.6666 14.6663 7.99992C14.6663 4.33325 11.6663 1.33325 7.99967 1.33325C4.33301 1.33325 1.33301 4.33325 1.33301 7.99992C1.33301 11.6666 4.33301 14.6666 7.99967 14.6666Z"
                        stroke="#98A2B3"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        id="Vector_2"
                        d="M8 5.33325V8.66659"
                        stroke="#98A2B3"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        id="Vector_3"
                        d="M7.99609 10.6667H8.00208"
                        stroke="#98A2B3"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>
                  </g>
                </svg>
                Transaction Confirmed   
                <div
              
                className="py-[8px] px-[16px]  text-black flex items-center h-[40px] cursor-pointer"
                onClick={Back}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="21"
                  height="0"
                  viewBox="0 0 41 40"
                  fill="none"
                >
                  <rect
                    x="0.617188"
                    width="40"
                    height="40"
                    rx="20"
                    fill="white"
                  />
                  <path
                    d="M13.6221 11L11.6172 13.0123L18.6233 20L11.6172 26.9877L13.6221 29L20.6282 22.0123L27.6343 29L29.6172 26.9877L22.6331 20L29.6172 13.0123L27.6343 11L20.6282 17.9877L13.6221 11Z"
                    fill="#475467"
                  />
                </svg>
              </div>
              </div>
            )}
            {error && <p className="err">{error}</p>}

            <div className="relative mb-40 mt-40 flex items-center justify-center text-black">
              <Image
                src="/logo.png" // Path to the image in the public directory
                alt="My Image"
                width="150"
                height="0"
                className="image"
              />
              <Image
                src="/phan.png" // Path to the image in the public directory
                alt="My Image"
                width="100"
                height="0"
                className="image"
              />
            </div>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </>
  );
}
