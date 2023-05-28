#!/bin/bash

source scripts/utils.sh

CHANNEL_NAME=${1:-"academicchannel"}
CC_NAME=${2:-"smscontract"}
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

echo "===================================== Test SMSContract ====================================="

echo "========= Create SMS"
chaincodeInvoke -f "CreateSms" -args "\"1\", \"AAA\", \"XXX\", \"S1\""  -peer "he1"
chaincodeInvoke -f "CreateSms" -args "\"2\", \"AAA\", \"YYY\", \"S1\""  -peer "he1"
chaincodeInvoke -f "CreateSms" -args "\"3\", \"AAA\", \"ZZZ\", \"S2\""  -peer "he1"
chaincodeInvoke -f "CreateSms" -args "\"4\", \"BBB\", \"PPP\", \"S1\""  -peer "he1"
chaincodeInvoke -f "CreateSms" -args "\"5\", \"BBB\", \"QQQ\", \"S1\""  -peer "he1"
chaincodeInvoke -f "CreateSms" -args "\"6\", \"CCC\", \"RRR\", \"S1\""  -peer "he1"
chaincodeInvoke -f "CreateSms" -args "\"7\", \"CCC\", \"SSS\", \"S2\""  -peer "he1"
echo ""

echo "========= Get All SMS"
chaincodeQuery -f "GetAllSms" -peer "he1"
echo ""

echo "========= Get SMS By Id"
chaincodeQuery -f "GetSmsById" -args "\"1\"" -peer "he1"
chaincodeQuery -f "GetSmsById" -args "\"3\"" -peer "he1"
chaincodeQuery -f "GetSmsById" -args "\"6\"" -peer "he1"
echo ""

echo "========= Get SMS By Id Sp"
chaincodeQuery -f "GetSmsByIdSp" -args "\"AAA\"" -peer "he1"
chaincodeQuery -f "GetSmsByIdSp" -args "\"BBB\"" -peer "he1"
chaincodeQuery -f "GetSmsByIdSp" -args "\"CCC\"" -peer "he1"
echo ""

echo "========= Update SMS"
chaincodeInvoke -f "UpdateSms" -args "\"3\", \"AAA\", \"KKK\", \"S2\""  -peer "he1"
chaincodeInvoke -f "UpdateSms" -args "\"5\", \"BBB\", \"LLL\", \"S2\""  -peer "he1"
echo ""

echo "========= Delete SMS"
chaincodeInvoke -f "DeleteSms" -args "\"7\""  -peer "he1"
echo ""

echo "========= Get All SMS"
chaincodeQuery -f "GetAllSms" -peer "he1"
echo ""

echo "========= Update SMS Signers Tsk"
chaincodeInvoke -f "UpdateSmsSignersTsk" -args "\"3\", \"[PTK3, PTK2, PTK1]\""  -peer "he1"
chaincodeInvoke -f "UpdateSmsSignersTsk" -args "\"5\", \"[PTK4, PTK5, PTK6]\""  -peer "he1"
echo ""

echo "========= Update SMS Signers Ijz"
chaincodeInvoke -f "UpdateSmsSignersIjz" -args "\"3\", \"[PTK1, PTK2, PTK3]\""  -peer "he1"
chaincodeInvoke -f "UpdateSmsSignersIjz" -args "\"5\", \"[PTK6, PTK5, PTK4]\""  -peer "he1"
echo ""

echo "========= Get All SMS"
chaincodeQuery -f "GetAllSms" -peer "he1"
echo ""

exit 0