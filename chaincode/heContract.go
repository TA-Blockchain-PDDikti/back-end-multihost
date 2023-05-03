package main

import (
	"log"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
	// "github.com/hyperledger/fabric-samples/asset-transfer-basic/chaincode-go/chaincode" // TODO: Ganti jd path chaincodenya
)

// ============================================================================================================================
// Main
// ============================================================================================================================

// Main Function
func main() {
	assetChaincode, err := contractapi.NewChaincode(
		&chaincode.SPContract{},
		&chaincode.SMSContract{},
		&chaincode.PTKContract{},
		&chaincode.PDContract{},
		&chaincode.MKContract{},
		&chaincode.KLSContract{},
		&chaincode.NMHSContract{},
		&chaincode.TSKContract{},
		&chaincode.IJZContract{},
	)
	if err != nil {
		log.Panicf("Error creating higher education chaincode: %v", err)
	}

	if err := assetChaincode.Start(); err != nil {
		log.Panicf("Error starting higher education chaincode: %v", err)
	}
}
