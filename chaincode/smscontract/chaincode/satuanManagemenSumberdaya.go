package chaincode

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric/common/flogging"
	"github.com/hyperledger/fabric-chaincode-go/shim"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// ============================================================================================================================
// Logger
// ============================================================================================================================

var logger = flogging.MustGetLogger("SMSContract")


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
// Error Messages
// ============================================================================================================================

const (
	ER11 string = "ER11-Incorrect number of arguments. Required %d arguments, but you have %d arguments."
	ER12        = "ER12-SatuanManagemenSumberdaya with id '%s' already exists."
	ER13        = "ER13-SatuanManagemenSumberdaya with id '%s' doesn't exist."
	ER31        = "ER31-Failed to change to world state: %v."
	ER32        = "ER32-Failed to read from world state: %v."
	ER33        = "ER33-Failed to get result from iterator: %v."
	ER34        = "ER34-Failed unmarshaling JSON: %v."
	ER41        = "ER41-Access is not permitted with MSDPID '%s'."
	ER42        = "ER42-Unknown MSPID: '%s'."
)


// ============================================================================================================================
// CreateSms - Issues a new Satuan Managemen Sumberdaya (SMS) to the world state with given details.
// Arguments - ID, Id SP, Nama SMS, Jenjang Pendidikan
// ============================================================================================================================

func (s *SMSContract) CreateSms(ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	logger.Infof("Run CreateSms function with args: %+q.", args)

	if len(args) != 4 {
		logger.Errorf(ER11, 4, len(args))
		return fmt.Errorf(ER11, 4, len(args))
	}

	id:= args[0]
	idSp:= args[1]
	namaSms:= args[2]
	jejangPendidikan:= args[3]

	exists, err := isSmsExists(ctx, id)
	if err != nil {
		return err
	}
	if exists {
		logger.Errorf(ER12, id)
		return fmt.Errorf(ER12, id)
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

	err = ctx.GetStub().PutState(id, smsJSON)
	if err != nil {
		logger.Errorf(ER31, err)
	}

	return err
}


// ============================================================================================================================
// UpdateSms - Updates an existing Satuan Managemen Sumberdaya (SMS) in the world state with provided parameters.
// Arguments - ID, Id SP, Nama SMS, Jenjang Pendidikan
// ============================================================================================================================

func (s *SMSContract) UpdateSms(ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	logger.Infof("Run UpdateSms function with args: %+q.", args)

	if len(args) != 4 {
		logger.Errorf(ER11, 4, len(args))
		return fmt.Errorf(ER11, 4, len(args))
	}

	id:= args[0]
	idSp:= args[1]
	namaSms:= args[2]
	jejangPendidikan:= args[3]

	exists, err := isSmsExists(ctx, id)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf(ER13, id)
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

	err = ctx.GetStub().PutState(id, smsJSON)
	if err != nil {
		logger.Errorf(ER31, err)
	}

	return err
}


// ============================================================================================================================
// DeleteSms - Deletes an given Satuan Managemen Sumberdaya (SMS) from the world state.
// Arguments - ID
// ============================================================================================================================

func (s *SMSContract) DeleteSms(ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	logger.Infof("Run DeleteSms function with args: %+q.", args)

	if len(args) != 1 {
		logger.Errorf(ER11, 1, len(args))
		return fmt.Errorf(ER11, 1, len(args))
	}

	id:= args[0]

	exists, err := isSmsExists(ctx, id)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf(ER13, id)
	}

	err = ctx.GetStub().DelState(id)
	if err != nil {
		logger.Errorf(ER31, err)
	}

	return err
}


// ============================================================================================================================
// GetAllSms - Returns all Satuan Managemen Sumberdaya (SMS) found in world state.
// No Arguments
// ============================================================================================================================

