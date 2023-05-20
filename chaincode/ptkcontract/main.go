/*
SPDX-License-Identifier: Apache-2.0
*/

package main

import (
	"log"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
	"contract/ptkcontract/chaincode"
)

func main() {
	ptkChaincode, err := contractapi.NewChaincode(&chaincode.PTKContract{})
	if err != nil {
		log.Panicf("Error creating ptkcontract: %v", err)
	}

	if err := ptkChaincode.Start(); err != nil {
		log.Panicf("Error starting ptkcontract: %v", err)
	}
}
