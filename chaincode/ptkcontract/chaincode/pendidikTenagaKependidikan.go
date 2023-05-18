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

var logger = flogging.MustGetLogger("PTKContract")


// ============================================================================================================================
// Contract Definitions
// ============================================================================================================================

type PTKContract struct {
	contractapi.Contract
}


// ============================================================================================================================
// Asset Definitions - The ledger will store Pendidik dan Tenaga Kependidikan (PTK) data
// ============================================================================================================================

type PendidikTenagaKependidikan struct {
	ID      			string `json:"id"`
	IdSP				string `json:"idSp"`
	IdSMS				string `json:"idSms"`
	NamaPTK				string `json:"namaPtk"`
	NIDN				string `json:"nidn"`
	Jabatan				string `json:"jabatan"`
	NomorSK				string `json:"nomorSk"`
	SignaturePTK		string `json:"signaturePtk"`
	SignatureJabatan	string `json:"signatureJabatan"`
}


// ============================================================================================================================
// Error Messages
// ============================================================================================================================

const (
	ER11 string = "ER11-Incorrect number of arguments. Required %d arguments, but you have %d arguments."
	ER12        = "ER12-PendidikTenagaKependidikan with id '%s' already exists."
	ER13        = "ER13-PendidikTenagaKependidikan with id '%s' doesn't exist."
	ER31        = "ER31-Failed to change to world state: %v."
	ER32        = "ER32-Failed to read from world state: %v."
	ER33        = "ER33-Failed to get result from iterator: %v."
	ER34        = "ER34-Failed unmarshaling JSON: %v."
	ER41        = "ER41-Access is not permitted with MSDPID '%s'."
	ER42        = "ER42-Unknown MSPID: '%s'."
)


// ============================================================================================================================
// CreatePtk - Issues a new Pendidik dan Tenaga Kependidikan (PTK) to the world state with given details.
// Arguments - ID, Id SP, Id SMS, Nama PTK
// ============================================================================================================================

func (s *PTKContract) CreatePtk(ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	logger.Infof("Run CreatePtk function with args: %+q.", args)

	if len(args) != 4 {
		logger.Errorf(ER11, 4, len(args))
		return fmt.Errorf(ER11, 4, len(args))
	}

	id:= args[0]
	idSp:= args[1]
	idSms:= args[2]
	namaPtk:= args[3]

	exists, err := isPtkExists(ctx, id)
	if err != nil {
		return err
	}
	if exists {
		logger.Errorf(ER12, id)
		return fmt.Errorf(ER12, id)
	}

	ptk := PendidikTenagaKependidikan{
		ID:      			id,
		IdSP:				idSp,
		IdSMS:				idSms,
		NamaPTK:			namaPtk,
		NIDN:				"",
		Jabatan:			"",
		NomorSK:			"",
		SignaturePTK:		"",
		SignatureJabatan:	"",
	}

	ptkJSON, err := json.Marshal(ptk)
	if err != nil {
		return err
	}

	err = ctx.GetStub().PutState(id, ptkJSON)
	if err != nil {
		logger.Errorf(ER31, err)
	}

	return err
}


// ============================================================================================================================
// UpdatePtk - Updates an existing Pendidik dan Tenaga Kependidikan (PTK) in the world state with provided parameters.
// Arguments - ID, Id SP, Id SMS, Nama PTK
// ============================================================================================================================

func (s *PTKContract) UpdatePtk(ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	logger.Infof("Run UpdatePtk function with args: %+q.", args)

	if len(args) != 4 {
		logger.Errorf(ER11, 4, len(args))
		return fmt.Errorf(ER11, 4, len(args))
	}

	id:= args[0]
	idSp:= args[1]
	idSms:= args[2]
	namaPtk:= args[3]

	exists, err := isPtkExists(ctx, id)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf(ER13, id)
	}

	ptk, err := getPtkStateById(ctx, id)
	if err != nil {
		return err
	}

	ptk.IdSP = idSp
	ptk.IdSMS = idSms
	ptk.NamaPTK = namaPtk
	ptk.SignaturePTK = ""
	ptk.SignatureJabatan = ""

	ptkJSON, err := json.Marshal(ptk)
	if err != nil {
		return err
	}

	err = ctx.GetStub().PutState(id, ptkJSON)
	if err != nil {
		logger.Errorf(ER31, err)
	}

	return err
}