func (s *SMSContract) GetAllSms(ctx contractapi.TransactionContextInterface) ([]*SatuanManagemenSumberdaya, error) {
	args := ctx.GetStub().GetStringArgs()[1:]

	logger.Infof("Run GetAllSms function with args: %+q.", args)

	if len(args) != 0 {
		logger.Errorf(ER11, 0, len(args))
		return nil, fmt.Errorf(ER11, 0, len(args))
	}

	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, fmt.Errorf(ER32, err)
	}
	defer resultsIterator.Close()

	return constructQueryResponseFromIterator(resultsIterator)
}


// ============================================================================================================================
// GetSmsById - Get the Satuan Managemen Sumberdaya (SMS) stored in the world state with given id.
// Arguments - ID
// ============================================================================================================================

func (s *SMSContract) GetSmsById(ctx contractapi.TransactionContextInterface) (*SatuanManagemenSumberdaya, error) {
	args := ctx.GetStub().GetStringArgs()[1:]

	logger.Infof("Run GetSmsById function with args: %+q.", args)

	if len(args) != 1 {
		logger.Errorf(ER11, 1, len(args))
		return nil, fmt.Errorf(ER11, 1, len(args))
	}

	id:= args[0]

	smsJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf(ER32, err)
	}
	if smsJSON == nil {
		return nil, fmt.Errorf(ER13, id)
	}

	var sms SatuanManagemenSumberdaya
	err = json.Unmarshal(smsJSON, &sms)
	if err != nil {
		return nil, fmt.Errorf(ER34, err)
	}

	return &sms, nil
}


// ============================================================================================================================
// GetSmsByIdSp - Get the Satuan Managemen Sumberdaya (SMS) stored in the world state with given IdSp.
// Arguments - idSp
// ============================================================================================================================

func (t *SMSContract) GetSmsByIdSp(ctx contractapi.TransactionContextInterface) ([]*SatuanManagemenSumberdaya, error) {
	args := ctx.GetStub().GetStringArgs()[1:]

	logger.Infof("Run GetSmsByIdSp function with args: %+q.", args)

	if len(args) != 1 {
		logger.Errorf(ER11, 1, len(args))
		return nil, fmt.Errorf(ER11, 1, len(args))
	}

	idSp:= args[0]

	queryString := fmt.Sprintf(`{"selector":{"idSp":"%s"}}`, idSp)
	return getQueryResultForQueryString(ctx, queryString)
}


// ============================================================================================================================
// isSmsExists - Returns true when Satuan Managemen Sumberdaya (SMS) with given ID exists in world state.
// ============================================================================================================================

func isSmsExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {
	logger.Infof("Run isSmsExists function with id: '%s'.", id)

	smsJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		logger.Errorf(ER32, err)
		return false, fmt.Errorf(ER32, err)
	}

	return smsJSON != nil, nil
}


// ============================================================================================================================
// constructQueryResponseFromIterator - Constructs a slice of assets from the resultsIterator.
// ============================================================================================================================

func constructQueryResponseFromIterator(resultsIterator shim.StateQueryIteratorInterface) ([]*SatuanManagemenSumberdaya, error) {
	logger.Infof("Run constructQueryResponseFromIterator function.")

	var smsList []*SatuanManagemenSumberdaya

	for resultsIterator.HasNext() {
		queryResult, err := resultsIterator.Next()
		if err != nil {
			return nil, fmt.Errorf(ER33, err)
		}

		var sms SatuanManagemenSumberdaya
		err = json.Unmarshal(queryResult.Value, &sms)
		if err != nil {
			return nil, fmt.Errorf(ER34, err)
		}
		smsList = append(smsList, &sms)
	}

	return smsList, nil
}


// ============================================================================================================================
// getQueryResultForQueryString - Get a query result from query string
// ============================================================================================================================

func getQueryResultForQueryString(ctx contractapi.TransactionContextInterface, queryString string) ([]*SatuanManagemenSumberdaya, error) {
	logger.Infof("Run getQueryResultForQueryString function with queryString: '%s'.", queryString)

	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, fmt.Errorf(ER32, err)
	}
	defer resultsIterator.Close()

	return constructQueryResponseFromIterator(resultsIterator)
}
