package chaincode

import (
	"encoding/json"
	"fmt"
	"strconv"
	"time"

	"github.com/hyperledger/fabric/common/flogging"
	"github.com/hyperledger/fabric-chaincode-go/shim"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// ============================================================================================================================
// Logger
// ============================================================================================================================

var logger = flogging.MustGetLogger("TSKContract")


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
	ID      			string 			`json:"id"`
	IdSP				string 			`json:"idSp"`
	IdSMS				string 			`json:"idSms"`
	IdPD				string 			`json:"idPd"`
	JenjangPendidikan	string 			`json:"jenjangPendidikan"`
	TotalMutu			int 			`json:"totalMutu"`
	TotalSKS			int 			`json:"totalSks"`
	IPK					float64			`json:"ipk"`
	SignStep			int 			`json:"signStep"`
	Signatures			[]SignatureTSK 	`json:"signatures"`
}

type SignatureTSK struct {
	Sign			string 	`json:"sign"`
	SignerId		string 	`json:"signerId"`
	SignTime		string 	`json:"signTime"`
}


// ============================================================================================================================
// Error Messages
// ============================================================================================================================

const (
	ER11 string = "ER11-Incorrect number of arguments. Required %d arguments, but you have %d arguments."
	ER12        = "ER12-Transkrip with id '%s' already exists."
	ER13        = "ER13-Transkrip with id '%s' doesn't exist."
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
// CreateTsk - Issues a new Transkrip Mahasiswa (TSK) to the world state with given details.
// Arguments - ID, Id SP, Id SMS, Id PD, Jenjang Pendidikan, Total Mutu, Total SKS, IPK
// ============================================================================================================================

func (s *TSKContract) CreateTsk (ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	logger.Infof("Run CreateTsk function with args: %+q.", args)

	if len(args) != 8 {
		logger.Errorf(ER11, 8, len(args))
		return fmt.Errorf(ER11, 8, len(args))
	}

	id:= args[0]
	idSp:= args[1]
	idSms:= args[2]
	idPd:= args[3]
	jenjangPendidikan:= args[4]
	totalMutuStr:= args[5]
	totalSksStr:= args[6]
	ipkStr:= args[7]

	exists, err := isTskExists(ctx, id)
	if err != nil {
		return err
	}
	if exists {
		logger.Errorf(ER12, id)
		return fmt.Errorf(ER12, id)
	}

	ipk, err := strconv.ParseFloat(ipkStr, 64)
	if err != nil {
		logger.Errorf(ER36, id)
		return fmt.Errorf(ER36, id)
	}

	totalMutu, err := strconv.Atoi(totalMutuStr)
	if err != nil {
		logger.Errorf(ER35, id)
		return fmt.Errorf(ER35, id)
	}

	totalSks, err := strconv.Atoi(totalSksStr)
	if err != nil {
		logger.Errorf(ER35, id)
		return fmt.Errorf(ER35, id)
	}

	tsk := Transkrip{
		ID:      			id,
		IdSP:				idSp,
		IdSMS:				idSms,
		IdPD:				idPd,
		JenjangPendidikan:	jenjangPendidikan,
		TotalMutu:			totalMutu,
		TotalSKS:			totalSks,
		IPK:				ipk,
		SignStep:			0,
		Signatures:			[]SignatureTSK{},
	}

	tskJSON, err := json.Marshal(tsk)
	if err != nil {
		return err
	}

	err = ctx.GetStub().PutState(id, tskJSON)
	if err != nil {
		logger.Errorf(ER31, err)
	}

	return err
}


// ============================================================================================================================
// UpdateTsk - Updates an existing Transkrip Mahasiswa (TSK) in the world state with provided parameters.
// Arguments - ID, Id SP, Id SMS, Id PD, Jenjang Pendidikan, Total Mutu, Total SKS, IPK
// ============================================================================================================================

func (s *TSKContract) UpdateTsk (ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	logger.Infof("Run UpdateTsk function with args: %+q.", args)

	if len(args) != 8 {
		logger.Errorf(ER11, 8, len(args))
		return fmt.Errorf(ER11, 8, len(args))
	}

	id:= args[0]
	idSp:= args[1]
	idSms:= args[2]
	idPd:= args[3]
	jenjangPendidikan:= args[4]
	totalMutuStr:= args[5]
	totalSksStr:= args[6]
	ipkStr:= args[7]

	exists, err := isTskExists(ctx, id)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf(ER13, id)
	}

	ipk, err := strconv.ParseFloat(ipkStr, 64)
	if err != nil {
		logger.Errorf(ER36, id)
		return fmt.Errorf(ER36, id)
	}

	totalMutu, err := strconv.Atoi(totalMutuStr)
	if err != nil {
		logger.Errorf(ER35, id)
		return fmt.Errorf(ER35, id)
	}

	totalSks, err := strconv.Atoi(totalSksStr)
	if err != nil {
		logger.Errorf(ER35, id)
		return fmt.Errorf(ER35, id)
	}

	tsk := Transkrip{
		ID:      			id,
		IdSP:				idSp,
		IdSMS:				idSms,
		IdPD:				idPd,
		JenjangPendidikan:	jenjangPendidikan,
		TotalMutu:			totalMutu,
		TotalSKS:			totalSks,
		IPK:				ipk,
		SignStep:			0,
		Signatures:			[]SignatureTSK{},
	}

	tskJSON, err := json.Marshal(tsk)
	if err != nil {
		return err
	}

	err = ctx.GetStub().PutState(id, tskJSON)
	if err != nil {
		logger.Errorf(ER31, err)
	}

	return err
}

