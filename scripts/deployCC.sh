#!/bin/bash

source scripts/utils.sh

CHANNEL_NAME=${1:-"academicchannel"}
CC_NAME=${2}
CC_SRC_PATH=${3}
CC_SRC_LANGUAGE=${4}
CC_VERSION=${5:-"1.0"}
CC_SEQUENCE=${6:-"1"}
CC_INIT_FCN=${7:-"NA"}
CC_END_POLICY=${8:-"NA"}
CC_COLL_CONFIG=${9:-"NA"}
DELAY=${10:-"3"}
MAX_RETRY=${11:-"5"}
VERBOSE=${12:-"false"}
DEPLOYCCSTEP=${13:-"1"}

println "executing with the following"
println "- CHANNEL_NAME: ${C_GREEN}${CHANNEL_NAME}${C_RESET}"
println "- CC_NAME: ${C_GREEN}${CC_NAME}${C_RESET}"
println "- CC_SRC_PATH: ${C_GREEN}${CC_SRC_PATH}${C_RESET}"
println "- CC_SRC_LANGUAGE: ${C_GREEN}${CC_SRC_LANGUAGE}${C_RESET}"
println "- CC_VERSION: ${C_GREEN}${CC_VERSION}${C_RESET}"
println "- CC_SEQUENCE: ${C_GREEN}${CC_SEQUENCE}${C_RESET}"
println "- CC_END_POLICY: ${C_GREEN}${CC_END_POLICY}${C_RESET}"
println "- CC_COLL_CONFIG: ${C_GREEN}${CC_COLL_CONFIG}${C_RESET}"
println "- CC_INIT_FCN: ${C_GREEN}${CC_INIT_FCN}${C_RESET}"
println "- DELAY: ${C_GREEN}${DELAY}${C_RESET}"
println "- MAX_RETRY: ${C_GREEN}${MAX_RETRY}${C_RESET}"
println "- VERBOSE: ${C_GREEN}${VERBOSE}${C_RESET}"
println "- DEPLOYCCSTEP: ${C_GREEN}${DEPLOYCCSTEP}${C_RESET}"

FABRIC_CFG_PATH=$PWD/configtx/

#User has not provided a name
if [ -z "$CC_NAME" ] || [ "$CC_NAME" = "NA" ]; then
  fatalln "No chaincode name was provided. Valid call example: ./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-go -ccl go"

# User has not provided a path
elif [ -z "$CC_SRC_PATH" ] || [ "$CC_SRC_PATH" = "NA" ]; then
  fatalln "No chaincode path was provided. Valid call example: ./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-go -ccl go"

# User has not provided a language
elif [ -z "$CC_SRC_LANGUAGE" ] || [ "$CC_SRC_LANGUAGE" = "NA" ]; then
  fatalln "No chaincode language was provided. Valid call example: ./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-go -ccl go"

## Make sure that the path to the chaincode exists
elif [ ! -d "$CC_SRC_PATH" ] && [ ! -f "$CC_SRC_PATH" ]; then
  fatalln "Path to chaincode does not exist. Please provide different path."
fi

CC_SRC_LANGUAGE=$(echo "$CC_SRC_LANGUAGE" | tr [:upper:] [:lower:])

# do some language specific preparation to the chaincode before packaging
if [ "$CC_SRC_LANGUAGE" = "go" ]; then
  CC_RUNTIME_LANGUAGE=golang

  pushd $CC_SRC_PATH
  if [[ ! -f "go.mod" ]]; then
    go mod init contract/$CC_NAME
  fi
  go mod tidy

  infoln "Vendoring Go dependencies at $CC_SRC_PATH"
  GO111MODULE=on
  go mod vendor
  popd
  successln "Finished vendoring Go dependencies"

else
  fatalln "The chaincode language ${CC_SRC_LANGUAGE} is not supported by this script. Supported chaincode languages are: go, java, javascript, and typescript"
  exit 1
fi

INIT_REQUIRED="--init-required"
# check if the init fcn should be called
if [ "$CC_INIT_FCN" = "NA" ]; then
  INIT_REQUIRED=""
fi

if [ "$CC_END_POLICY" = "NA" ]; then
  CC_END_POLICY=""
else
  CC_END_POLICY="--signature-policy $CC_END_POLICY"
fi

if [ "$CC_COLL_CONFIG" = "NA" ]; then
  CC_COLL_CONFIG=""
else
  CC_COLL_CONFIG="--collections-config $CC_COLL_CONFIG"
fi

# import utils
. scripts/envVar.sh
. scripts/ccutils.sh

