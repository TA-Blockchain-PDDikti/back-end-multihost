#!/bin/bash

source scripts/utils.sh

CHANNEL_NAME=${1:-"academicchannel"}
CC_NAME=${2:-"heContract"}
DELAY=${3:-"3"}
MAX_RETRY=${4:-"5"}
VERBOSE=${4:-"false"}

# println "executing with the following"
# println "- CHANNEL_NAME: ${C_GREEN}${CHANNEL_NAME}${C_RESET}"
# println "- CC_NAME: ${C_GREEN}${CC_NAME}${C_RESET}"
# println "- DELAY: ${C_GREEN}${DELAY}${C_RESET}"
# println "- MAX_RETRY: ${C_GREEN}${MAX_RETRY}${C_RESET}"
# println "- VERBOSE: ${C_GREEN}${VERBOSE}${C_RESET}"

FABRIC_CFG_PATH=$PWD/configtx/

#User has not provided a name
if [ -z "$CC_NAME" ] || [ "$CC_NAME" = "NA" ]; then
  fatalln "No chaincode name was provided."
fi

# import utils
. scripts/envVar.sh
. scripts/ccutils.sh

echo "====================================================="
echo "================== Test Access CC ==================="
echo "====================================================="
echo ""

scripts/test-cc/testSpCC.sh $CHANNEL_NAME "spcontract" 2 3 $VERBOSE
scripts/test-cc/testSmsCC.sh $CHANNEL_NAME "smscontract" 2 3 $VERBOSE
scripts/test-cc/testPtkCC.sh $CHANNEL_NAME "ptkcontract" 2 3 $VERBOSE
scripts/test-cc/testPdCC.sh $CHANNEL_NAME "pdcontract" 2 3 $VERBOSE
scripts/test-cc/testMkCC.sh $CHANNEL_NAME "mkcontract" 2 3 $VERBOSE
scripts/test-cc/testKlsCC.sh $CHANNEL_NAME "klscontract" 2 3 $VERBOSE
scripts/test-cc/testNpdCC.sh $CHANNEL_NAME "npdcontract" 2 3 $VERBOSE
scripts/test-cc/testTskCC.sh $CHANNEL_NAME "tskcontract" 2 3 $VERBOSE
scripts/test-cc/testIjzCC.sh $CHANNEL_NAME "ijzcontract" 2 3 $VERBOSE

exit 0