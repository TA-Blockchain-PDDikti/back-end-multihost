package chaincode

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)


// ============================================================================================================================
// Contract Definitions
// ============================================================================================================================

type PTKContract struct {
	contractapi.Contract
}


// ============================================================================================================================
// Asset Definitions - The ledger will store Pendidik dan Tenaga Kependidikan (PTK) data
// ============================================================================================================================

type PendidikTenagaKependidikan struct {
	ID      			string `json:"id"`
	IdSP				string `json:"idSp"`
	IdSMS				string `json:"idSms"`
	NamaPTK				string `json:"namaPtk"`
	NomorST				string `json:"nomorST"`
	NIDN				string `json:"nidn"`
	Jabatan				string `json:"jabatan"`
	NomorSK				string `json:"nomorSk"`
	SignaturePTK		string `json:"signaturePtk"`
	SignatureJabatan	string `json:"signatureJabatan"`
}


// ============================================================================================================================
// Init - Initialize the chaincode
// ============================================================================================================================

func (s *PTKContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	// There is no initial data to put on the state
}


// ============================================================================================================================
// CreatePtk - Issues a new Pendidik dan Tenaga Kependidikan (PTK) to the world state with given details.
// Inputs - ID, Id SP, Id SMS, Nama PTK, Nomor ST
// ============================================================================================================================

func (s *PTKContract) CreatePtk(
	ctx contractapi.TransactionContextInterface,
	id string,
	idSp string,
	idSms string,
	namaPtk string,
	nomorST string,
	) error {

	exists, err := s.IsPtkExists(ctx, id)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("Pendidik dan Tenaga Kependidikan (%s) sudah ada.", id)
	}

	ptk := PendidikTenagaKependidikan{
		ID:      			id,
		IdSP:				idSp,
		IdSMS:				idSms,
		NamaPTK:			namaPtk,
		NomorST:			nomorST,
		NIDN:				"",
		Jabatan:			"",
		NomorSK:			"",
		SignaturePTK:		"",
		SignatureJabatan:	"",
	}
	ptkJSON, err := json.Marshal(ptk)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, ptkJSON)
}


// ============================================================================================================================
// GetPtkById - Get the Pendidik dan Tenaga Kependidikan (PTK) stored in the world state with given id.
// Inputs - ID
// ============================================================================================================================

func (s *PTKContract) GetPtkById(ctx contractapi.TransactionContextInterface, id string) (*PendidikTenagaKependidikan, error) {
	ptkJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf("Failed to read from world state: %v", err)
	}
	if ptkJSON == nil {
		return nil, fmt.Errorf("Pendidik dan Tenaga Kependidikan (%s) tidak ada.", id)
	}

	var ptk PendidikTenagaKependidikan
	err = json.Unmarshal(ptkJSON, &ptk)
	if err != nil {
		return nil, err
	}

	return &ptk, nil
}


// ============================================================================================================================
// UpdatePtk - Updates an existing Pendidik dan Tenaga Kependidikan (PTK) in the world state with provided parameters.
// Inputs - ID, Id SP, Id SMS, Nama PTK, Nomor ST
// ============================================================================================================================

func (s *PTKContract) UpdatePtk(
	ctx contractapi.TransactionContextInterface,
	id string,
	idSp string,
	idSms string,
	namaPtk string,
	nomorST string,
	) error {
	exists, err := s.IsPtkExists(ctx, id)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("Pendidik dan Tenaga Kependidikan (%s) tidak ada.", id)
	}

	// overwriting original PTK with new PTK
	ptk := PendidikTenagaKependidikan{
		ID:      			id,
		IdSP:				idSp,
		IdSMS:				idSms,
		NamaPTK:			namaPtk,
		NomorST:			nomorST,
		NIDN:				"",
		Jabatan:			"",
		NomorSK:			"",
		SignaturePTK:		"",
		SignatureJabatan:	"",
	}
	ptkJSON, err := json.Marshal(ptk)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, ptkJSON)
}


// ============================================================================================================================
// DeletePtk - Deletes an given Pendidik dan Tenaga Kependidikan (PTK) from the world state.
// Inputs - ID
// ============================================================================================================================

func (s *PTKContract) DeletePtk(ctx contractapi.TransactionContextInterface, id string) error {
	exists, err := s.IsPtkExists(ctx, id)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("Pendidik dan Tenaga Kependidikan (%s) tidak ada.", id)
	}

	return ctx.GetStub().DelState(id)
}


// ============================================================================================================================
// IsPtkExists - Returns true when Pendidik dan Tenaga Kependidikan (PTK) with given ID exists in world state.
// Inputs - ID
// ============================================================================================================================

func (s *PTKContract) IsPtkExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {
	ptkJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return false, fmt.Errorf("Failed to read from world state: %v", err)
	}

	return ptkJSON != nil, nil
}


// ============================================================================================================================
// GetAllPtk - Returns all Pendidik dan Tenaga Kependidikan (PTK) found in world state.
// No Inputs
// ============================================================================================================================

func (s *PTKContract) GetAllPtk(ctx contractapi.TransactionContextInterface) ([]*PendidikTenagaKependidikan, error) {
	// range query with empty string for startKey and endKey does an
	// open-ended query of all assets in the chaincode namespace.
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var allPtk []*PendidikTenagaKependidikan
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var ptk PendidikTenagaKependidikan
		err = json.Unmarshal(queryResponse.Value, &ptk)
		if err != nil {
			return nil, err
		}
		allPtk = append(allPtk, &ptk)
	}

	return allPtk, nil
}
