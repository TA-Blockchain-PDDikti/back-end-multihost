#!/bin/bash

source scripts/utils.sh

CHANNEL_NAME=${1:-"academicchannel"}
CC_NAME=${2:-"npdcontract"}
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

echo "===================================== Test NPDContract ====================================="

echo "========= Create NPD"
chaincodeInvoke -f "CreateNpd" -args "\"11\", \"AAA\", \"PTK1\", \"PD1\", \"80\", \"A-\", \"3.5\""  -peer "he1"
chaincodeInvoke -f "CreateNpd" -args "\"12\", \"AAA\", \"PTK1\", \"PD2\", \"85\", \"A\", \"3.5\""  -peer "he1"
chaincodeInvoke -f "CreateNpd" -args "\"13\", \"AAA\", \"PTK2\", \"PD3\", \"85\", \"A\", \"3.5\""  -peer "he1"
chaincodeInvoke -f "CreateNpd" -args "\"14\", \"BBB\", \"PTK3\", \"PD4\", \"80\", \"A-\", \"3.5\""  -peer "he1"
chaincodeInvoke -f "CreateNpd" -args "\"15\", \"BBB\", \"PTK3\", \"PD5\", \"80\", \"A-\", \"3.5\""  -peer "he1"
chaincodeInvoke -f "CreateNpd" -args "\"16\", \"CCC\", \"PTK4\", \"PD1\", \"79\", \"B+\", \"3.5\""  -peer "he1"
chaincodeInvoke -f "CreateNpd" -args "\"17\", \"BBB\", \"PTK3\", \"PD2\", \"80\", \"A-\", \"3.5\""  -peer "he1"
chaincodeInvoke -f "CreateNpd" -args "\"18\", \"BBB\", \"PTK3\", \"PD6\", \"85\", \"A\", \"3.5\""  -peer "he1"
chaincodeInvoke -f "CreateNpd" -args "\"19\", \"AAA\", \"PTK2\", \"PD7\", \"79\", \"B+\", \"3.5\""  -peer "he1"
chaincodeInvoke -f "CreateNpd" -args "\"20\", \"BBB\", \"PTK3\", \"PD8\", \"79\", \"B+\", \"3.5\""  -peer "he1"
chaincodeInvoke -f "CreateNpd" -args "\"21\", \"AAA\", \"PTK2\", \"PD9\", \"80\", \"A-\", \"3.5\""  -peer "he1"
chaincodeInvoke -f "CreateNpd" -args "\"22\", \"DDD\", \"PTK5\", \"PD1\", \"79\", \"B+\", \"3.5\""  -peer "he1"
chaincodeInvoke -f "CreateNpd" -args "\"23\", \"DDD\", \"PTK5\", \"PD2\", \"79\", \"B+\", \"3.5\""  -peer "he1"
chaincodeInvoke -f "CreateNpd" -args "\"24\", \"CCC\", \"PTK4\", \"PD3\", \"74\", \"B\", \"3.5\""  -peer "he1"
chaincodeInvoke -f "CreateNpd" -args "\"25\", \"DDD\", \"PTK6\", \"PD5\", \"74\", \"B\", \"3.5\""  -peer "he1"
echo ""

echo "========= Get All NPD"
chaincodeQuery -f "GetAllNpd" -peer "he1"
echo ""

echo "========= Get NPD By Id"
chaincodeQuery -f "GetNpdById" -args "\"11\"" -peer "he1"
chaincodeQuery -f "GetNpdById" -args "\"13\"" -peer "he1"
chaincodeQuery -f "GetNpdById" -args "\"16\"" -peer "he1"
echo ""

echo "========= Get NPD By Id Kls"
chaincodeQuery -f "GetNpdByIdKls" -args "\"AAA\"" -peer "he1"
chaincodeQuery -f "GetNpdByIdKls" -args "\"BBB\"" -peer "he1"
chaincodeQuery -f "GetNpdByIdKls" -args "\"CCC\"" -peer "he1"
echo ""

echo "========= Get NPD By Id Pd"
chaincodeQuery -f "GetNpdByIdPd" -args "\"PD1\"" -peer "he1"
chaincodeQuery -f "GetNpdByIdPd" -args "\"PD2\"" -peer "he1"
chaincodeQuery -f "GetNpdByIdPd" -args "\"PD4\"" -peer "he1"
echo ""

echo "========= Update NPD"
chaincodeInvoke -f "UpdateNpd" -args "\"15\", \"BBB\", \"PTK8\", \"PD5\", \"80\", \"A-\", \"3.5\""  -peer "he1"
chaincodeInvoke -f "UpdateNpd" -args "\"22\", \"DDD\", \"PTK5\", \"PD1\", \"85\", \"A\", \"3.5\""  -peer "he1"
echo ""

echo "========= Delete NPD"
chaincodeInvoke -f "DeleteNpd" -args "\"14\""  -peer "he1"
chaincodeInvoke -f "DeleteNpd" -args "\"18\""  -peer "he1"
chaincodeInvoke -f "DeleteNpd" -args "\"23\""  -peer "he1"
echo ""

echo "========= Get All NPD"
chaincodeQuery -f "GetAllNpd" -peer "he1"
echo ""

echo "========= Get NPD By Id"
chaincodeQuery -f "GetNpdById" -args "\"15\"" -peer "he1"
chaincodeQuery -f "GetNpdById" -args "\"19\"" -peer "he1"
chaincodeQuery -f "GetNpdById" -args "\"12\"" -peer "he1"
echo ""

echo "========= Get NPD Last Tx Id By Id"
chaincodeQuery -f "GetNpdLastTxIdById" -args "\"15\"" -peer "he1"
chaincodeQuery -f "GetNpdLastTxIdById" -args "\"19\"" -peer "he1"
chaincodeQuery -f "GetNpdLastTxIdById" -args "\"22\"" -peer "he1"
echo ""

exit 0