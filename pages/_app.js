import { ChakraProvider } from "@chakra-ui/react";
import { MoralisProvider } from "react-moralis";

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <MoralisProvider appId="PsPHU3daT7T7elVCvqJw0Ur4XEXofnH4stcjehtH" serverUrl="https://gbu1a0w4i9lw.usemoralis.com:2053/server">
      <Component {...pageProps} /></MoralisProvider>
      
    </ChakraProvider>
  );
}

export default MyApp;
