package chaincode

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)


// ============================================================================================================================
// Contract Definitions
// ============================================================================================================================

type KLSContract struct {
	contractapi.Contract
}


// ============================================================================================================================
// Asset Definitions - The ledger will store Kelas Kuliah (KLS) data
// ============================================================================================================================

type KelasKuliah struct {
	ID      			string 		`json:"id"`
	IdSMS				string 		`json:"idSms"`
	IdMK				string 		`json:"idKls"`
	NamaKLS				string 		`json:"namaKls"`
	Semester			string 		`json:"semester"`
	SKS					int 		`json:"sks"`
	ListPtk				[]string 	`json:"listPtk"`
	ListPd				[]string 	`json:"listPd"`
}


// ============================================================================================================================
// Init - Initialize the chaincode
// ============================================================================================================================

func (s *KLSContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	// There is no initial data to put on the state
}


// ============================================================================================================================
// CreateKls - Issues a new Kelas Kuliah (KLS) to the world state with given details.
// Inputs - ID, Id SMS, Id MK, Nama KLS, Semester, SKS
// ============================================================================================================================

func (s *KLSContract) CreateKls(
	ctx contractapi.TransactionContextInterface,
	id string,
	idSms string,
	idMk string,
	namaKls string,
	semeter string,
	sks int,
	) error {

	exists, err := s.IsKlsExists(ctx, id)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("Kelas Kuliah (%s) sudah ada.", id)
	}

	kls := KelasKuliah{
		ID:      			id,
		IdSMS:				idSms,
		IdMK:				idMk,
		NamaMK:				namaKls,
		Semester:			semester,
		SKS:				sks,
		ListPtk:			[]String{},
		ListPd:				[]String{},
	}
	klsJSON, err := json.Marshal(kls)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, klsJSON)
}


// ============================================================================================================================
// GetKlsById - Get the Kelas Kuliah (KLS) stored in the world state with given id.
// Inputs - ID
// ============================================================================================================================

func (s *KLSContract) GetKlsById(ctx contractapi.TransactionContextInterface, id string) (*KelasKuliah, error) {
	klsJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf("Failed to read from world state: %v", err)
	}
	if klsJSON == nil {
		return nil, fmt.Errorf("Kelas Kuliah (%s) tidak ada.", id)
	}

	var kls KelasKuliah
	err = json.Unmarshal(klsJSON, &kls)
	if err != nil {
		return nil, err
	}

	return &kls, nil
}


// ============================================================================================================================
// UpdateKls - Updates an existing Kelas Kuliah (KLS) in the world state with provided parameters.
// Inputs - ID, Id SMS, Nama MK, SKS, Jenjang Pendidikan
// ============================================================================================================================

func (s *KLSContract) UpdateKls(
	ctx contractapi.TransactionContextInterface,
	id string,
	idSms string,
	idMk string,
	namaKls string,
	semeter string,
	sks int,
	) error {

	kls, err := s.GetKlsById(ctx, id)
	if err != nil {
		return err
	}

	kls.IdSMS = idSms
	kls.IdMK = idMk
	kls.NamaKls = namaKls
	kls.Semester = semester
	kls.SKS = sks

	klsJSON, err := json.Marshal(kls)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, klsJSON)
}


// ============================================================================================================================
// DeleteKls - Deletes an given Kelas Kuliah (KLS) from the world state.
// Inputs - ID
// ============================================================================================================================

func (s *KLSContract) DeleteKls(ctx contractapi.TransactionContextInterface, id string) error {
	exists, err := s.IsKlsExists(ctx, id)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("Kelas Kuliah (%s) tidak ada.", id)
	}

	return ctx.GetStub().DelState(id)
}


// ============================================================================================================================
// IsKlsExists - Returns true when Kelas Kuliah (KLS) with given ID exists in world state.
// Inputs - ID
// ============================================================================================================================

func (s *KLSContract) IsKlsExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {
	mkJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return false, fmt.Errorf("Failed to read from world state: %v", err)
	}

	return mkJSON != nil, nil
}


// ============================================================================================================================
// GetAllKls - Returns all Kelas Kuliah (KLS) found in world state.
// No Inputs
// ============================================================================================================================

func (s *KLSContract) GetAllKls(ctx contractapi.TransactionContextInterface) ([]*KelasKuliah, error) {
	// range query with empty string for startKey and endKey does an
	// open-ended query of all assets in the chaincode namespace.
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var allKls []*KelasKuliah
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var kls KelasKuliah
		err = json.Unmarshal(queryResponse.Value, &kls)
		if err != nil {
			return nil, err
		}
		allKls = append(allKls, &kls)
	}

	return allKls, nil
}
