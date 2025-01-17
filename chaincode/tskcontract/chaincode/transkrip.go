package chaincode

import (
	"encoding/json"
	"fmt"
	"strconv"

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
	TotalMutu			float64			`json:"totalMutu"`
	TotalSKS			int 			`json:"totalSks"`
	IPK					float64			`json:"ipk"`
	RemainingApprover	int 			`json:"remainingApprover"`
	Approvers			[]string 		`json:"Approvers"`
}


// ============================================================================================================================
// Struct Definitions - Satuan Pendidikan (SP)
// ============================================================================================================================

type SatuanPendidikan struct {
	ID      		string `json:"id"`
	NamaSP			string `json:"namaSp"`
}


// ============================================================================================================================
// Struct Definitions - Satuan Managemen Sumberdaya (SMS)
// ============================================================================================================================

type SatuanManagemenSumberdaya struct {
	ID      			string 		`json:"id"`
	NamaSMS				string 		`json:"namaSms"`
	JenjangPendidikan	string 		`json:"jenjangPendidikan"`
	ApproversTSK		[]string 	`json:"approversTsk"`
	ApproversIJZ		[]string 	`json:"approversIjz"`
}


// ============================================================================================================================
// Struct Definitions - Pendidik Tenaga Kependidikan (PTK)
// ============================================================================================================================

type PendidikTenagaKependidikan struct {
	ID      			string `json:"id"`
	NamaPTK				string `json:"namaPtk"`
	NIDN				string `json:"nidn"`
	Jabatan				string `json:"jabatan"`
}


// ============================================================================================================================
// Struct Definitions - Peserta Didik (PD)
// ============================================================================================================================

type PesertaDidik struct {
	ID      			string 	`json:"id"`
	NamaPD				string 	`json:"namaPd"`
	NIPD				string 	`json:"nipd"`
}


// ============================================================================================================================
// Struct Definitions - Result of Query Transkrip Mahasiswa (TSK) data
// ============================================================================================================================

type TranskripResult struct {
	ID      			string 							`json:"id"`
	SP					*SatuanPendidikan 				`json:"sp"`
	SMS					*SatuanManagemenSumberdaya 		`json:"sms"`
	PD					*PesertaDidik					`json:"pd"`
	JenjangPendidikan	string 							`json:"jenjangPendidikan"`
	TotalMutu			float64							`json:"totalMutu"`
	TotalSKS			int 							`json:"totalSks"`
	IPK					float64							`json:"ipk"`
	RemainingApprover	int 							`json:"remainingApprover"`
	Approvers			[]*PendidikTenagaKependidikan	`json:"Approvers"`
	ApprovalTxId		[]string						`json:"approvalTxId"`
}


// ============================================================================================================================
// Error Messages
// ============================================================================================================================

const (
	ER11 string = "ER11-Incorrect number of arguments. Required %d arguments, but you have %d arguments."
	ER12        = "ER12-Transkrip with id '%s' already exists."
	ER13        = "ER13-Transkrip with id '%s' doesn't exist."
	ER14        = "ER14-Transkrip with id '%s' no longer require approval."
	ER15        = "ER15-Transkrip with id '%s' already approved by PTK with id '%s'."
	ER16        = "ER16-Transkrip with id '%s' cannot be approved by PTK with id '%s' in this step."
	ER31        = "ER31-Failed to change to world state: %v."
	ER32        = "ER32-Failed to read from world state: %v."
	ER33        = "ER33-Failed to get result from iterator: %v."
	ER34        = "ER34-Failed unmarshaling JSON: %v."
	ER35        = "ER35-Failed parsing string to integer: %v."
	ER36        = "ER36-Failed parsing string to float: %v."
	ER37        = "ER37-Failed to query another chaincode (%s): %v."
	ER41        = "ER41-Access is not permitted with MSDPID '%s'."
	ER42        = "ER42-Unknown MSPID: '%s'."
)


// ============================================================================================================================
// Channel Name & Contract Name In The Channel
// ============================================================================================================================