// ============================================================================================================================
// AddTskSignature - Add Signature for an existing Transkrip Mahasiswa (TSK) in the world state.
// Arguments - ID, Sign, Signer ID
// ============================================================================================================================

func (s *TSKContract) AddTskSignature (ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	logger.Infof("Run AddTskSignature function with args: %+q.", args)

	if len(args) != 3 {
		logger.Errorf(ER11, 3, len(args))
		return fmt.Errorf(ER11, 3, len(args))
	}

	id:= args[0]
	sign:= args[1]
	signerId:= args[2]

	exists, err := isTskExists(ctx, id)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf(ER13, id)
	}

	tsk, err := getTskStateById(ctx, id)
	if err != nil {
		return err
	}

	loc, _ := time.LoadLocation("Asia/Jakarta")

	signature := SignatureTSK{
		Sign:			sign,
		SignerId:		signerId,
		SignTime:		time.Now().In(loc).Format(time.RFC822),
	}

	tsk.Signatures = append(tsk.Signatures, signature)
	tsk.SignStep = tsk.SignStep + 1

	tskJSON, err := json.Marshal(tsk)
	if err != nil {
		return err
	}

	err = ctx.GetStub().PutState(id, tskJSON)
	if err != nil {
		logger.Errorf(ER31, err)
	}

	return err
}


// ============================================================================================================================
// DeleteTsk - Deletes an given Transkrip Mahasiswa (TSK) from the world state.
// Arguments - ID
// ============================================================================================================================

