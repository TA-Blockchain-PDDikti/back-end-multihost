package chaincode

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)


// ============================================================================================================================
// Contract Definitions
// ============================================================================================================================

type NMHSContract struct {
	contractapi.Contract
}


// ============================================================================================================================
// Asset Definitions - The ledger will store Nilai Mahasiswa (NMHS) data
// ============================================================================================================================

type NilaiMahasiswa struct {
	ID      			string 	`json:"id"`
	IdKLS				string 	`json:"idKls"`
	IdPTK				string 	`json:"idPtk"`
	IdPD				string 	`json:"idPd"`
	NilaiAngka			float64 `json:"nilaiAngka"`
	NilaiHuruf			string 	`json:"nilaiHuruf"`
	NilaiIndex			float64 `json:"nilaiIndex"`
	DibuatPada			uint64 	`json:"dibuatPada"`
	SignatureNMHS		string 	`json:"signatureNmhs"`
}


// ============================================================================================================================
// Init - Initialize the chaincode
// ============================================================================================================================

func (s *NMHSContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	// There is no initial data to put on the state
}


// ============================================================================================================================
// CreateNmhs - Issues a new Nilai Mahasiswa (NMHS) to the world state with given details.
// Inputs - ID, Id KLS, Id PTK, Id PD, Nilai Angka, Nilai Huruf, Nilai Index, DibuatPada
// ============================================================================================================================

func (s *NMHSContract) CreateNmhs(
	ctx contractapi.TransactionContextInterface,
	id string,
	idKls string,
	idPtk string,
	idPd string,
	nilaiAngka float64,
	nilaiHuruf string,
	nilaiIndex float64,
	dibuatPada uint64
	) error {

	exists, err := s.IsNmhsExists(ctx, id)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("Nilai Mahasiswa (%s) sudah ada.", id)
	}

	nmhs := NilaiMahasiswa{
		ID:      			id,
		IdKLS:				idKls,
		IdPTK:				idPtk,
		IdPD:				idPd,
		NilaiAngka:			nilaiAngka,
		NilaiHuruf:			nilaiHuruf,
		NilaiIndex:			nilaiIndex,
		DibuatPada:			dibuatPada,
	}
	nmhsJSON, err := json.Marshal(nmhs)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, nmhsJSON)
}


// ============================================================================================================================
// GetNmhsById - Get the Nilai Mahasiswa (NMHS) stored in the world state with given id.
// Inputs - ID
// ============================================================================================================================

func (s *NMHSContract) GetNmhsById(ctx contractapi.TransactionContextInterface, id string) (*NilaiMahasiswa, error) {
	nmshJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf("Failed to read from world state: %v", err)
	}
	if nmshJSON == nil {
		return nil, fmt.Errorf("Nilai Mahasiswa (%s) tidak ada.", id)
	}

	var nmsh NilaiMahasiswa
	err = json.Unmarshal(nmshJSON, &nmsh)
	if err != nil {
		return nil, err
	}

	return &nmsh, nil
}


// ============================================================================================================================
// UpdateNmhs - Updates an existing Nilai Mahasiswa (NMHS) in the world state with provided parameters.
// Inputs - ID, Id SMS, Nama MK, SKS, Jenjang Pendidikan
// ============================================================================================================================

func (s *NMHSContract) UpdateNmhs(
	ctx contractapi.TransactionContextInterface,
	id string,
	idSms string,
	namaNmhs int,
	sks string,
	jenjangPendidikan string,
	) error {
	exists, err := s.IsNmhsExists(ctx, id)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("Nilai Mahasiswa (%s) tidak ada.", id)
	}

	// overwriting original NMHS with new NMHS
	nmhs := NilaiMahasiswa{
		ID:      			id,
		IdKLS:				idKls,
		IdPTK:				idPtk,
		IdPD:				idPd,
		NilaiAngka:			nilaiAngka,
		NilaiHuruf:			nilaiHuruf,
		NilaiIndex:			nilaiIndex,
		DibuatPada:			dibuatPada,
	}

	nmhsJSON, err := json.Marshal(nmhs)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, nmhsJSON)
}


// ============================================================================================================================
// DeleteNmhs - Deletes an given Nilai Mahasiswa (NMHS) from the world state.
// Inputs - ID
// ============================================================================================================================

func (s *NMHSContract) DeleteNmhs(ctx contractapi.TransactionContextInterface, id string) error {
	exists, err := s.IsNmhsExists(ctx, id)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("Nilai Mahasiswa (%s) tidak ada.", id)
	}

	return ctx.GetStub().DelState(id)
}


// ============================================================================================================================
// IsNmhsExists - Returns true when Nilai Mahasiswa (NMHS) with given ID exists in world state.
// Inputs - ID
// ============================================================================================================================

func (s *NMHSContract) IsNmhsExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {
	nmhsJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return false, fmt.Errorf("Failed to read from world state: %v", err)
	}

	return nmhsJSON != nil, nil
}


// ============================================================================================================================
// GetAllNmhs - Returns all Nilai Mahasiswa (NMHS) found in world state.
// No Inputs
// ============================================================================================================================

func (s *NMHSContract) GetAllNmhs(ctx contractapi.TransactionContextInterface) ([]*NilaiMahasiswa, error) {
	// range query with empty string for startKey and endKey does an
	// open-ended query of all assets in the chaincode namespace.
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var allNmhs []*NilaiMahasiswa
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var nmhs NilaiMahasiswa
		err = json.Unmarshal(queryResponse.Value, &nmhs)
		if err != nil {
			return nil, err
		}
		allNmhs = append(allNmhs, &nmhs)
	}

	return allNmhs, nil
}
