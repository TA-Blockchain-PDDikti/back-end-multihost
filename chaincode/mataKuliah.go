package chaincode

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)


// ============================================================================================================================
// Contract Definitions
// ============================================================================================================================

type MKContract struct {
	contractapi.Contract
}


// ============================================================================================================================
// Asset Definitions - The ledger will store Mata Kuliah (MK) data
// ============================================================================================================================

type MataKuliah struct {
	ID      			string 	`json:"id"`
	IdSMS				string 	`json:"idSms"`
	NamaMK				string 	`json:"namaMk"`
	SKS					int 	`json:"sks"`
	JenjangPendidikan	string 	`json:"jenjangPendidikan"`
}


// ============================================================================================================================
// Init - Initialize the chaincode
// ============================================================================================================================

func (s *MKContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	// There is no initial data to put on the state
}


// ============================================================================================================================
// CreateMk - Issues a new Mata Kuliah (MK) to the world state with given details.
// Inputs - ID, Id SMS, Nama MK, SKS, Jenjang Pendidikan
// ============================================================================================================================

func (s *MKContract) CreateMk(
	ctx contractapi.TransactionContextInterface,
	id string,
	idSms string,
	namaMk int,
	sks string,
	jenjangPendidikan string,
	) error {

	exists, err := s.IsMkExists(ctx, id)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("Mata Kuliah (%s) sudah ada.", id)
	}

	mk := MataKuliah{
		ID:      			id,
		IdSMS:				idSms,
		NamaMK:				namaMk,
		SKS:				sks,
		JenjangPendidikan:	jenjangPendidikan,
	}
	mkJSON, err := json.Marshal(mk)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, mkJSON)
}


// ============================================================================================================================
// GetMkById - Get the Mata Kuliah (MK) stored in the world state with given id.
// Inputs - ID
// ============================================================================================================================

func (s *MKContract) GetMkById(ctx contractapi.TransactionContextInterface, id string) (*MataKuliah, error) {
	mkJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf("Failed to read from world state: %v", err)
	}
	if mkJSON == nil {
		return nil, fmt.Errorf("Mata Kuliah (%s) tidak ada.", id)
	}

	var mk MataKuliah
	err = json.Unmarshal(mkJSON, &mk)
	if err != nil {
		return nil, err
	}

	return &mk, nil
}


// ============================================================================================================================
// UpdateMk - Updates an existing Mata Kuliah (MK) in the world state with provided parameters.
// Inputs - ID, Id SMS, Nama MK, SKS, Jenjang Pendidikan
// ============================================================================================================================

func (s *MKContract) UpdateMk(
	ctx contractapi.TransactionContextInterface,
	id string,
	idSms string,
	namaMk int,
	sks string,
	jenjangPendidikan string,
	) error {
	exists, err := s.IsMkExists(ctx, id)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("Mata Kuliah (%s) tidak ada.", id)
	}

	// overwriting original MK with new MK
	mk := MataKuliah{
		ID:      			id,
		IdSMS:				idSms,
		NamaMK:				namaMk,
		SKS:				sks,
		JenjangPendidikan:	jenjangPendidikan,
	}

	mkJSON, err := json.Marshal(mk)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, mkJSON)
}


// ============================================================================================================================
// DeleteMk - Deletes an given Mata Kuliah (MK) from the world state.
// Inputs - ID
// ============================================================================================================================

func (s *MKContract) DeleteMk(ctx contractapi.TransactionContextInterface, id string) error {
	exists, err := s.IsMkExists(ctx, id)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("Mata Kuliah (%s) tidak ada.", id)
	}

	return ctx.GetStub().DelState(id)
}


// ============================================================================================================================
// IsMkExists - Returns true when Mata Kuliah (MK) with given ID exists in world state.
// Inputs - ID
// ============================================================================================================================

func (s *MKContract) IsMkExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {
	mkJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return false, fmt.Errorf("Failed to read from world state: %v", err)
	}

	return mkJSON != nil, nil
}


// ============================================================================================================================
// GetAllMk - Returns all Mata Kuliah (MK) found in world state.
// No Inputs
// ============================================================================================================================

func (s *MKContract) GetAllMk(ctx contractapi.TransactionContextInterface) ([]*MataKuliah, error) {
	// range query with empty string for startKey and endKey does an
	// open-ended query of all assets in the chaincode namespace.
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var allMk []*MataKuliah
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var mk MataKuliah
		err = json.Unmarshal(queryResponse.Value, &mk)
		if err != nil {
			return nil, err
		}
		allMk = append(allMk, &mk)
	}

	return allMk, nil
}
