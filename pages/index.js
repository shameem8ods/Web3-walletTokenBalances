import { useState, useEffect } from "react";
import { minABI } from "./abi";
const Web3 = require("web3");
import * as Parallel from "async-parallel";
import { formatUnits } from "@ethersproject/units";
import {
  Input,
  Button,
  Container,
  Flex,
  InputGroup,
  InputRightElement,
  Grid,
  GridItem,
  Spinner,
  Select,
} from "@chakra-ui/react";

const web3 = new Web3(
  "https://speedy-nodes-nyc.moralis.io/55cac683f24f1c515ac84210/eth/mainnet"
);
const bsc = new Web3(
  "https://speedy-nodes-nyc.moralis.io/55cac683f24f1c515ac84210/bsc/mainnet"
);
export default function Home() {
  const [input, setInput] = useState("");
  const [adresses, setAddress] = useState(null);
  const [symbols, setSymbol] = useState(null);
  const [decimals, setDecimals] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  //bsc
  const [bscAddress, setBscAddress] = useState([
    "0x928e55daB735aa8260AF3cEDadA18B5f70C72f1b",
    "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
  ]);

  useEffect(() => {
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
    var result = await Parallel.map(adresses, async (item) => {
      const contract = new web3.eth.Contract(minABI, item);
      const wei = await contract.methods.balanceOf(input).call();
      return wei;
    });
    setData(
      symbols.map((value, index) => ({
        symbol: value,
        value: result[index],
        decimal: decimals[index],
      }))
    );
    setInput("");
    setLoading(false);
  }

  const handleInput = (e) => {
    setInput(e.target.value);
  };

  return (
    <Container maxW="container.lg">
      <Container maxW="container.sm">
        <Select placeholder="Select Chain">
          <option value="option1">Ethereum Mainnet</option>
          <option value="option2">Binance Chain</option>
        </Select>
        <Flex mt="50px">
          <InputGroup size="md">
            <Input
              borderRadius="10px"
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
          {data
            ? data.map(
                (item) =>
                  item.value != 0 && (
                    <GridItem
                      w="100%"
                      h="16"
                      bg="blue.500"
                      display="flex"
                      justifyContent="flexstart"
                      pl="20px"
                      background="gray.50"
                      boxShadow="md"
                      color="black"
                      fontSize="17px"
                      borderRadius="5px"
                      alignItems="center"
                      key={item.symbol}
                    >
                      {item.symbol}
                      <br></br>
                      {parseFloat(
                        formatUnits(item.value, item.decimal)
                      ).toFixed(5)}
                    </GridItem>
                  )
              )
            : ""}
        </Grid>
      )}
    </Container>
  );
}
