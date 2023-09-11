import React,{useState} from 'react'
import Head from "next/head";
import Image from "next/image";
import Link from 'next/link';


export default function Home() {
  const [pop,SetPop] = useState(false)


  const openPopup = () => {
    SetPop(true)

  }
  const goBack = () => {
    SetPop(false)

  }
  return (
    <div>
       <Head>
        <title>Solana.Finance</title>
        <meta name="description" content="Nobi.finance" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <header className="header shadow-lg">
        <div className="image">
          <Image
            src="/logosol.png" // Path to the image in the public directory
            alt="My Image"
            width="30"
            height="0"
            className=""
          />
          <span className="hea">Solana.Finance</span>
        </div>
       
      </header>



      <div className='conta'>
        <div className='flex'>
        <p className='co text text-5xl md:pl-12 font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mb-4'>Speed up your Crypto payments </p>

<p className='container'>Making Simple Point of serivce (POS) for making Solana (SOL) cryptocurrency payments using a scan-to-pay mechanism.</p>

 


<button className='cntbtn'>
  <Link href='/payment'>Test Demo</Link>
        
  </button>
  <button className='cntbtn tip' onClick={openPopup}>
   Mint cNFT 🤑
        
  </button>


        </div>
     <div className='flex im animated-element'>
     <Image
            src="/cat.png" // Path to the image in the public directory
            alt="My Image"
            width="630"
            height="0"
            className=""
          />

     </div>
       
      </div>
      {
        pop && <div className='rela'><div className='cover'>
         
        </div>
         <div className='pop'>
         <p className="bac" onClick={goBack}> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
<path d="M14.9998 19.9201L8.47984 13.4001C7.70984 12.6301 7.70984 11.3701 8.47984 10.6001L14.9998 4.08008" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg><p>Go Back</p></p>
        
<p className='cau'>Caution any money sent here is to support this project <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
<path d="M7.99967 14.6666C11.6663 14.6666 14.6663 11.6666 14.6663 7.99992C14.6663 4.33325 11.6663 1.33325 7.99967 1.33325C4.33301 1.33325 1.33301 4.33325 1.33301 7.99992C1.33301 11.6666 4.33301 14.6666 7.99967 14.6666Z" stroke="#98A2B3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8 5.33325V8.66659" stroke="#98A2B3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M7.99609 10.6667H8.00208" stroke="#98A2B3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg></p>
         </div>
         </div>
      }
     

       
        
    </div>
  )
}
