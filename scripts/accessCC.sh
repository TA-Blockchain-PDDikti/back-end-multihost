#!/bin/bash

source scripts/utils.sh

CHANNEL_NAME=${1:-"academicchannel"}
CC_NAME=${2:-"heContract"}
DELAY=${3:-"3"}
MAX_RETRY=${4:-"5"}
VERBOSE=${4:-"false"}

println "executing with the following"
println "- CHANNEL_NAME: ${C_GREEN}${CHANNEL_NAME}${C_RESET}"
println "- CC_NAME: ${C_GREEN}${CC_NAME}${C_RESET}"
println "- DELAY: ${C_GREEN}${DELAY}${C_RESET}"
println "- MAX_RETRY: ${C_GREEN}${MAX_RETRY}${C_RESET}"
println "- VERBOSE: ${C_GREEN}${VERBOSE}${C_RESET}"

FABRIC_CFG_PATH=$PWD/configtx/

#User has not provided a name
if [ -z "$CC_NAME" ] || [ "$CC_NAME" = "NA" ]; then
  fatalln "No chaincode name was provided."
fi

# import utils
. scripts/envVar.sh
. scripts/ccutils.sh


# chaincodeInvoke -f "CreateSp" -args "\"1\", \"SU\", \"Seoul Univ\""  -peer "kemdikbud"
# chaincodeInvoke -f "CreateSp" -args "\"2\", \"HU\", \"Harvard Univ\""  -peer "kemdikbud"
# chaincodeInvoke -f "CreateSp" -args "\"3\", \"CU\", \"Cambridge Univ\""  -peer "kemdikbud"
# chaincodeInvoke -f "CreateSp" -args "\"4\", \"UI\", \"Univ Indonesia\""  -peer "kemdikbud"
# chaincodeInvoke -f "CreateSp" -args "\"5\", \"UB\", \"Univ Brawijaya\""  -peer "kemdikbud"

chaincodeQuery -f "GetAllSp" -peer "kemdikbud"
# chaincodeQuery -f "GetSpById" -args "\"5\""  -peer "kemdikbud"
# chaincodeInvoke -f "UpdateSp" -args "\"5\", \"UB\", \"Univ Brawijaya\""  -peer "kemdikbud"
# chaincodeQuery -f "GetSpById" -args "\"5\""  -peer "kemdikbud"

# chaincodeInvoke -f "DeleteSp" -args "\"3\""  -peer "kemdikbud"


# chaincodeInvoke -f "CreateIjz" -args "\"1\", \"1\", \"1\", \"1\", \"S1\", \"CS-343553\", \"230813\""  -peer "kemdikbud"
# chaincodeInvoke -f "CreateIjz" -args "\"2\", \"1\", \"2\", \"2\", \"S1\", \"ZA-843473\", \"230815\""  -peer "kemdikbud"
# chaincodeInvoke -f "CreateIjz" -args "\"3\", \"2\", \"3\", \"3\", \"S1\", \"CS-346478\", \"230815\""  -peer "kemdikbud"
# chaincodeInvoke -f "CreateIjz" -args "\"4\", \"3\", \"6\", \"4\", \"S1\", \"SI-705483\", \"230815\""  -peer "kemdikbud"
# chaincodeInvoke -f "CreateIjz" -args "\"5\", \"2\", \"1\", \"5\", \"S1\", \"KL-732834\", \"230815\""  -peer "kemdikbud"
# chaincodeInvoke -f "CreateIjz" -args "\"6\", \"3\", \"5\", \"1\", \"S2\", \"FD-902362\", \"230817\""  -peer "kemdikbud"
# chaincodeInvoke -f "CreateIjz" -args "\"7\", \"2\", \"3\", \"6\", \"S1\", \"PE-438462\", \"230817\""  -peer "kemdikbud"
# chaincodeInvoke -f "CreateIjz" -args "\"8\", \"1\", \"1\", \"7\", \"S1\", \"DI-548623\", \"230817\""  -peer "kemdikbud"
# chaincodeInvoke -f "CreateIjz" -args "\"9\", \"2\", \"4\", \"2\", \"S2\", \"SI-943053\", \"230817\""  -peer "kemdikbud"