const (
	AcademicChannel	string = "academicchannel"
	SPContract 		string = "spcontract"
	SMSContract 	string = "smscontract"
	PTKContract 	string = "ptkcontract"
	PDContract 		string = "pdcontract"
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

	totalMutu, err := strconv.ParseFloat(totalMutuStr, 64)
	if err != nil {
		logger.Errorf(ER35, id)
		return fmt.Errorf(ER35, id)
	}

	totalSks, err := strconv.Atoi(totalSksStr)
	if err != nil {
		logger.Errorf(ER35, id)
		return fmt.Errorf(ER35, id)
	}

	smsApproverTsk, err := getSmsApproverTsk(ctx, idSms)
	if err != nil {
		return err
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
		RemainingApprover:	len(smsApproverTsk),
		Approvers:			[]string{},
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

	totalMutu, err := strconv.ParseFloat(totalMutuStr, 64)
	if err != nil {
		logger.Errorf(ER35, id)
		return fmt.Errorf(ER35, id)
	}

	totalSks, err := strconv.Atoi(totalSksStr)
	if err != nil {
		logger.Errorf(ER35, id)
		return fmt.Errorf(ER35, id)
	}

	smsApproverTsk, err := getSmsApproverTsk(ctx, idSms)
	if err != nil {
		return err
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
		RemainingApprover:	len(smsApproverTsk),
		Approvers:			[]string{},
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
// AddTskApproval - Add Approval for an existing Transkrip Mahasiswa (TSK) in the world state.
// Arguments - ID, Approver Id
// ============================================================================================================================

func (s *TSKContract) AddTskApproval (ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	logger.Infof("Run AddTskApproval function with args: %+q.", args)

	if len(args) != 2 {
		logger.Errorf(ER11, 2, len(args))
		return fmt.Errorf(ER11, 2, len(args))
	}

	id:= args[0]
	approver:= args[1]

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

	if tsk.RemainingApprover == 0 {
		return fmt.Errorf(ER14, id)
	}

	if contains(tsk.Approvers, approver) {
		return fmt.Errorf(ER15, id, approver)
	}

	smsApproverTsk, err := getSmsApproverTsk(ctx, tsk.IdSMS)
	if err != nil {
		return err
	}

	approvalStep := len(tsk.Approvers)
	if smsApproverTsk[approvalStep] != approver {
		return fmt.Errorf(ER16, id, approver)
	}

	tsk.Approvers = append(tsk.Approvers, approver)
	tsk.RemainingApprover = tsk.RemainingApprover - 1

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

func (s *TSKContract) GetTskById (ctx contractapi.TransactionContextInterface) (*TranskripResult, error) {
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

	tskResult, err := getCompleteDataTsk(ctx, tsk)
	if err != nil {
		return nil, err
	}

	return tskResult, nil
}


// ============================================================================================================================
// GetTskByIdSp - Get the Transkrip Mahasiswa (TSK) stored in the world state with given IdSp.
// Arguments - idSp
// ============================================================================================================================

func (t *TSKContract) GetTskByIdSp(ctx contractapi.TransactionContextInterface) ([]*TranskripResult, error) {
	args := ctx.GetStub().GetStringArgs()[1:]

	logger.Infof("Run GetTskByIdSp function with args: %+q.", args)

	if len(args) != 1 {
		logger.Errorf(ER11, 1, len(args))
		return nil, fmt.Errorf(ER11, 1, len(args))
	}

	idSp:= args[0]

	queryString := fmt.Sprintf(`{"selector":{"idSp":"%s"}}`, idSp)
	queryResult, err := getQueryResultForQueryString(ctx, queryString)
	if err != nil {
		return nil, err
	}

	var tskList []*TranskripResult

	for _, tsk := range queryResult {
		tskResult, err := getCompleteDataTsk(ctx, tsk)
		if err != nil {
			return nil, err
		}

		tskList = append(tskList, tskResult)
	}

	return tskList, nil
}


// ============================================================================================================================
// GetTskByIdSms - Get the Transkrip Mahasiswa (TSK) stored in the world state with given IdSms.
// Arguments - idSms
// ============================================================================================================================

func (t *TSKContract) GetTskByIdSms(ctx contractapi.TransactionContextInterface) ([]*TranskripResult, error) {
	args := ctx.GetStub().GetStringArgs()[1:]

	logger.Infof("Run GetTskByIdSms function with args: %+q.", args)

	if len(args) != 1 {
		logger.Errorf(ER11, 1, len(args))
		return nil, fmt.Errorf(ER11, 1, len(args))
	}

	idSms:= args[0]

	queryString := fmt.Sprintf(`{"selector":{"idSms":"%s"}}`, idSms)
	queryResult, err := getQueryResultForQueryString(ctx, queryString)
	if err != nil {
		return nil, err
	}

	var tskList []*TranskripResult

	for _, tsk := range queryResult {
		tskResult, err := getCompleteDataTsk(ctx, tsk)
		if err != nil {
			return nil, err
		}

		tskList = append(tskList, tskResult)
	}

	return tskList, nil
}


// ============================================================================================================================
// GetTskByIdPd - Get the Transkrip Mahasiswa (TSK) stored in the world state with given IdPd.
// Arguments - idPd
// ============================================================================================================================

func (t *TSKContract) GetTskByIdPd(ctx contractapi.TransactionContextInterface) ([]*TranskripResult, error) {
	args := ctx.GetStub().GetStringArgs()[1:]

	logger.Infof("Run GetTskByIdPd function with args: %+q.", args)

	if len(args) != 1 {
		logger.Errorf(ER11, 1, len(args))
		return nil, fmt.Errorf(ER11, 1, len(args))
	}

	idPd:= args[0]

	queryString := fmt.Sprintf(`{"selector":{"idPd":"%s"}}`, idPd)
	queryResult, err := getQueryResultForQueryString(ctx, queryString)
	if err != nil {
		return nil, err
	}

	var tskList []*TranskripResult

	for _, tsk := range queryResult {
		tskResult, err := getCompleteDataTsk(ctx, tsk)
		if err != nil {
			return nil, err
		}

		tskList = append(tskList, tskResult)
	}

	return tskList, nil
}


// ============================================================================================================================
// GetTskAddApprovalTxIdById - Get the Transkrip Mahasiswa (TSK) stored in the world state with given IdPd.
// Arguments - ID
// ============================================================================================================================

func (t *TSKContract) GetTskAddApprovalTxIdById(ctx contractapi.TransactionContextInterface) ([]string, error) {
	args := ctx.GetStub().GetStringArgs()[1:]

	logger.Infof("Run GetTskAddApprovalTxIdById function with args: %+q.", args)

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

		var tsk Transkrip
		err = json.Unmarshal([]byte(response.Value), &tsk)
		if err != nil {
			return nil, fmt.Errorf(ER34, err)
		}

		if (len(tsk.Approvers) == 0) {
			break
		}

		txIdList = append([]string{response.TxId}, txIdList[0:]...)
	}

	return txIdList, nil
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

	tskJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf(ER32, err)
	}
	if tskJSON == nil {
		return nil, fmt.Errorf(ER13, id)
	}

	var tsk Transkrip
	err = json.Unmarshal(tskJSON, &tsk)
	if err != nil {
		return nil, fmt.Errorf(ER34, err)
	}

	return &tsk, nil
}


// ============================================================================================================================
// getSmsApproverTsk - Get SMS Approver TSK with given idSms.
// ============================================================================================================================

func getSmsApproverTsk(ctx contractapi.TransactionContextInterface, idSms string) ([]string, error) {
	logger.Infof("Run getSmsApproverTsk function with idSms: '%s'.", idSms)

	params := []string{"GetSmsById", idSms}
	queryArgs := make([][]byte, len(params))
	for i, arg := range params {
		queryArgs[i] = []byte(arg)
	}

	response := ctx.GetStub().InvokeChaincode(SMSContract, queryArgs, AcademicChannel)
	if response.Status != shim.OK {
		return nil, fmt.Errorf(ER37, SMSContract, response.Payload)
	}

	var sms SatuanManagemenSumberdaya
	err := json.Unmarshal([]byte(response.Payload), &sms)
	if err != nil {
		return nil, fmt.Errorf(ER34, err)
	}

	return sms.ApproversTSK, nil
}


// ============================================================================================================================
// getSpById - Get SP with given idSp.
// ============================================================================================================================

func getSpById(ctx contractapi.TransactionContextInterface, idSp string) (*SatuanPendidikan, error) {
	logger.Infof("Run getSpById function with idSp: '%s'.", idSp)

	params := []string{"GetSpById", idSp}
	queryArgs := make([][]byte, len(params))
	for i, arg := range params {
		queryArgs[i] = []byte(arg)
	}

	response := ctx.GetStub().InvokeChaincode(SPContract, queryArgs, AcademicChannel)
	if response.Status != shim.OK {
		return nil, fmt.Errorf(ER37, SPContract, response.Message)
	}

	var sp SatuanPendidikan
	err := json.Unmarshal([]byte(response.Payload), &sp)
	if err != nil {
		return nil, fmt.Errorf(ER34, err)
	}

	return &sp, nil
}


// ============================================================================================================================
// getSmsById - Get SMS with given idSms.
// ============================================================================================================================

func getSmsById(ctx contractapi.TransactionContextInterface, idSms string) (*SatuanManagemenSumberdaya, error) {
	logger.Infof("Run getSmsById function with idSms: '%s'.", idSms)

	params := []string{"GetSmsById", idSms}
	queryArgs := make([][]byte, len(params))
	for i, arg := range params {
		queryArgs[i] = []byte(arg)
	}

	response := ctx.GetStub().InvokeChaincode(SMSContract, queryArgs, AcademicChannel)
	if response.Status != shim.OK {
		return nil, fmt.Errorf(ER37, SMSContract, response.Message)
	}

	var sms SatuanManagemenSumberdaya
	err := json.Unmarshal([]byte(response.Payload), &sms)
	if err != nil {
		return nil, fmt.Errorf(ER34, err)
	}

	return &sms, nil
}


// ============================================================================================================================
// getPtkById - Get PTK with given idPtk.
// ============================================================================================================================

func getPtkById(ctx contractapi.TransactionContextInterface, idPtk string) (*PendidikTenagaKependidikan, error) {
	logger.Infof("Run getPtkById function with idPtk: '%s'.", idPtk)

	params := []string{"GetPtkById", idPtk}
	queryArgs := make([][]byte, len(params))
	for i, arg := range params {
		queryArgs[i] = []byte(arg)
	}

	response := ctx.GetStub().InvokeChaincode(PTKContract, queryArgs, AcademicChannel)
	logger.Infof("Response Payload: '%+q'.", response.Payload)
	if response.Status != shim.OK {
		return nil, fmt.Errorf(ER37, PTKContract, response.Message)
	}

	var ptk PendidikTenagaKependidikan
	err := json.Unmarshal([]byte(response.Payload), &ptk)
	if err != nil {
		return nil, fmt.Errorf(ER34, err)
	}

	return &ptk, nil
}


// ============================================================================================================================
// getPdById - Get PD with given idPd.
// ============================================================================================================================

func getPdById(ctx contractapi.TransactionContextInterface, idPd string) (*PesertaDidik, error) {
	logger.Infof("Run getPdById function with idPd: '%s'.", idPd)

	params := []string{"GetPdById", idPd}
	queryArgs := make([][]byte, len(params))
	for i, arg := range params {
		queryArgs[i] = []byte(arg)
	}

	response := ctx.GetStub().InvokeChaincode(PDContract, queryArgs, AcademicChannel)
	if response.Status != shim.OK {
		return nil, fmt.Errorf(ER37, PDContract, response.Message)
	}

	var pd PesertaDidik
	err := json.Unmarshal([]byte(response.Payload), &pd)
	if err != nil {
		return nil, fmt.Errorf(ER34, err)
	}

	return &pd, nil
}


// ============================================================================================================================
// getTskAddApprovalTxIdById - Get the Transkrip Mahasiswa (TSK) Approval Tx Id with given ID.
// ============================================================================================================================

func getTskAddApprovalTxIdById(ctx contractapi.TransactionContextInterface, id string) ([]string, error) {
	logger.Infof("Run getTskAddApprovalTxIdById function with id: %s.", id)

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

		var tsk Transkrip
		err = json.Unmarshal([]byte(response.Value), &tsk)
		if err != nil {
			return nil, fmt.Errorf(ER34, err)
		}

		if (len(tsk.Approvers) == 0) {
			break
		}

		txIdList = append([]string{response.TxId}, txIdList[0:]...)
	}

	return txIdList, nil
}


// ============================================================================================================================
// getCompleteDataTsk - Get Complete the Transkrip Mahasiswa (TSK).
// ============================================================================================================================

func getCompleteDataTsk(ctx contractapi.TransactionContextInterface, tsk *Transkrip) (*TranskripResult, error) {
	logger.Infof("Run getCompleteDataTsk function with tsk id: '%s'.", tsk.ID)

	var tskResult TranskripResult

	tskResult.ID 				= tsk.ID
	tskResult.JenjangPendidikan = tsk.JenjangPendidikan
	tskResult.TotalMutu 		= tsk.TotalMutu
	tskResult.TotalSKS 			= tsk.TotalSKS
	tskResult.IPK 				= tsk.IPK
	tskResult.RemainingApprover = tsk.RemainingApprover

	sp, err := getSpById(ctx, tsk.IdSP)
	if err != nil {
		return nil, err
	}
	tskResult.SP = sp

	sms, err := getSmsById(ctx, tsk.IdSMS)
	if err != nil {
		return nil, err
	}
	sms.ApproversTSK = []string{}
	sms.ApproversIJZ = []string{}
	tskResult.SMS = sms

	pd, err := getPdById(ctx, tsk.IdPD)
	if err != nil {
		return nil, err
	}
	tskResult.PD = pd

	if len(tsk.Approvers) != 0 {
		var listPtk []*PendidikTenagaKependidikan

		for _, ptkId := range tsk.Approvers {
			ptk, err := getPtkById(ctx, ptkId)
			if err != nil {
				return nil, err
			}

			listPtk = append(listPtk, ptk)
		}

		tskResult.Approvers = listPtk
	} else {
		tskResult.Approvers = []*PendidikTenagaKependidikan{}
	}

	approvalTxIds, err := getTskAddApprovalTxIdById(ctx, tsk.ID)
	if err != nil {
		return nil, err
	}
	tskResult.ApprovalTxId = approvalTxIds

	return &tskResult, nil
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

