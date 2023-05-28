#!/bin/bash

source scripts/utils.sh

CHANNEL_NAME=${1:-"academicchannel"}
CC_NAME=${2:-"ijzcontract"}
DELAY=${3:-"2"}
MAX_RETRY=${4:-"3"}
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

echo "===================================== Test IJZContract ====================================="

echo "========= Create IJZ"
chaincodeInvoke -f "CreateIjz" -args "\"11\", \"SP1\", \"SMS1\", \"PD1\", \"S1\", \"CS-343543\", \"230813\""  -peer "he1"
chaincodeInvoke -f "CreateIjz" -args "\"12\", \"SP1\", \"SMS1\", \"PD2\", \"S1\", \"CS-343236\", \"230815\""  -peer "he1"
chaincodeInvoke -f "CreateIjz" -args "\"13\", \"SP2\", \"SMS2\", \"PD3\", \"S1\", \"CS-343347\", \"230815\""  -peer "he1"
chaincodeInvoke -f "CreateIjz" -args "\"14\", \"SP2\", \"SMS3\", \"PD4\", \"S1\", \"SI-756583\", \"230815\""  -peer "he1"
chaincodeInvoke -f "CreateIjz" -args "\"15\", \"SP2\", \"SMS2\", \"PD5\", \"S1\", \"SI-759554\", \"230815\""  -peer "he1"
chaincodeInvoke -f "CreateIjz" -args "\"16\", \"SP1\", \"SMS4\", \"PD6\", \"S1\", \"SI-732432\", \"230817\""  -peer "he1"
chaincodeInvoke -f "CreateIjz" -args "\"17\", \"SP3\", \"SMS5\", \"PD7\", \"S1\", \"SI-342358\", \"230817\""  -peer "he1"
chaincodeInvoke -f "CreateIjz" -args "\"18\", \"SP3\", \"SMS5\", \"PD8\", \"S1\", \"SI-523352\", \"230817\""  -peer "he1"
chaincodeInvoke -f "CreateIjz" -args "\"19\", \"SP2\", \"SMS3\", \"PD9\", \"S1\", \"SI-754542\", \"230817\""  -peer "he1"
echo ""

echo "========= Get All IJZ"
chaincodeQuery -f "GetAllIjz" -peer "he1"
echo ""

echo "========= Get IJZ By Id"
chaincodeQuery -f "GetIjzById" -args "\"11\"" -peer "he1"
chaincodeQuery -f "GetIjzById" -args "\"13\"" -peer "he1"
chaincodeQuery -f "GetIjzById" -args "\"16\"" -peer "he1"
echo ""

echo "========= Get IJZ By Id SP"
chaincodeQuery -f "GetIjzByIdSp" -args "\"SP1\"" -peer "he1"
chaincodeQuery -f "GetIjzByIdSp" -args "\"SP2\"" -peer "he1"
chaincodeQuery -f "GetIjzByIdSp" -args "\"SP3\"" -peer "he1"
echo ""

echo "========= Get IJZ By Id Sms"
chaincodeQuery -f "GetIjzByIdSms" -args "\"SMS1\"" -peer "he1"
chaincodeQuery -f "GetIjzByIdSms" -args "\"SMS2\"" -peer "he1"
chaincodeQuery -f "GetIjzByIdSms" -args "\"SMS4\"" -peer "he1"
echo ""

echo "========= Get IJZ By Id Pd"
chaincodeQuery -f "GetIjzByIdPd" -args "\"PD1\"" -peer "he1"
chaincodeQuery -f "GetIjzByIdPd" -args "\"PD2\"" -peer "he1"
chaincodeQuery -f "GetIjzByIdPd" -args "\"PD4\"" -peer "he1"
echo ""

echo "========= Update IJZ"
chaincodeInvoke -f "UpdateIjz" -args "\"12\", \"SP1\", \"SMS1\", \"PD2\", \"S2\", \"ZX-343236\", \"230815\""  -peer "he1"
chaincodeInvoke -f "UpdateIjz" -args "\"15\", \"SP2\", \"SMS2\", \"PD5\", \"S2\", \"YM-759554\", \"230815\""  -peer "he1"
echo ""

echo "========= Delete IJZ"
chaincodeInvoke -f "DeleteIjz" -args "\"14\""  -peer "he1"
chaincodeInvoke -f "DeleteIjz" -args "\"18\""  -peer "he1"
echo ""

echo "========= Get All IJZ"
chaincodeQuery -f "GetAllIjz" -peer "he1"
echo ""

echo "========= Add Ijz Approval"
chaincodeInvoke -f "AddIjzApproval" -args "\"12\", \"PTK2\""  -peer "he1"
chaincodeInvoke -f "AddIjzApproval" -args "\"16\", \"PTK5\""  -peer "he1"
chaincodeInvoke -f "AddIjzApproval" -args "\"12\", \"PTK4\""  -peer "he1"
chaincodeInvoke -f "AddIjzApproval" -args "\"12\", \"PTK4\""  -peer "he1"
chaincodeInvoke -f "AddIjzApproval" -args "\"11\", \"PTK4\""  -peer "he1"
chaincodeInvoke -f "AddIjzApproval" -args "\"16\", \"PTK5\""  -peer "he1"
echo ""

echo "========= Get IJZ By Id"
chaincodeQuery -f "GetIjzById" -args "\"12\"" -peer "he1"
chaincodeQuery -f "GetIjzById" -args "\"16\"" -peer "he1"
chaincodeQuery -f "GetIjzById" -args "\"11\"" -peer "he1"
echo ""

echo "========= Get IJZ Add Approval Tx ID By Id"
chaincodeQuery -f "GetIjzAddApprovalTxIdById" -args "\"11\"" -peer "he1"
chaincodeQuery -f "GetIjzAddApprovalTxIdById" -args "\"12\"" -peer "he1"
echo ""

exit 0
