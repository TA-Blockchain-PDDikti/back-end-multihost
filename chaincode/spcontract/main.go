/*
SPDX-License-Identifier: Apache-2.0
*/

package main

import (
	"log"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
	"contract/spcontract/chaincode"
)

func main() {
	spChaincode, err := contractapi.NewChaincode(&chaincode.SPContract{})
	if err != nil {
		log.Panicf("Error creating spcontract: %v", err)
	}

	if err := spChaincode.Start(); err != nil {
		log.Panicf("Error starting spcontract: %v", err)
	}
}