# chaincodeQuery -f "GetAllIjz" -peer "kemdikbud"
# chaincodeQuery -f "GetIjzById" -args "\"1\"" -peer "kemdikbud"
# chaincodeQuery -f "GetIjzById" -args "\"12\"" -peer "kemdikbud"
# chaincodeQuery -f "GetIjzByIdSp" -args "\"3\"" -peer "kemdikbud"
# chaincodeQuery -f "GetIjzByIdSms" -args "\"1\"" -peer "kemdikbud"
# chaincodeQuery -f "GetIjzByIdPd" -args "\"2\"" -peer "kemdikbud"

# chaincodeInvoke -f "UpdateIjz" -args "\"4\", \"3\", \"6\", \"3\", \"S2\", \"SI-538953\", \"230817\""  -peer "kemdikbud"
# chaincodeInvoke -f "UpdateIjz" -args "\"8\", \"3\", \"7\", \"9\", \"S1\", \"SI-756962\", \"231217\""  -peer "kemdikbud"
# chaincodeInvoke -f "UpdateIjz" -args "\"9\", \"2\", \"4\", \"2\", \"S2\", \"SI-756962\", \"231227\""  -peer "kemdikbud"

# chaincodeQuery -f "GetAllIjz" -peer "kemdikbud"
# chaincodeQuery -f "GetIjzById" -args "\"14\"" -peer "kemdikbud"
# chaincodeQuery -f "GetIjzByIdSp" -args "\"3\"" -peer "kemdikbud"
# chaincodeQuery -f "GetIjzByIdSms" -args "\"6\"" -peer "kemdikbud"
# chaincodeQuery -f "GetIjzByIdPd" -args "\"2\"" -peer "kemdikbud"

# chaincodeInvoke -f "DeleteIjz" -args "\"5\""  -peer "kemdikbud"
# chaincodeInvoke -f "DeleteIjz" -args "\"17\""  -peer "kemdikbud"

# chaincodeQuery -f "GetAllIjz" -peer "kemdikbud"

# # chaincodeInvoke -f "CreateIjz" -args "\"1\", \"1\", \"1\", \"1\", \"S1\", \"CS-3435\", \"230813\""  -peer "kemdikbud"
# # chaincodeInvoke -f "CreateIjz" -args "\"2\", \"1\", \"1\", \"1\", \"S1\", \"CS-3436\", \"230815\""  -peer "kemdikbud"
# # chaincodeInvoke -f "CreateIjz" -args "\"3\", \"1\", \"1\", \"1\", \"S1\", \"CS-3437\", \"230815\""  -peer "kemdikbud"
# # chaincodeInvoke -f "CreateIjz" -args "\"4\", \"2\", \"1\", \"1\", \"S1\", \"SI-756583\", \"230815\""  -peer "kemdikbud"
# # chaincodeInvoke -f "CreateIjz" -args "\"5\", \"2\", \"1\", \"1\", \"S1\", \"SI-759554\", \"230815\""  -peer "kemdikbud"
# # chaincodeInvoke -f "CreateIjz" -args "\"1\", \"2\", \"1\", \"1\", \"S1\", \"SI-756962\", \"230817\""  -peer "kemdikbud"

# # chaincodeInvoke -f "SPContract:CreateSp" -args "\"SP-1\", \"HE1\", \"UIN\""  -peer "kemdikbud"
# # chaincodeInvoke -f "SPContract:CreateSp" -args "\"SP-2\", \"HE2\", \"UNJ\""  -peer "kemdikbud"

# # chaincodeInvoke -f "SMSContract:CreateSms" -args "\"SMS-1\", \"SP-1\", \"Ilmu Kelautan\", \"S1\""  -peer "kemdikbud"
# # chaincodeInvoke -f "SMSContract:CreateSms" -args "\"SMS-2\", \"SP-2\", \"Ilmu Perikanan\", \"S1\""  -peer "kemdikbud"
# # chaincodeInvoke -f "SMSContract:CreateSms" -args "\"SMS-3\", \"SP-1\", \"Ekonomi\", \"S1\""  -peer "kemdikbud"
# # chaincodeInvoke -f "SMSContract:CreateSms" -args "\"SMS-4\", \"SP-2\", \"Bisnis\", \"S2\""  -peer "kemdikbud"

# # chaincodeQuery "kemdikbud" ""
# # chaincodeQuery -f "IJZContract:GetAllIjz" -peer "kemdikbud"
# # chaincodeQuery -f "IJZContract:GetIjzBySPId" -args "\"1\"" -peer "kemdikbud"



exit 0