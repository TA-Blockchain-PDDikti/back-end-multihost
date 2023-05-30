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

var logger = flogging.MustGetLogger("IJZContract")


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
	ID      			string 			`json:"id"`
	IdSP				string 			`json:"idSp"`
	IdSMS				string 			`json:"idSms"`
	IdPD				string 			`json:"idPd"`
	JenjangPendidikan	string 			`json:"jenjangPendidikan"`
	NomorIjazah			string 			`json:"nomorIjazah"`
	TanggalLulus		string 			`json:"tanggalLulus"`
	ApprovalStep		int 			`json:"approvalStep"`
	Approvers			[]string 		`json:"Approvers"`
}


// ============================================================================================================================
// Error Messages
// ============================================================================================================================

const (
	ER11 string = "ER11-Incorrect number of arguments. Required %d arguments, but you have %d arguments."
	ER12        = "ER12-Ijazah with id '%s' already exists."
	ER13        = "ER13-Ijazah with id '%s' doesn't exist."
	ER14        = "ER14-Ijazah with id '%s' already approved by PTK with id '%s'."
	ER31        = "ER31-Failed to change to world state: %v."
	ER32        = "ER32-Failed to read from world state: %v."
	ER33        = "ER33-Failed to get result from iterator: %v."
	ER34        = "ER34-Failed unmarshaling JSON: %v."
	ER35        = "ER35-Failed parsing string to integer: %v."
	ER36        = "ER36-Failed parsing string to float: %v."
	ER41        = "ER41-Access is not permitted with MSDPID '%s'."
	ER42        = "ER42-Unknown MSPID: '%s'."
)


// ============================================================================================================================
// CreateIjz - Issues a new Ijazah Mahasiswa (IJZ) to the world state with given details.
// Arguments - ID, Id SP, Id SMS, Id PD, Jenjang Pendidikan, Nomor Ijazah, Tanggal Lulus
// ============================================================================================================================

func (s *IJZContract) CreateIjz (ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	logger.Infof("Run CreateIjz function with args: %+q.", args)

	if len(args) != 7 {
		logger.Errorf(ER11, 7, len(args))
		return fmt.Errorf(ER11, 7, len(args))
	}

	id:= args[0]
	idSp:= args[1]
	idSms:= args[2]
	idPd:= args[3]
	jenjangPendidikan:= args[4]
	nomorIjazah:= args[5]
	tanggalLulus:= args[6]

	exists, err := isIjzExists(ctx, id)
	if err != nil {
		return err
	}
	if exists {
		logger.Errorf(ER12, id)
		return fmt.Errorf(ER12, id)
	}

	ijz := Ijazah{
		ID:      			id,
		IdSP:				idSp,
		IdSMS:				idSms,
		IdPD:				idPd,
		JenjangPendidikan:	jenjangPendidikan,
		NomorIjazah:		nomorIjazah,
		TanggalLulus:		tanggalLulus,
		ApprovalStep:		0,
		Approvers:			[]string{},
	}

	ijzJSON, err := json.Marshal(ijz)
	if err != nil {
		return err
	}

	err = ctx.GetStub().PutState(id, ijzJSON)
	if err != nil {
		logger.Errorf(ER31, err)
	}

	return err
}


// ============================================================================================================================
// UpdateIjz - Updates an existing Ijazah Mahasiswa (IJZ) in the world state with provided parameters.
// Arguments - ID, Id SP, Id SMS, Id PD, Jenjang Pendidikan, Nomor Ijazah, Tanggal Lulus
// ============================================================================================================================

func (s *IJZContract) UpdateIjz (ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	logger.Infof("Run UpdateIjz function with args: %+q.", args)

	if len(args) != 7 {
		logger.Errorf(ER11, 7, len(args))
		return fmt.Errorf(ER11, 7, len(args))
	}

	id:= args[0]
	idSp:= args[1]
	idSms:= args[2]
	idPd:= args[3]
	jenjangPendidikan:= args[4]
	nomorIjazah:= args[5]
	tanggalLulus:= args[6]

	exists, err := isIjzExists(ctx, id)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf(ER13, id)
	}

	ijz := Ijazah{
		ID:      			id,
		IdSP:				idSp,
		IdSMS:				idSms,
		IdPD:				idPd,
		JenjangPendidikan:	jenjangPendidikan,
		NomorIjazah:		nomorIjazah,
		TanggalLulus:		tanggalLulus,
		ApprovalStep:		0,
		Approvers:			[]string{},
	}

	ijzJSON, err := json.Marshal(ijz)
	if err != nil {
		return err
	}

	err = ctx.GetStub().PutState(id, ijzJSON)
	if err != nil {
		logger.Errorf(ER31, err)
	}

	return err
}