func (s *TSKContract) DeleteTsk(ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	logger.Infof("Run DeleteTsk function with args: %+q.", args)

	if len(args) != 1 {
		logger.Errorf(ER11, 1, len(args))
		return fmt.Errorf(ER11, 1, len(args))
	}

	id:= args[0]

	exists, err := isTskExists(ctx, id)
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
// GetAllTsk - Returns all Transkrip Mahasiswa (TSK) found in world state.
// No Arguments
// ============================================================================================================================

func (s *TSKContract) GetAllTsk(ctx contractapi.TransactionContextInterface) ([]*Transkrip, error) {
	args := ctx.GetStub().GetStringArgs()[1:]

	logger.Infof("Run GetAllTsk function with args: %+q.", args)

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
// GetTskById - Get the Transkrip Mahasiswa (TSK) stored in the world state with given id.
// Arguments - ID
// ============================================================================================================================

func (s *TSKContract) GetTskById (ctx contractapi.TransactionContextInterface) (*Transkrip, error) {
	args := ctx.GetStub().GetStringArgs()[1:]

	logger.Infof("Run GetTskById function with args: %+q.", args)

	if len(args) != 1 {
		logger.Errorf(ER11, 1, len(args))
		return nil, fmt.Errorf(ER11, 1, len(args))
	}

	id:= args[0]

	tsk, err := getTskStateById(ctx, id)
	if err != nil {
		return nil, err
	}

	return tsk, nil
}


// ============================================================================================================================
// GetTskByIdSp - Get the Transkrip Mahasiswa (TSK) stored in the world state with given IdSp.
// Arguments - idSp
// ============================================================================================================================

func (t *TSKContract) GetTskByIdSp(ctx contractapi.TransactionContextInterface) ([]*Transkrip, error) {
	args := ctx.GetStub().GetStringArgs()[1:]

	logger.Infof("Run GetTskByIdSp function with args: %+q.", args)

	if len(args) != 1 {
		logger.Errorf(ER11, 1, len(args))
		return nil, fmt.Errorf(ER11, 1, len(args))
	}

	idSp:= args[0]

	queryString := fmt.Sprintf(`{"selector":{"idSp":"%s"}}`, idSp)
	return getQueryResultForQueryString(ctx, queryString)
}


// ============================================================================================================================
// GetTskByIdSms - Get the Transkrip Mahasiswa (TSK) stored in the world state with given IdSms.
// Arguments - idSms
// ============================================================================================================================

func (t *TSKContract) GetTskByIdSms(ctx contractapi.TransactionContextInterface) ([]*Transkrip, error) {
	args := ctx.GetStub().GetStringArgs()[1:]

	logger.Infof("Run GetTskByIdSms function with args: %+q.", args)

	if len(args) != 1 {
		logger.Errorf(ER11, 1, len(args))
		return nil, fmt.Errorf(ER11, 1, len(args))
	}

	idSms:= args[0]

	queryString := fmt.Sprintf(`{"selector":{"idSms":"%s"}}`, idSms)
	return getQueryResultForQueryString(ctx, queryString)
}


// ============================================================================================================================
// GetTskByIdPd - Get the Transkrip Mahasiswa (TSK) stored in the world state with given IdPd.
// Arguments - idPd
// ============================================================================================================================

func (t *TSKContract) GetTskByIdPd(ctx contractapi.TransactionContextInterface) ([]*Transkrip, error) {
	args := ctx.GetStub().GetStringArgs()[1:]

	logger.Infof("Run GetTskByIdPd function with args: %+q.", args)

	if len(args) != 1 {
		logger.Errorf(ER11, 1, len(args))
		return nil, fmt.Errorf(ER11, 1, len(args))
	}

	idPd:= args[0]

	queryString := fmt.Sprintf(`{"selector":{"idPd":"%s"}}`, idPd)
	return getQueryResultForQueryString(ctx, queryString)
}


// ============================================================================================================================
// isTskExists - Returns true when Transkrip Mahasiswa (TSK) with given ID exists in world state.
// ============================================================================================================================

func isTskExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {
	logger.Infof("Run isTskExists function with id: '%s'.", id)

	tskJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		logger.Errorf(ER32, err)
		return false, fmt.Errorf(ER32, err)
	}

	return tskJSON != nil, nil
}


// ============================================================================================================================
// getTskStateById - Get TSK state with given id.
// ============================================================================================================================

func getTskStateById(ctx contractapi.TransactionContextInterface, id string) (*Transkrip, error) {
	logger.Infof("Run getTskStateById function with id: '%s'.", id)

	npdJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf(ER32, err)
	}
	if npdJSON == nil {
		return nil, fmt.Errorf(ER13, id)
	}

	var npd Transkrip
	err = json.Unmarshal(npdJSON, &npd)
	if err != nil {
		return nil, fmt.Errorf(ER34, err)
	}

	return &npd, nil
}


// ============================================================================================================================
// constructQueryResponseFromIterator - Constructs a slice of assets from the resultsIterator.
// ============================================================================================================================

func constructQueryResponseFromIterator(resultsIterator shim.StateQueryIteratorInterface) ([]*Transkrip, error) {
	logger.Infof("Run constructQueryResponseFromIterator function.")

	var tskList []*Transkrip

	for resultsIterator.HasNext() {
		queryResult, err := resultsIterator.Next()
		if err != nil {
			return nil, fmt.Errorf(ER33, err)
		}

		var tsk Transkrip
		err = json.Unmarshal(queryResult.Value, &tsk)
		if err != nil {
			return nil, fmt.Errorf(ER34, err)
		}
		tskList = append(tskList, &tsk)
	}

	return tskList, nil
}


// ============================================================================================================================
// getQueryResultForQueryString - Get a query result from query string
// ============================================================================================================================

func getQueryResultForQueryString(ctx contractapi.TransactionContextInterface, queryString string) ([]*Transkrip, error) {
	logger.Infof("Run getQueryResultForQueryString function with queryString: '%s'.", queryString)

	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, fmt.Errorf(ER32, err)
	}
	defer resultsIterator.Close()

	return constructQueryResponseFromIterator(resultsIterator)
}
