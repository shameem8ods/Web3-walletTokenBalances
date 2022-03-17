import { useState, useEffect } from "react";
import { minABI } from "./abi";
const Web3 = require("web3");
import * as Parallel from "async-parallel";
import { formatUnits } from "@ethersproject/units";
import { useMoralisWeb3Api } from "react-moralis";
import { useMoralis } from "react-moralis";
import GridComponent from "./GridComponent";
import {
  Input,
  Button,
  Center,
  Container,
  Flex,
  InputGroup,
  InputRightElement,
  Grid,
  GridItem,
  Spinner,
  Select,
  Box,
  Tabs, TabList, TabPanels, Tab, TabPanel, color
} from "@chakra-ui/react";



export default function Home() {
  const { authenticate, isAuthenticated, logout,user } = useMoralis();
  const [input, setInput] = useState("");
  const [adresses, setAddress] = useState(null);
  const [symbols, setSymbol] = useState(null);
  const [decimals, setDecimals] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  //bsc
  const [bscData, setBscData] = useState(null);
  const [select,setSelect] =useState("option1");
  const Web3Api = useMoralisWeb3Api();
  useEffect(() => {

    // var a = "0x928e55daB735aa8260AF3cEDadA18B5f70C72f1b"
    // var b = "0xfC43f5F9dd45258b3AFf31Bdbe6561D97e8B71de"
    // const test = new Web3(
    //   "https://speedy-nodes-nyc.moralis.io/55cac683f24f1c515ac84210/eth/mainnet"
    // );

    // async function test1(){

    //   const contract = new test.eth.Contract(minABI, a);
    //   const wei = await contract.methods.balanceOf(b).call();
    //   console.log(wei)
    // }
    // test1()
      
  
    
    //bep-20 token list
    //   const TOKEN_LIST_URL        = "https://cryptotalk-public-gateway-byeii62k.de.gateway.dev/bsc/tokens-list";
    //   const API_KEY               = "AIzaSyCngkz41JSdBMlr4iKqAMLiTMHD9TfQvuc";
    //  fetch(TOKEN_LIST_URL +"?key=" + API_KEY).then((res)=> res.json()).then((data)=>{
    //   var arr = [];
    //   for(const property in data.data){
    //     arr.push(`${property}`)
    //   }  
    //   setBscAddress(arr)
    //  }
   
    //  )
    fetch(
      "https://wispy-bird-88a7.uniswap.workers.dev/?url=http://erc20.cmc.eth.link"
    )
      .then((response) => response.json())
      .then(
        (data) => (
          setAddress(
            data.tokens.map((item) => {
              return item.address;
            })
          ),
          setSymbol(
            data.tokens.map((item) => {
              return item.symbol;
            })
          ),
          setDecimals(
            data.tokens.map((item) => {
              return item.decimals;
            })
          )
        )
      );
  }, []);


  
  async function handleClick() {

    setLoading(true);
    if(select=="option1"){
      const web3 = new Web3(
        "https://mainnet.infura.io/v3/b373051775cd4c65a9fb9eeb34e16795"
      );
      setLoading(true);
      var result = await Parallel.map(adresses, async (item) => {
        const contract = new web3.eth.Contract(minABI, item);
        const wei = await contract.methods.balanceOf(input).call();
        return wei;
      });
      setData(
        symbols.map((value, index) => ({
          symbol: value,
          balance: result[index],
          decimals: decimals[index],
        }))
      );
    }
    else{
      const fetchTokenBalances = async () => {
        const options = {
          chain: "bsc",
          address:input
        };
        const balances = await Web3Api.account.getTokenBalances(options);
        setBscData(balances)
      };
      fetchTokenBalances() 
      setLoading(false);   
    }
    
    setInput("");
    setLoading(false);
  }

  const handleInput = (e) => {
    setInput(e.target.value);
  };

  const handleSelect = (e) => {
    setSelect(e.target.value);
    setData("")
    setBscData("")
  };
  console.log(select)
  return (
    <Box height="100vh" bgGradient="radial(#565392,black)" width="100%" p="75px 0px">
      <Container maxW="container.lg" background="#000000a8" p="20px" borderRadius="10px" boxShadow="md" minHeight="600px" >

<Tabs variant='soft-rounded'>
  <TabList>
    <Tab>Connect to a Wallet</Tab>
    <Tab>Check Balance</Tab>
  </TabList>
  <TabPanels>

    <TabPanel>
    {isAuthenticated ? (
      <>
      <Button onClick={logout} colorScheme="red" variant="solid">Logout</Button>
                <Box color="white">Your wallet address is : {user.get("ethAddress")}</Box></>
    
  ) : (
    <Center>
       <Button  background="white" variant='solid'
      onClick={() => {
        authenticate({ provider: "metamask" });
      }}
    >
      Sign in with MetaMask
    </Button>
    </Center>
   
  )
}


    </TabPanel>

    <TabPanel>
    <Container maxW="container.sm">
        <Select placeholder="Select Chain" mt="40px" value={select}  onChange={handleSelect} color="white">
          <option value="option1" >Ethereum Mainnet</option>
          <option value="option2">Binance Chain</option>
        </Select>
        <Flex mt="30px">
          <InputGroup size="md">
            <Input
              borderRadius="10px"
              color="white"
              pr="4.5rem"
              onChange={handleInput}
              value={input}
              placeholder="Enter wallet address"
            />
            <InputRightElement width="max-content">
              <Button w="100%" mr="4px" h="80%" size="sm" onClick={handleClick}>
                Show Balances
              </Button>
            </InputRightElement>
          </InputGroup>
        </Flex>
      </Container>

      {loading ? (
        <Flex w="100%" justifyContent="center" mt="50px">
          <Spinner />
        </Flex>
      ) : (
        <Grid templateColumns="repeat(4, 1fr)" gap={3} mt="40px" mb="60px">
          {
            (select=="option1" && data)?
           <GridComponent data={data}></GridComponent>
                  :(select=="option2" && bscData)?
                  <GridComponent data={bscData}></GridComponent>
             :""
            }
        </Grid> 
      )}
    </TabPanel>
  </TabPanels>
</Tabs>

      
    </Container>
    </Box>
    
  );
}