// ============================================================================================================================
// UpdatePtkNidnAndSign - Updates NIDN and SiganturePTK of an existing Pendidik dan Tenaga Kependidikan (PTK) in the world state.
// Arguments - ID, NIDN, SignaturePTK
// ============================================================================================================================

func (s *PTKContract) UpdatePtkNidnAndSign(ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	logger.Infof("Run UpdatePtkNidnAndSign function with args: %+q.", args)

	if len(args) != 3 {
		logger.Errorf(ER11, 3, len(args))
		return fmt.Errorf(ER11, 3, len(args))
	}

	id:= args[0]
	nidn:= args[1]
	signaturePtk:= args[2]

	exists, err := isPtkExists(ctx, id)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf(ER13, id)
	}

	ptk, err := getPtkStateById(ctx, id)
	if err != nil {
		return err
	}

	ptk.NIDN = nidn
	ptk.SignaturePTK = signaturePtk
	ptk.SignatureJabatan = ""

	ptkJSON, err := json.Marshal(ptk)
	if err != nil {
		return err
	}

	err = ctx.GetStub().PutState(id, ptkJSON)
	if err != nil {
		logger.Errorf(ER31, err)
	}

	return err
}


// ============================================================================================================================
// UpdatePtkJabatanAndSign - Updates NIDN and SiganturePTK of an existing Pendidik dan Tenaga Kependidikan (PTK) in the world state.
// Arguments - ID, Jabatan, Nomor SK, SignaturePTK
// ============================================================================================================================

func (s *PTKContract) UpdatePtkJabatanAndSign(ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	logger.Infof("Run UpdatePtkJabatanAndSign function with args: %+q.", args)

	if len(args) != 4 {
		logger.Errorf(ER11, 4, len(args))
		return fmt.Errorf(ER11, 4, len(args))
	}

	id:= args[0]
	jabatan:= args[1]
	nomorSk:= args[2]
	signatureJabatan:= args[3]

	exists, err := isPtkExists(ctx, id)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf(ER13, id)
	}

	ptk, err := getPtkStateById(ctx, id)
	if err != nil {
		return err
	}

	ptk.Jabatan = jabatan
	ptk.NomorSK = nomorSk
	ptk.SignatureJabatan = signatureJabatan

	ptkJSON, err := json.Marshal(ptk)
	if err != nil {
		return err
	}

	err = ctx.GetStub().PutState(id, ptkJSON)
	if err != nil {
		logger.Errorf(ER31, err)
	}

	return err
}


// ============================================================================================================================
// DeletePtk - Deletes an given Pendidik dan Tenaga Kependidikan (PTK) from the world state.
// Arguments - ID
// ============================================================================================================================