packageChaincode() {
  set -x
  peer lifecycle chaincode package ${CC_NAME}.tar.gz --path ${CC_SRC_PATH} --lang ${CC_RUNTIME_LANGUAGE} --label ${CC_NAME}_${CC_VERSION} >&log.txt
  res=$?
  PACKAGE_ID=$(peer lifecycle chaincode calculatepackageid ${CC_NAME}.tar.gz)
  { set +x; } 2>/dev/null
  cat log.txt
  verifyResult $res "Chaincode packaging has failed"
  successln "Chaincode is packaged"
}

function checkPrereqs() {
  jq --version > /dev/null 2>&1

  if [[ $? -ne 0 ]]; then
    errorln "jq command not found..."
    errorln
    errorln "Follow the instructions in the Fabric docs to install the prereqs"
    errorln "https://hyperledger-fabric.readthedocs.io/en/latest/prereqs.html"
    exit 1
  fi
}

if [ "$DEPLOYCCSTEP" == "h11" ]; then
  #check for prerequisites
  checkPrereqs

  # package the chaincode
  packageChaincode

  ## Install chaincode on peer0.kemdikbud
  infoln "Installing chaincode on peer0.kemdikbud..."
  installChaincode "kemdikbudp0"

  ## query whether the chaincode is installed
  queryInstalled "kemdikbudp0"

  ## approve the definition for peer0.kemdikbud
  approveForMyOrg "kemdikbudp0"

elif [ "$DEPLOYCCSTEP" == "h21" ]; then
  #check for prerequisites
  checkPrereqs

  # package the chaincode
  packageChaincode

  ## Install chaincode on peer0.he1
  infoln "Install chaincode on peer0.he1..."
  installChaincode "he1p0"

  ## query whether the chaincode is installed
  queryInstalled "he1p0"

  ## approve the definition for peer0.he1
  approveForMyOrg "he1p0"

elif [ "$DEPLOYCCSTEP" == "h31" ]; then
  #check for prerequisites
  checkPrereqs

  # package the chaincode
  packageChaincode

  ## Install chaincode on peer0.he1
  infoln "Install chaincode on peer1.he1..."
  installChaincode "he1p1"

  ## query whether the chaincode is installed
  queryInstalled "he1p1"

  ## approve the definition for peer1.he1
  approveForMyOrg "he1p1"

elif [ "$DEPLOYCCSTEP" == "h12" ]; then
  ## now that we know for sure both orgs have approved, commit the definition
  commitChaincodeDefinition "kemdikbudp0" "he1p0" "he1p1"

  ## query on both orgs to see that the definition committed successfully
  queryCommitted "kemdikbudp0"

elif [ "$DEPLOYCCSTEP" == "h22" ]; then
  ## query on both orgs to see that the definition committed successfully
  queryCommitted "he1p0"

elif [ "$DEPLOYCCSTEP" == "h32" ]; then
  ## query on both orgs to see that the definition committed successfully
  queryCommitted "he1p1"


fi

# #check for prerequisites
# checkPrereqs

# ## package the chaincode
# packageChaincode

# ## Install chaincode on peer0.kemdikbud and peer0.he1
# infoln "Installing chaincode on peer0.kemdikbud..."
# installChaincode "kemdikbud"
# infoln "Install chaincode on peer0.he1..."
# installChaincode "he1"

# ## query whether the chaincode is installed
# queryInstalled "kemdikbud"

# ## approve the definition for kemdikbud
# approveForMyOrg "kemdikbud"

# ## check whether the chaincode definition is ready to be committed
# ## expect kemdikbud to have approved and he1 not to
# checkCommitReadiness "kemdikbud" "\"HE1MSP\": false" "\"KemdikbudMSP\": true"
# checkCommitReadiness "he1" "\"HE1MSP\": false" "\"KemdikbudMSP\": true"

# ## now approve also for he1
# approveForMyOrg "he1"

# ## check whether the chaincode definition is ready to be committed
# ## expect them both to have approved
# checkCommitReadiness "kemdikbud" "\"HE1MSP\": true" "\"KemdikbudMSP\": true"
# checkCommitReadiness "he1" "\"HE1MSP\": true" "\"KemdikbudMSP\": true"

# ## now that we know for sure both orgs have approved, commit the definition
# commitChaincodeDefinition "kemdikbud" "he1"

# ## query on both orgs to see that the definition committed successfully
# queryCommitted "kemdikbud"
# queryCommitted "he1"

# ## Invoke the chaincode - this does require that the chaincode have the 'initLedger'
# ## method defined
# if [ "$CC_INIT_FCN" = "NA" ]; then
#   infoln "Chaincode initialization is not required"
# else
#   chaincodeInvokeInit "kemdikbud" "he1"
# fi

exit 0
