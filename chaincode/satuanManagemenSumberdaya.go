package chaincode

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)


// ============================================================================================================================
// Contract Definitions
// ============================================================================================================================

type SMSContract struct {
	contractapi.Contract
}


// ============================================================================================================================
// Asset Definitions - The ledger will store Satuan Managemen Sumberdaya (SMS) data
// ============================================================================================================================

type SatuanManagemenSumberdaya struct {
	ID      			string `json:"id"`
	IdSP				string `json:"idSp"`
	NamaSMS				string `json:"namaSms"`
	JenjangPendidikan	string `json:"jejangPendidikan"`
}


// ============================================================================================================================
// Init - Initialize the chaincode
// ============================================================================================================================

func (s *SMSContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	// There is no initial data to put on the state
}


// ============================================================================================================================
// CreateSms - Issues a new Satuan Managemen Sumberdaya (SMS) to the world state with given details.
// Inputs - ID, Id SP, Nama SMS, Jenjang Pendidikan
// ============================================================================================================================

func (s *SMSContract) CreateSms(ctx contractapi.TransactionContextInterface, id string, idSp string, namaSms string, jejangPendidikan string) error {
	exists, err := s.IsSmsExists(ctx, id)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("Satuan Managemen Sumberdaya (%s) sudah ada.", id)
	}

	sms := SatuanManagemenSumberdaya{
		ID:      			id,
		IdSP:				idSp,
		NamaSMS:			namaSms,
		JenjangPendidikan:	jejangPendidikan,
	}
	smsJSON, err := json.Marshal(sms)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, smsJSON)
}


// ============================================================================================================================
// GetSmsById - Get the Satuan Managemen Sumberdaya (SMS) stored in the world state with given id.
// Inputs - ID
// ============================================================================================================================

func (s *SMSContract) GetSmsById(ctx contractapi.TransactionContextInterface, id string) (*SatuanManagemenSumberdaya, error) {
	smsJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf("Failed to read from world state: %v", err)
	}
	if smsJSON == nil {
		return nil, fmt.Errorf("Satuan Managemen Sumberdaya (%s) tidak ada.", id)
	}

	var sms SatuanManagemenSumberdaya
	err = json.Unmarshal(smsJSON, &sms)
	if err != nil {
		return nil, err
	}

	return &sms, nil
}


// ============================================================================================================================
// UpdateSms - Updates an existing Satuan Managemen Sumberdaya (SMS) in the world state with provided parameters.
// Inputs - ID, Id SP, Nama SMS, Jenjang Pendidikan
// ============================================================================================================================

func (s *SMSContract) UpdateSms(ctx contractapi.TransactionContextInterface, id string, idSp string, namaSms string, jejangPendidikan string) error {
	exists, err := s.IsSmsExists(ctx, id)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("Satuan Managemen Sumberdaya (%s) tidak ada.", id)
	}

	// overwriting original SMS with new SMS
	sms := SatuanManagemenSumberdaya{
		ID:      			id,
		IdSP:				idSp,
		NamaSMS:			namaSms,
		JenjangPendidikan:	jejangPendidikan,
	}
	smsJSON, err := json.Marshal(sms)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, smsJSON)
}


// ============================================================================================================================
// DeleteSms - Deletes an given Satuan Managemen Sumberdaya (SMS) from the world state.
// Inputs - ID
// ============================================================================================================================

func (s *SMSContract) DeleteSms(ctx contractapi.TransactionContextInterface, id string) error {
	exists, err := s.IsSmsExists(ctx, id)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("Satuan Managemen Sumberdaya (%s) tidak ada.", id)
	}

	return ctx.GetStub().DelState(id)
}


// ============================================================================================================================
// IsSmsExists - Returns true when Satuan Managemen Sumberdaya (SMS) with given ID exists in world state.
// Inputs - ID
// ============================================================================================================================

func (s *SMSContract) IsSmsExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {
	smsJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return false, fmt.Errorf("Failed to read from world state: %v", err)
	}

	return smsJSON != nil, nil
}


// ============================================================================================================================
// GetAllSms - Returns all Satuan Managemen Sumberdaya (SMS) found in world state.
// No Inputs
// ============================================================================================================================

func (s *SMSContract) GetAllSms(ctx contractapi.TransactionContextInterface) ([]*SatuanManagemenSumberdaya, error) {
	// range query with empty string for startKey and endKey does an
	// open-ended query of all assets in the chaincode namesmsace.
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var allSms []*SatuanManagemenSumberdaya
	for resultsIterator.HasNext() {
		queryResmsonse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var sms SatuanManagemenSumberdaya
		err = json.Unmarshal(queryResmsonse.Value, &sms)
		if err != nil {
			return nil, err
		}
		allSms = append(allSms, &sms)
	}

	return allSms, nil
}