func (s *PTKContract) DeletePtk(ctx contractapi.TransactionContextInterface) error {
	args := ctx.GetStub().GetStringArgs()[1:]

	logger.Infof("Run DeletePtk function with args: %+q.", args)

	if len(args) != 1 {
		logger.Errorf(ER11, 1, len(args))
		return fmt.Errorf(ER11, 1, len(args))
	}

	id:= args[0]

	exists, err := isPtkExists(ctx, id)
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
// GetAllPtk - Returns all Pendidik dan Tenaga Kependidikan (PTK) found in world state.
// No Arguments
// ============================================================================================================================

func (s *PTKContract) GetAllPtk(ctx contractapi.TransactionContextInterface) ([]*PendidikTenagaKependidikan, error) {
	args := ctx.GetStub().GetStringArgs()[1:]

	logger.Infof("Run GetAllPtk function with args: %+q.", args)

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
// GetPtkById - Get the Pendidik dan Tenaga Kependidikan (PTK) stored in the world state with given id.
// Arguments - ID
// ============================================================================================================================

func (s *PTKContract) GetPtkById(ctx contractapi.TransactionContextInterface) (*PendidikTenagaKependidikan, error) {
	args := ctx.GetStub().GetStringArgs()[1:]

	logger.Infof("Run GetPtkById function with args: %+q.", args)

	if len(args) != 1 {
		logger.Errorf(ER11, 1, len(args))
		return nil, fmt.Errorf(ER11, 1, len(args))
	}

	id:= args[0]

	ptkJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf(ER32, err)
	}
	if ptkJSON == nil {
		return nil, fmt.Errorf(ER13, id)
	}

	var ptk PendidikTenagaKependidikan
	err = json.Unmarshal(ptkJSON, &ptk)
	if err != nil {
		return nil, fmt.Errorf(ER34, err)
	}

	return &ptk, nil
}


// ============================================================================================================================
// GetPtkByIdSp - Get the Pendidik dan Tenaga Kependidikan (PTK) stored in the world state with given IdSp.
// Arguments - idSp
// ============================================================================================================================

func (t *PTKContract) GetPtkByIdSp(ctx contractapi.TransactionContextInterface) ([]*PendidikTenagaKependidikan, error) {
	args := ctx.GetStub().GetStringArgs()[1:]

	logger.Infof("Run GetPtkByIdSp function with args: %+q.", args)

	if len(args) != 1 {
		logger.Errorf(ER11, 1, len(args))
		return nil, fmt.Errorf(ER11, 1, len(args))
	}

	idSp:= args[0]

	queryString := fmt.Sprintf(`{"selector":{"idSp":"%s"}}`, idSp)
	return getQueryResultForQueryString(ctx, queryString)
}


// ============================================================================================================================
// GetPtkByIdSms - Get the Pendidik dan Tenaga Kependidikan (PTK) stored in the world state with given IdSms.
// Arguments - idSms
// ============================================================================================================================

func (t *PTKContract) GetPtkByIdSms(ctx contractapi.TransactionContextInterface) ([]*PendidikTenagaKependidikan, error) {
	args := ctx.GetStub().GetStringArgs()[1:]

	logger.Infof("Run GetPtkByIdSms function with args: %+q.", args)

	if len(args) != 1 {
		logger.Errorf(ER11, 1, len(args))
		return nil, fmt.Errorf(ER11, 1, len(args))
	}

	idSms:= args[0]

	queryString := fmt.Sprintf(`{"selector":{"idSms":"%s"}}`, idSms)
	return getQueryResultForQueryString(ctx, queryString)
}


// ============================================================================================================================
// isPtkExists - Returns true when Pendidik dan Tenaga Kependidikan (PTK) with given ID exists in world state.
// ============================================================================================================================

func isPtkExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {
	logger.Infof("Run isPtkExists function with id: '%s'.", id)

	ptkJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		logger.Errorf(ER32, err)
		return false, fmt.Errorf(ER32, err)
	}

	return ptkJSON != nil, nil
}


// ============================================================================================================================
// getPtkStateById - Get KLS state with given id.
// ============================================================================================================================

func getPtkStateById(ctx contractapi.TransactionContextInterface, id string) (*PendidikTenagaKependidikan, error) {
	logger.Infof("Run getPtkStateById function with id: '%s'.", id)

	ptkJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf(ER32, err)
	}
	if ptkJSON == nil {
		return nil, fmt.Errorf(ER13, id)
	}

	var ptk PendidikTenagaKependidikan
	err = json.Unmarshal(ptkJSON, &ptk)
	if err != nil {
		return nil, fmt.Errorf(ER34, err)
	}

	return &ptk, nil
}


// ============================================================================================================================
// constructQueryResponseFromIterator - Constructs a slice of assets from the resultsIterator.
// ============================================================================================================================

func constructQueryResponseFromIterator(resultsIterator shim.StateQueryIteratorInterface) ([]*PendidikTenagaKependidikan, error) {
	logger.Infof("Run constructQueryResponseFromIterator function.")

	var ptkList []*PendidikTenagaKependidikan

	for resultsIterator.HasNext() {
		queryResult, err := resultsIterator.Next()
		if err != nil {
			return nil, fmt.Errorf(ER33, err)
		}

		var ptk PendidikTenagaKependidikan
		err = json.Unmarshal(queryResult.Value, &ptk)
		if err != nil {
			return nil, fmt.Errorf(ER34, err)
		}
		ptkList = append(ptkList, &ptk)
	}

	return ptkList, nil
}


// ============================================================================================================================
// getQueryResultForQueryString - Get a query result from query string
// ============================================================================================================================

func getQueryResultForQueryString(ctx contractapi.TransactionContextInterface, queryString string) ([]*PendidikTenagaKependidikan, error) {
	logger.Infof("Run getQueryResultForQueryString function with queryString: '%s'.", queryString)

	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, fmt.Errorf(ER32, err)
	}
	defer resultsIterator.Close()

	return constructQueryResponseFromIterator(resultsIterator)
}
