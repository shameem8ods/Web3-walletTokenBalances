import React from 'react'
import { formatUnits } from "@ethersproject/units";
import {
  GridItem,
} from "@chakra-ui/react";

function GridComponent({data}) {
  return (
    <>
    {
    data.map(
                (item) =>
                item.balance != 0 && 
                (
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
                        formatUnits(item.balance, item.decimals)
                      ).toFixed(5)}
                    </GridItem>
                  ))}</>
  )
}

export default GridComponent