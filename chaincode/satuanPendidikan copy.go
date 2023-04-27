// package chaincode

// import (
// 	"encoding/json"
// 	"fmt"

// 	"github.com/hyperledger/fabric-contract-api-go/contractapi"
// )

// // ============================================================================================================================
// // Contract Definitions
// // ============================================================================================================================

// type SPContract struct {
// 	contractapi.Contract
// }


// // ============================================================================================================================
// // Asset Definitions - The ledger will store Satuan Pendidikan (SP) data
// // ============================================================================================================================

// type SatuanPendidikan struct {
// 	ID      		string `json:"id"`
// 	IdMSP			string `json:"idMsp"`
// 	NamaSP			string `json:"namaSp"`
// }

// type Car struct {
// 	ID      string `json:"id"`
// 	Make    string `json:"make"`
// 	Model   string `json:"model"`
// 	Colour  string `json:"colour"`
// 	Owner   string `json:"owner"`
// 	AddedAt uint64 `json:"addedAt"`
// }

// type Document struct {
// 	ID          string `json:"id"`
// 	Name        string `json:"name"`
// 	AddedAt     uint64 `json:"addedAt"`
// 	URL         string `json:"url"`
// 	ContentHash string `json:"contentHash"`
// }

// // ============================================================================================================================
// // Init - Initialize the chaincode
// // ============================================================================================================================

// func (s *SPContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
// 	// TODO: Selesain Init
// 	// There is no initial data to put on the state

// 	// assets := []Asset{
// 	// 	{ID: "asset1", Color: "blue", Size: 5, Owner: "Tomoko", AppraisedValue: 300},
// 	// 	{ID: "asset2", Color: "red", Size: 5, Owner: "Brad", AppraisedValue: 400},
// 	// 	{ID: "asset3", Color: "green", Size: 10, Owner: "Jin Soo", AppraisedValue: 500},
// 	// 	{ID: "asset4", Color: "yellow", Size: 10, Owner: "Max", AppraisedValue: 600},
// 	// 	{ID: "asset5", Color: "black", Size: 15, Owner: "Adriana", AppraisedValue: 700},
// 	// 	{ID: "asset6", Color: "white", Size: 15, Owner: "Michel", AppraisedValue: 800},
// 	// }

// 	// for _, asset := range assets {
// 	// 	assetJSON, err := json.Marshal(asset)
// 	// 	if err != nil {
// 	// 		return err
// 	// 	}

// 	// 	err = ctx.GetStub().PutState(asset.ID, assetJSON)
// 	// 	if err != nil {
// 	// 		return fmt.Errorf("failed to put to world state. %v", err)
// 	// 	}
// 	// }

// 	// return nil
// }

// // CreateAsset issues a new asset to the world state with given details.
// func (s *SPContract) CreateAsset(ctx contractapi.TransactionContextInterface, id string, color string, size int, owner string, appraisedValue int) error {
// 	exists, err := s.AssetExists(ctx, id)
// 	if err != nil {
// 		return err
// 	}
// 	if exists {
// 		return fmt.Errorf("the asset %s already exists", id)
// 	}

// 	asset := Asset{
// 		ID:             id,
// 		Color:          color,
// 		Size:           size,
// 		Owner:          owner,
// 		AppraisedValue: appraisedValue,
// 	}
// 	assetJSON, err := json.Marshal(asset)
// 	if err != nil {
// 		return err
// 	}

// 	return ctx.GetStub().PutState(id, assetJSON)
// }

// // ReadAsset returns the asset stored in the world state with given id.
// func (s *SPContract) ReadAsset(ctx contractapi.TransactionContextInterface, id string) (*Asset, error) {
// 	assetJSON, err := ctx.GetStub().GetState(id)
// 	if err != nil {
// 		return nil, fmt.Errorf("failed to read from world state: %v", err)
// 	}
// 	if assetJSON == nil {
// 		return nil, fmt.Errorf("the asset %s does not exist", id)
// 	}

// 	var asset Asset
// 	err = json.Unmarshal(assetJSON, &asset)
// 	if err != nil {
// 		return nil, err
// 	}

// 	return &asset, nil
// }

// // UpdateAsset updates an existing asset in the world state with provided parameters.
// func (s *SPContract) UpdateAsset(ctx contractapi.TransactionContextInterface, id string, color string, size int, owner string, appraisedValue int) error {
// 	exists, err := s.AssetExists(ctx, id)
// 	if err != nil {
// 		return err
// 	}
// 	if !exists {
// 		return fmt.Errorf("the asset %s does not exist", id)
// 	}

// 	// overwriting original asset with new asset
// 	asset := Asset{
// 		ID:             id,
// 		Color:          color,
// 		Size:           size,
// 		Owner:          owner,
// 		AppraisedValue: appraisedValue,
// 	}
// 	assetJSON, err := json.Marshal(asset)
// 	if err != nil {
// 		return err
// 	}

// 	return ctx.GetStub().PutState(id, assetJSON)
// }

// // DeleteAsset deletes an given asset from the world state.
// func (s *SPContract) DeleteAsset(ctx contractapi.TransactionContextInterface, id string) error {
// 	exists, err := s.AssetExists(ctx, id)
// 	if err != nil {
// 		return err
// 	}
// 	if !exists {
// 		return fmt.Errorf("the asset %s does not exist", id)
// 	}

// 	return ctx.GetStub().DelState(id)
// }

// // AssetExists returns true when asset with given ID exists in world state
// func (s *SPContract) AssetExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {
// 	assetJSON, err := ctx.GetStub().GetState(id)
// 	if err != nil {
// 		return false, fmt.Errorf("failed to read from world state: %v", err)
// 	}

// 	return assetJSON != nil, nil
// }

// // TransferAsset updates the owner field of asset with given id in world state, and returns the old owner.
// func (s *SPContract) TransferAsset(ctx contractapi.TransactionContextInterface, id string, newOwner string) (string, error) {
// 	asset, err := s.ReadAsset(ctx, id)
// 	if err != nil {
// 		return "", err
// 	}

// 	oldOwner := asset.Owner
// 	asset.Owner = newOwner

// 	assetJSON, err := json.Marshal(asset)
// 	if err != nil {
// 		return "", err
// 	}

// 	err = ctx.GetStub().PutState(id, assetJSON)
// 	if err != nil {
// 		return "", err
// 	}

// 	return oldOwner, nil
// }

// // GetAllAssets returns all assets found in world state
// func (s *SPContract) GetAllAssets(ctx contractapi.TransactionContextInterface) ([]*Asset, error) {
// 	// range query with empty string for startKey and endKey does an
// 	// open-ended query of all assets in the chaincode namespace.
// 	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
// 	if err != nil {
// 		return nil, err
// 	}
// 	defer resultsIterator.Close()

// 	var assets []*Asset
// 	for resultsIterator.HasNext() {
// 		queryResponse, err := resultsIterator.Next()
// 		if err != nil {
// 			return nil, err
// 		}

// 		var asset Asset
// 		err = json.Unmarshal(queryResponse.Value, &asset)
// 		if err != nil {
// 			return nil, err
// 		}
// 		assets = append(assets, &asset)
// 	}

// 	return assets, nil
// }

