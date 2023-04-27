package chaincode

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)


// ============================================================================================================================
// Contract Definitions
// ============================================================================================================================

type IJZContract struct {
	contractapi.Contract
}


// ============================================================================================================================
// Asset Definitions - The ledger will store Ijazah Mahasiswa (IJZ) data
// ============================================================================================================================

type Ijazah struct {
	ID      			string 	`json:"id"`
	IdSP				string 	`json:"idSp"`
	IdSMS				string 	`json:"idSms"`
	IdPD				string 	`json:"idPd"`
	JenjangPendidikan	string 	`json:"jenjangPendidikan"`
	NomorIjazah			string 	`json:"nomorIjazah"`
	TanggalLulus		string 	`json:"tanggalLulus"`
}


// ============================================================================================================================
// Init - Initialize the chaincode
// ============================================================================================================================

func (s *IJZContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	// There is no initial data to put on the state
}


// ============================================================================================================================
// CreateIjz - Issues a new Ijazah Mahasiswa (IJZ) to the world state with given details.
// Inputs - ID, Id SP, Id SMS, Id PD, Jenjang Pendidikan, Nomor Ijazah, Tanggal Lulus
// ============================================================================================================================

func (s *IJZContract) CreateIjz(
	ctx contractapi.TransactionContextInterface,
	id string,
	idSp string,
	idSms string,
	idPd string,
	jenjangPendidikan string,
	nomorIjazah string,
	tanggalLulus string
	) error {

	exists, err := s.IsIjzExists(ctx, id)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("Ijazah (%s) sudah ada.", id)
	}

	ijz := Ijazah{
		ID:      			id,
		IdSP:				idSp,
		IdSMS:				idSms,
		IdPD:				idPd,
		JenjangPendidikan:	jenjangPendidikan,
		NomorIjazah:		nomorIjazah,
		TanggalLulus:		tanggalLulus,
	}
	ijzJSON, err := json.Marshal(ijz)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, ijzJSON)
}


// ============================================================================================================================
// GetIjzById - Get the Ijazah Mahasiswa (IJZ) stored in the world state with given id.
// Inputs - ID
// ============================================================================================================================

func (s *IJZContract) GetIjzById(ctx contractapi.TransactionContextInterface, id string) (*Ijazah, error) {
	ijzJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf("Failed to read from world state: %v", err)
	}
	if ijzJSON == nil {
		return nil, fmt.Errorf("Ijazah (%s) tidak ada.", id)
	}

	var ijz Ijazah
	err = json.Unmarshal(ijzJSON, &ijz)
	if err != nil {
		return nil, err
	}

	return &ijz, nil
}


// ============================================================================================================================
// UpdateIjz - Updates an existing Ijazah Mahasiswa (IJZ) in the world state with provided parameters.
// Inputs - ID, Id SP, Id SMS, Id PD, Jenjang Pendidikan, Nomor Ijazah, Tanggal Lulus
// ============================================================================================================================

func (s *IJZContract) UpdateIjz(
	ctx contractapi.TransactionContextInterface,
	id string,
	idSp string,
	idSms string,
	idPd string,
	jenjangPendidikan string,
	nomorIjazah string,
	tanggalLulus string
	) error {
	exists, err := s.IsIjzExists(ctx, id)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("Ijazah (%s) tidak ada.", id)
	}

	// overwriting original IJZ with new IJZ
	ijz := Ijazah{
		ID:      			id,
		IdSP:				idSp,
		IdSMS:				idSms,
		IdPD:				idPd,
		JenjangPendidikan:	jenjangPendidikan,
		NomorIjazah:		nomorIjazah,
		TanggalLulus:		tanggalLulus,
	}

	ijzJSON, err := json.Marshal(ijz)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, ijzJSON)
}


// ============================================================================================================================
// DeleteIjz - Deletes an given Ijazah Mahasiswa (IJZ) from the world state.
// Inputs - ID
// ============================================================================================================================

func (s *IJZContract) DeleteIjz(ctx contractapi.TransactionContextInterface, id string) error {
	exists, err := s.IsIjzExists(ctx, id)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("Ijazah (%s) tidak ada.", id)
	}

	return ctx.GetStub().DelState(id)
}


// ============================================================================================================================
// IsIjzExists - Returns true when Ijazah Mahasiswa (IJZ) with given ID exists in world state.
// Inputs - ID
// ============================================================================================================================

func (s *IJZContract) IsIjzExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {
	ijzJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return false, fmt.Errorf("Failed to read from world state: %v", err)
	}

	return ijzJSON != nil, nil
}


// ============================================================================================================================
// GetAllIjz - Returns all Ijazah Mahasiswa (IJZ) found in world state.
// No Inputs
// ============================================================================================================================

func (s *IJZContract) GetAllIjz(ctx contractapi.TransactionContextInterface) ([]*Ijazah, error) {
	// range query with empty string for startKey and endKey does an
	// open-ended query of all assets in the chaincode namespace.
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var allIjz []*Ijazah
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var ijz Ijazah
		err = json.Unmarshal(queryResponse.Value, &ijz)
		if err != nil {
			return nil, err
		}
		allIjz = append(allIjz, &ijz)
	}

	return allIjz, nil
}
