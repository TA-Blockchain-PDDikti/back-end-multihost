package chaincode

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)


// ============================================================================================================================
// Contract Definitions
// ============================================================================================================================

type TSKContract struct {
	contractapi.Contract
}


// ============================================================================================================================
// Asset Definitions - The ledger will store Transkrip Mahasiswa (TSK) data
// ============================================================================================================================

type Transkrip struct {
	ID      			string 	`json:"id"`
	IdSP				string 	`json:"idSp"`
	IdSMS				string 	`json:"idSms"`
	IdPD				string 	`json:"idPd"`
	JenjangPendidikan	string 	`json:"jenjangPendidikan"`
	TotalMutu			int 	`json:"totalMutu"`
	TotalSKS			int 	`json:"totalSks"`
	IPK					float64	`json:"ipk"`
}


// ============================================================================================================================
// Init - Initialize the chaincode
// ============================================================================================================================

func (s *TSKContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	// There is no initial data to put on the state
}


// ============================================================================================================================
// CreateTsk - Issues a new Transkrip Mahasiswa (TSK) to the world state with given details.
// Inputs - ID, Id SP, Id SMS, Id PD, Jenjang Pendidikan, Total Mutu, Total SKS, IPK
// ============================================================================================================================

func (s *TSKContract) CreateTsk(
	ctx contractapi.TransactionContextInterface,
	id string,
	idSp string,
	idSms string,
	idPd string,
	jenjangPendidikan string,
	totalMutu int,
	totalSks int,
	ipk float64
	) error {

	exists, err := s.IsTskExists(ctx, id)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("Transkrip Mahasiswa (%s) sudah ada.", id)
	}

	tsk := Transkrip{
		ID:      			id,
		IdSP:				idSp,
		IdSMS:				idSms,
		IdPD:				idPd,
		JenjangPendidikan:	jenjangPendidikan,
		TotalMutu:			totalMutu,
		TotalSKS:			totalSks,
		IPK:				ipk
	}
	tskJSON, err := json.Marshal(tsk)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, tskJSON)
}


// ============================================================================================================================
// GetTskById - Get the Transkrip Mahasiswa (TSK) stored in the world state with given id.
// Inputs - ID
// ============================================================================================================================

func (s *TSKContract) GetTskById(ctx contractapi.TransactionContextInterface, id string) (*Transkrip, error) {
	tskJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf("Failed to read from world state: %v", err)
	}
	if tskJSON == nil {
		return nil, fmt.Errorf("Transkrip Mahasiswa (%s) tidak ada.", id)
	}

	var tsk Transkrip
	err = json.Unmarshal(tskJSON, &tsk)
	if err != nil {
		return nil, err
	}

	return &tsk, nil
}


// ============================================================================================================================
// UpdateTsk - Updates an existing Transkrip Mahasiswa (TSK) in the world state with provided parameters.
// Inputs - ID, Id SP, Id SMS, Id PD, Jenjang Pendidikan, Total Mutu, Total SKS, IPK
// ============================================================================================================================

func (s *TSKContract) UpdateTsk(
	ctx contractapi.TransactionContextInterface,
	id string,
	idSp string,
	idSms string,
	idPd string,
	jenjangPendidikan string,
	totalMutu int,
	totalSks int,
	ipk float64
	) error {
	exists, err := s.IsTskExists(ctx, id)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("Transkrip Mahasiswa (%s) tidak ada.", id)
	}

	// overwriting original TSK with new TSK
	tsk := Transkrip{
		ID:      			id,
		IdSP:				idSp,
		IdSMS:				idSms,
		IdPD:				idPd,
		JenjangPendidikan:	jenjangPendidikan,
		TotalMutu:			totalMutu,
		TotalSKS:			totalSks,
		IPK:				ipk
	}

	tskJSON, err := json.Marshal(tsk)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, tskJSON)
}


// ============================================================================================================================
// DeleteTsk - Deletes an given Transkrip Mahasiswa (TSK) from the world state.
// Inputs - ID
// ============================================================================================================================

func (s *TSKContract) DeleteTsk(ctx contractapi.TransactionContextInterface, id string) error {
	exists, err := s.IsTskExists(ctx, id)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("Transkrip Mahasiswa (%s) tidak ada.", id)
	}

	return ctx.GetStub().DelState(id)
}


// ============================================================================================================================
// IsTskExists - Returns true when Transkrip Mahasiswa (TSK) with given ID exists in world state.
// Inputs - ID
// ============================================================================================================================

func (s *TSKContract) IsTskExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {
	tskJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return false, fmt.Errorf("Failed to read from world state: %v", err)
	}

	return tskJSON != nil, nil
}


// ============================================================================================================================
// GetAllTsk - Returns all Transkrip Mahasiswa (TSK) found in world state.
// No Inputs
// ============================================================================================================================

func (s *TSKContract) GetAllTsk(ctx contractapi.TransactionContextInterface) ([]*Transkrip, error) {
	// range query with empty string for startKey and endKey does an
	// open-ended query of all assets in the chaincode namespace.
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var allTsk []*Transkrip
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var tsk Transkrip
		err = json.Unmarshal(queryResponse.Value, &tsk)
		if err != nil {
			return nil, err
		}
		allTsk = append(allTsk, &tsk)
	}

	return allTsk, nil
}