// ============================================================================================================================
// AddIjzApproval - Add Approval for an existing Ijazah Mahasiswa (IJZ) in the world state.
// Arguments - ID, Approver Id
// ============================================================================================================================

func (s *IJZContract) AddIjzApproval (ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	logger.Infof("Run AddIjzApproval function with args: %+q.", args)

	if len(args) != 2 {
		logger.Errorf(ER11, 2, len(args))
		return fmt.Errorf(ER11, 2, len(args))
	}

	id:= args[0]
	approver:= args[1]

	exists, err := isIjzExists(ctx, id)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf(ER13, id)
	}

	ijz, err := getIjzStateById(ctx, id)
	if err != nil {
		return err
	}

	if contains(ijz.Approvers, approver) {
		return fmt.Errorf(ER14, id, approver)
	}

	ijz.Approvers = append(ijz.Approvers, approver)
	ijz.ApprovalStep = ijz.ApprovalStep + 1

	ijzJSON, err := json.Marshal(ijz)
	if err != nil {
		return err
	}

	err = ctx.GetStub().PutState(id, ijzJSON)
	if err != nil {
		logger.Errorf(ER31, err)
	}

	return err
}


// ============================================================================================================================
// DeleteIjz - Deletes an given Ijazah Mahasiswa (IJZ) from the world state.
// Arguments - ID
// ============================================================================================================================

func (s *IJZContract) DeleteIjz(ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	logger.Infof("Run DeleteIjz function with args: %+q.", args)

	if len(args) != 1 {
		logger.Errorf(ER11, 1, len(args))
		return fmt.Errorf(ER11, 1, len(args))
	}

	id:= args[0]

	exists, err := isIjzExists(ctx, id)
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
// GetAllIjz - Returns all Ijazah Mahasiswa (IJZ) found in world state.
// No Arguments
// ============================================================================================================================

func (s *IJZContract) GetAllIjz(ctx contractapi.TransactionContextInterface) ([]*Ijazah, error) {
	args := ctx.GetStub().GetStringArgs()[1:]

	logger.Infof("Run GetAllIjz function with args: %+q.", args)

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
// GetIjzById - Get the Ijazah Mahasiswa (IJZ) stored in the world state with given id.
// Arguments - ID
// ============================================================================================================================

func (s *IJZContract) GetIjzById (ctx contractapi.TransactionContextInterface) (*Ijazah, error) {
	args := ctx.GetStub().GetStringArgs()[1:]

	logger.Infof("Run GetIjzById function with args: %+q.", args)

	if len(args) != 1 {
		logger.Errorf(ER11, 1, len(args))
		return nil, fmt.Errorf(ER11, 1, len(args))
	}

	id:= args[0]

	ijz, err := getIjzStateById(ctx, id)
	if err != nil {
		return nil, err
	}

	return ijz, nil
}


// ============================================================================================================================
// GetIjzByIdSp - Get the Ijazah Mahasiswa (IJZ) stored in the world state with given IdSp.
// Arguments - idSp
// ============================================================================================================================

func (t *IJZContract) GetIjzByIdSp(ctx contractapi.TransactionContextInterface) ([]*Ijazah, error) {
	args := ctx.GetStub().GetStringArgs()[1:]

	logger.Infof("Run GetIjzByIdSp function with args: %+q.", args)

	if len(args) != 1 {
		logger.Errorf(ER11, 1, len(args))
		return nil, fmt.Errorf(ER11, 1, len(args))
	}

	idSp:= args[0]

	queryString := fmt.Sprintf(`{"selector":{"idSp":"%s"}}`, idSp)
	return getQueryResultForQueryString(ctx, queryString)
}

// ============================================================================================================================
// GetIjzByIdSms - Get the Ijazah Mahasiswa (IJZ) stored in the world state with given IdSms.
// Arguments - idSms
// ============================================================================================================================

func (t *IJZContract) GetIjzByIdSms(ctx contractapi.TransactionContextInterface) ([]*Ijazah, error) {
	args := ctx.GetStub().GetStringArgs()[1:]

	logger.Infof("Run GetIjzByIdSms function with args: %+q.", args)

	if len(args) != 1 {
		logger.Errorf(ER11, 1, len(args))
		return nil, fmt.Errorf(ER11, 1, len(args))
	}

	idSms:= args[0]

	queryString := fmt.Sprintf(`{"selector":{"idSms":"%s"}}`, idSms)
	return getQueryResultForQueryString(ctx, queryString)
}


// ============================================================================================================================
// GetIjzByIdPd - Get the Ijazah Mahasiswa (IJZ) stored in the world state with given IdPd.
// Arguments - idPd
// ============================================================================================================================

func (t *IJZContract) GetIjzByIdPd(ctx contractapi.TransactionContextInterface) ([]*Ijazah, error) {
	args := ctx.GetStub().GetStringArgs()[1:]

	logger.Infof("Run GetIjzByIdPd function with args: %+q.", args)

	if len(args) != 1 {
		logger.Errorf(ER11, 1, len(args))
		return nil, fmt.Errorf(ER11, 1, len(args))
	}

	idPd:= args[0]

	queryString := fmt.Sprintf(`{"selector":{"idPd":"%s"}}`, idPd)
	return getQueryResultForQueryString(ctx, queryString)
}


// ============================================================================================================================
// GetIjzLastTxIdById - Get the Ijazah Mahasiswa (IJZ) stored in the world state with given IdPd.
// Arguments - idPd
// ============================================================================================================================

func (t *IJZContract) GetIjzAddApprovalTxIdById(ctx contractapi.TransactionContextInterface) ([]string, error) {
	args := ctx.GetStub().GetStringArgs()[1:]

	logger.Infof("Run GetIjzLastTxIdById function with args: %+q.", args)

	if len(args) != 1 {
		logger.Errorf(ER11, 1, len(args))
		return []string{}, fmt.Errorf(ER11, 1, len(args))
	}

	id:= args[0]

	resultsIterator, err := ctx.GetStub().GetHistoryForKey(id)
	if err != nil {
		return []string{}, fmt.Errorf(err.Error())
	}
	defer resultsIterator.Close()

	txIdList := []string{}

	for resultsIterator.HasNext() {
		response, err := resultsIterator.Next()
		if err != nil {
			return []string{}, fmt.Errorf(err.Error())
		}

		var ijz Ijazah
		err = json.Unmarshal([]byte(response.Value), &ijz)
		if err != nil {
			return nil, fmt.Errorf(ER34, err)
		}

		if (ijz.ApprovalStep == 0) {
			break
		}

		txIdList = append([]string{response.TxId}, txIdList[0:]...)
	}

	return txIdList, nil
}


// ============================================================================================================================
// isIjzExists - Returns true when Ijazah Mahasiswa (IJZ) with given ID exists in world state.
// ============================================================================================================================

func isIjzExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {
	logger.Infof("Run isIjzExists function with id: '%s'.", id)

	ijzJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		logger.Errorf(ER32, err)
		return false, fmt.Errorf(ER32, err)
	}

	return ijzJSON != nil, nil
}


// ============================================================================================================================
// getIjzStateById - Get IJZ state with given id.
// ============================================================================================================================

func getIjzStateById(ctx contractapi.TransactionContextInterface, id string) (*Ijazah, error) {
	logger.Infof("Run getIjzStateById function with id: '%s'.", id)

	ijzJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf(ER32, err)
	}
	if ijzJSON == nil {
		return nil, fmt.Errorf(ER13, id)
	}

	var ijz Ijazah
	err = json.Unmarshal(ijzJSON, &ijz)
	if err != nil {
		return nil, fmt.Errorf(ER34, err)
	}

	return &ijz, nil
}


