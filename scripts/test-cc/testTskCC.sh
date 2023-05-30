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

echo "===================================== Test TSKContract ====================================="

echo "========= Create TSK"
chaincodeInvoke -f "CreateTsk" -args "\"11\", \"SP1\", \"SMS1\", \"PD1\", \"S1\", \"378\", \"104\", \"3.67\""  -peer "he1"
chaincodeInvoke -f "CreateTsk" -args "\"12\", \"SP1\", \"SMS1\", \"PD2\", \"S1\", \"492\", \"112\", \"3.67\""  -peer "he1"
chaincodeInvoke -f "CreateTsk" -args "\"13\", \"SP2\", \"SMS2\", \"PD3\", \"S1\", \"322\", \"105\", \"3.67\""  -peer "he1"
chaincodeInvoke -f "CreateTsk" -args "\"14\", \"SP2\", \"SMS3\", \"PD4\", \"S1\", \"393\", \"107\", \"3.67\""  -peer "he1"
chaincodeInvoke -f "CreateTsk" -args "\"15\", \"SP2\", \"SMS2\", \"PD5\", \"S1\", \"372\", \"104\", \"3.67\""  -peer "he1"
chaincodeInvoke -f "CreateTsk" -args "\"16\", \"SP1\", \"SMS4\", \"PD6\", \"S1\", \"376\", \"103\", \"3.67\""  -peer "he1"
chaincodeInvoke -f "CreateTsk" -args "\"17\", \"SP3\", \"SMS5\", \"PD7\", \"S1\", \"343\", \"145\", \"3.67\""  -peer "he1"
chaincodeInvoke -f "CreateTsk" -args "\"18\", \"SP3\", \"SMS5\", \"PD8\", \"S1\", \"412\", \"148\", \"3.67\""  -peer "he1"
chaincodeInvoke -f "CreateTsk" -args "\"19\", \"SP2\", \"SMS3\", \"PD9\", \"S1\", \"402\", \"135\", \"3.67\""  -peer "he1"
echo ""

echo "========= Get All TSK"
chaincodeQuery -f "GetAllTsk" -peer "he1"
echo ""

echo "========= Get TSK By Id"
chaincodeQuery -f "GetTskById" -args "\"11\"" -peer "he1"
chaincodeQuery -f "GetTskById" -args "\"13\"" -peer "he1"
chaincodeQuery -f "GetTskById" -args "\"16\"" -peer "he1"
echo ""

echo "========= Get TSK By Id SP"
chaincodeQuery -f "GetTskByIdSp" -args "\"SP1\"" -peer "he1"
chaincodeQuery -f "GetTskByIdSp" -args "\"SP2\"" -peer "he1"
chaincodeQuery -f "GetTskByIdSp" -args "\"SP3\"" -peer "he1"
echo ""

echo "========= Get TSK By Id Sms"
chaincodeQuery -f "GetTskByIdSms" -args "\"SMS1\"" -peer "he1"
chaincodeQuery -f "GetTskByIdSms" -args "\"SMS2\"" -peer "he1"
chaincodeQuery -f "GetTskByIdSms" -args "\"SMS4\"" -peer "he1"
echo ""

echo "========= Get TSK By Id Pd"
chaincodeQuery -f "GetTskByIdPd" -args "\"PD1\"" -peer "he1"
chaincodeQuery -f "GetTskByIdPd" -args "\"PD2\"" -peer "he1"
chaincodeQuery -f "GetTskByIdPd" -args "\"PD4\"" -peer "he1"
echo ""

echo "========= Update TSK"
chaincodeInvoke -f "UpdateTsk" -args "\"12\", \"SP1\", \"SMS1\", \"PD2\", \"S1\", \"492\", \"140\", \"3.99\""  -peer "he1"
chaincodeInvoke -f "UpdateTsk" -args "\"19\", \"SP2\", \"SMS3\", \"PD9\", \"S1\", \"444\", \"144\", \"3.88\""  -peer "he1"
echo ""

echo "========= Delete TSK"
chaincodeInvoke -f "DeleteTsk" -args "\"14\""  -peer "he1"
chaincodeInvoke -f "DeleteTsk" -args "\"18\""  -peer "he1"
echo ""

echo "========= Get All TSK"
chaincodeQuery -f "GetAllTsk" -peer "he1"
echo ""

echo "========= Add Tsk Approval"
chaincodeInvoke -f "AddTskApproval" -args "\"12\", \"PTK2\""  -peer "he1"
chaincodeInvoke -f "AddTskApproval" -args "\"16\", \"PTK5\""  -peer "he1"
chaincodeInvoke -f "AddTskApproval" -args "\"12\", \"PTK4\""  -peer "he1"
chaincodeInvoke -f "AddTskApproval" -args "\"12\", \"PTK3\""  -peer "he1"
chaincodeInvoke -f "AddTskApproval" -args "\"11\", \"PTK4\""  -peer "he1"
chaincodeInvoke -f "AddTskApproval" -args "\"16\", \"PTK4\""  -peer "he1"
echo ""

echo "========= Get TSK By Id"
chaincodeQuery -f "GetTskById" -args "\"12\"" -peer "he1"
chaincodeQuery -f "GetTskById" -args "\"16\"" -peer "he1"
chaincodeQuery -f "GetTskById" -args "\"11\"" -peer "he1"
echo ""

echo "========= Get TSK Add Approval Tx ID By Id"
chaincodeQuery -f "GetTskAddApprovalTxIdById" -args "\"11\"" -peer "he1"
chaincodeQuery -f "GetTskAddApprovalTxIdById" -args "\"12\"" -peer "he1"
echo ""

exit 0