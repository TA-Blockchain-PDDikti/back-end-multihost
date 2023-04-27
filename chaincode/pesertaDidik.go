package chaincode

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)


// ============================================================================================================================
// Contract Definitions
// ============================================================================================================================

type PDContract struct {
	contractapi.Contract
}


// ============================================================================================================================
// Asset Definitions - The ledger will store Peserta Didik (PD) data
// ============================================================================================================================

type PesertaDidik struct {
	ID      			string 	`json:"id"`
	IdSP				string 	`json:"idSp"`
	IdSMS				string 	`json:"idSms"`
	NamaPD				string 	`json:"namaPd"`
	NIPD				string 	`json:"nipd"`
	SignaturePD			string 	`json:"signaturePd"`
	TotalMutu			int 	`json:"totalMutu"`
	TotalSKS			int 	`json:"totalSks"`
	IPK					float64	`json:"ipk"`
}


// ============================================================================================================================
// Init - Initialize the chaincode
// ============================================================================================================================

func (s *PDContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	// There is no initial data to put on the state
}


// ============================================================================================================================
// CreatePd - Issues a new Peserta Didik (PD) to the world state with given details.
// Inputs - ID, Id SP, Id SMS, Nama PD, NIPD
// ============================================================================================================================

func (s *PDContract) CreatePd(
	ctx contractapi.TransactionContextInterface,
	id string,
	idSp string,
	idSms string,
	namaPd string,
	nipd string,
	) error {

	exists, err := s.IsPdExists(ctx, id)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("Peserta Didik (%s) sudah ada.", id)
	}

	pd := PesertaDidik{
		ID:      			id,
		IdSP:				idSp,
		IdSMS:				idSms,
		NamaPD:				namaPd,
		NIPD:				nipd,
		SignaturePD:		"",
		TotalMutu:			0,
		TotalSKS:			0,
		IPK:				0.00,
	}
	pdJSON, err := json.Marshal(pd)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, pdJSON)
}


// ============================================================================================================================
// GetPdById - Get the Peserta Didik (PD) stored in the world state with given id.
// Inputs - ID
// ============================================================================================================================

func (s *PDContract) GetPdById(ctx contractapi.TransactionContextInterface, id string) (*PesertaDidik, error) {
	pdJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf("Failed to read from world state: %v", err)
	}
	if pdJSON == nil {
		return nil, fmt.Errorf("Peserta Didik (%s) tidak ada.", id)
	}

	var pd PesertaDidik
	err = json.Unmarshal(pdJSON, &pd)
	if err != nil {
		return nil, err
	}

	return &pd, nil
}


// ============================================================================================================================
// UpdatePd - Updates an existing Peserta Didik (PD) in the world state with provided parameters.
// Inputs - ID, Id SP, Id SMS, Nama PD, NIPD
// ============================================================================================================================

func (s *PDContract) UpdatePd(
	ctx contractapi.TransactionContextInterface,
	id string,
	idSp string,
	idSms string,
	namaPd string,
	nipd string,
	) error {
	pd, err := s.GetPdById(ctx, id)
	if err != nil {
		return err
	}

	pd.IdSP = idSp
	pd.IdSMS = idSms
	pd.NamaPD = namaPd
	pd.NIPD = nipd
	pd.SignaturePD = ""

	pdJSON, err := json.Marshal(pd)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, pdJSON)
}


// ============================================================================================================================
// DeletePd - Deletes an given Peserta Didik (PD) from the world state.
// Inputs - ID
// ============================================================================================================================

func (s *PDContract) DeletePd(ctx contractapi.TransactionContextInterface, id string) error {
	exists, err := s.IsPdExists(ctx, id)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("Peserta Didik (%s) tidak ada.", id)
	}

	return ctx.GetStub().DelState(id)
}


// ============================================================================================================================
// IsPdExists - Returns true when Peserta Didik (PD) with given ID exists in world state.
// Inputs - ID
// ============================================================================================================================

func (s *PDContract) IsPdExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {
	ptkJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return false, fmt.Errorf("Failed to read from world state: %v", err)
	}

	return ptkJSON != nil, nil
}


// ============================================================================================================================
// GetAllPd - Returns all Peserta Didik (PD) found in world state.
// No Inputs
// ============================================================================================================================

func (s *PDContract) GetAllPd(ctx contractapi.TransactionContextInterface) ([]*PesertaDidik, error) {
	// range query with empty string for startKey and endKey does an
	// open-ended query of all assets in the chaincode namespace.
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var allPtk []*PesertaDidik
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var ptk PesertaDidik
		err = json.Unmarshal(queryResponse.Value, &ptk)
		if err != nil {
			return nil, err
		}
		allPtk = append(allPtk, &ptk)
	}

	return allPtk, nil
}
