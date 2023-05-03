package chaincode

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)


// ============================================================================================================================
// Contract Definitions
// ============================================================================================================================

type SPContract struct {
	contractapi.Contract
}


// ============================================================================================================================
// Asset Definitions - The ledger will store Satuan Pendidikan (SP) data
// ============================================================================================================================

type SatuanPendidikan struct {
	ID      		string `json:"id"`
	IdMSP			string `json:"idMsp"`
	NamaSP			string `json:"namaSp"`
}


// ============================================================================================================================
// Init - Initialize the chaincode
// ============================================================================================================================

func (s *SPContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	// There is no initial data to put on the state
}


// ============================================================================================================================
// CreateSp - Issues a new Satuan Pendidikan (SP) to the world state with given details.
// Inputs - ID, Id MSP, Nama SP
// ============================================================================================================================

func (s *SPContract) CreateSp(ctx contractapi.TransactionContextInterface, id string, idMsp string, namaSp string) error {
	exists, err := s.IsSpExists(ctx, id)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("Satuan Pendidikan (%s) sudah ada.", id)
	}

	sp := SatuanPendidikan{
		ID:      		id,
		IdMSP:			idMsp,
		NamaSP:			namaSp,
	}
	spJSON, err := json.Marshal(sp)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, spJSON)
}


// ============================================================================================================================
// GetSpById - Get the Satuan Pendidikan (SP) stored in the world state with given id.
// Inputs - ID
// ============================================================================================================================

func (s *SPContract) GetSpById(ctx contractapi.TransactionContextInterface, id string) (*SatuanPendidikan, error) {
	spJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf("Failed to read from world state: %v", err)
	}
	if spJSON == nil {
		return nil, fmt.Errorf("Satuan Pendidikan (%s) tidak ada.", id)
	}

	var sp SatuanPendidikan
	err = json.Unmarshal(spJSON, &sp)
	if err != nil {
		return nil, err
	}

	return &sp, nil
}


// ============================================================================================================================
// UpdateSp - Updates an existing Satuan Pendidikan (SP) in the world state with provided parameters.
// Inputs - ID, Id MSP, Nama SP
// ============================================================================================================================

func (s *SPContract) UpdateSp(ctx contractapi.TransactionContextInterface, id string, idMsp string, namaSp string) error {
	exists, err := s.IsSpExists(ctx, id)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("Satuan Pendidikan (%s) tidak ada.", id)
	}

	// overwriting original SP with new SP
	sp := SatuanPendidikan{
		ID:      		id,
		IdMSP:			idMsp,
		NamaSP:			namaSp,
	}
	spJSON, err := json.Marshal(sp)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, spJSON)
}


// ============================================================================================================================
// DeleteSp - Deletes an given Satuan Pendidikan (SP) from the world state.
// Inputs - ID
// ============================================================================================================================

func (s *SPContract) DeleteSp(ctx contractapi.TransactionContextInterface, id string) error {
	exists, err := s.IsSpExists(ctx, id)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("Satuan Pendidikan (%s) tidak ada.", id)
	}

	return ctx.GetStub().DelState(id)
}


// ============================================================================================================================
// IsSpExists - Returns true when Satuan Pendidikan (SP) with given ID exists in world state.
// Inputs - ID
// ============================================================================================================================

func (s *SPContract) IsSpExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {
	spJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return false, fmt.Errorf("Failed to read from world state: %v", err)
	}

	return spJSON != nil, nil
}


// ============================================================================================================================
// GetAllSp - Returns all Satuan Pendidikan (SP) found in world state.
// No Inputs
// ============================================================================================================================

func (s *SPContract) GetAllSp(ctx contractapi.TransactionContextInterface) ([]*SatuanPendidikan, error) {
	// range query with empty string for startKey and endKey does an
	// open-ended query of all assets in the chaincode namespace.
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var allSp []*SatuanPendidikan
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var sp SatuanPendidikan
		err = json.Unmarshal(queryResponse.Value, &sp)
		if err != nil {
			return nil, err
		}
		allSp = append(allSp, &sp)
	}

	return allSp, nil
}