// ============================================================================================================================
// constructQueryResponseFromIterator - Constructs a slice of assets from the resultsIterator.
// ============================================================================================================================

func constructQueryResponseFromIterator(resultsIterator shim.StateQueryIteratorInterface) ([]*Ijazah, error) {
	logger.Infof("Run constructQueryResponseFromIterator function.")

	var ijzList []*Ijazah

	for resultsIterator.HasNext() {
		queryResult, err := resultsIterator.Next()
		if err != nil {
			return nil, fmt.Errorf(ER33, err)
		}

		var ijz Ijazah
		err = json.Unmarshal(queryResult.Value, &ijz)
		if err != nil {
			return nil, fmt.Errorf(ER34, err)
		}
		ijzList = append(ijzList, &ijz)
	}

	return ijzList, nil
}


// ============================================================================================================================
// getQueryResultForQueryString - Get a query result from query string
// ============================================================================================================================

func getQueryResultForQueryString(ctx contractapi.TransactionContextInterface, queryString string) ([]*Ijazah, error) {
	logger.Infof("Run getQueryResultForQueryString function with queryString: '%s'.", queryString)

	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, fmt.Errorf(ER32, err)
	}
	defer resultsIterator.Close()

	return constructQueryResponseFromIterator(resultsIterator)
}


// ============================================================================================================================
// contains - Check if the slice contains the given value
// ============================================================================================================================

func contains(elems []string, v string) bool {
    for _, s := range elems {
        if v == s {
            return true
        }
    }
    return false
}
