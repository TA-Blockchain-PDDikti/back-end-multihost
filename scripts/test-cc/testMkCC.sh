#!/bin/bash

source scripts/utils.sh

CHANNEL_NAME=${1:-"academicchannel"}
CC_NAME=${2:-"mkcontract"}
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

echo "===================================== Test MKContract ====================================="

echo "========= Create MK"
chaincodeInvoke -f "CreateMk" -args "\"1\", \"AAA\", \"XXX\", \"Ecom\", \"Kode1\", \"3\", \"Sarjana\""  -peer "he1"
chaincodeInvoke -f "CreateMk" -args "\"2\", \"AAA\", \"XXX\", \"Kombis\", \"Kode2\", \"3\", \"Sarjana\""  -peer "he1"
chaincodeInvoke -f "CreateMk" -args "\"3\", \"AAA\", \"YYY\", \"Adpro\", \"Kode3\", \"4\", \"Sarjana\""  -peer "he1"
chaincodeInvoke -f "CreateMk" -args "\"4\", \"BBB\", \"PPP\", \"Ecom\", \"Kode4\", \"3\", \"Magister\""  -peer "he1"
chaincodeInvoke -f "CreateMk" -args "\"5\", \"BBB\", \"PPP\", \"Math\", \"Kode5\", \"2\", \"Sarjana\""  -peer "he1"
chaincodeInvoke -f "CreateMk" -args "\"6\", \"CCC\", \"RRR\", \"Fisio\", \"Kode6\", \"3\", \"Doktoral\""  -peer "he1"
chaincodeInvoke -f "CreateMk" -args "\"7\", \"BBB\", \"QQQ\", \"Tenal\", \"Kode7\", \"2\", \"Sarjana\""  -peer "he1"
chaincodeInvoke -f "CreateMk" -args "\"8\", \"BBB\", \"QQQ\", \"Budaya\", \"Kode8\", \"2\", \"Magister\""  -peer "he1"
chaincodeInvoke -f "CreateMk" -args "\"9\", \"AAA\", \"YYY\", \"Algo\", \"Kode9\", \"4\", \"Sarjana\""  -peer "he1"
chaincodeInvoke -f "CreateMk" -args "\"10\", \"AAA\", \"YYY\", \"Kripto\", \"Kode10\", \"4\", \"Sarjana\""  -peer "he1"
chaincodeInvoke -f "CreateMk" -args "\"11\", \"AAA\", \"ZZZ\", \"Bio\", \"Kode11\", \"2\", \"Doktoral\""  -peer "he1"
chaincodeInvoke -f "CreateMk" -args "\"12\", \"CCC\", \"RRR\", \"Pharma\", \"Kode12\", \"4\", \"Sarjana\""  -peer "he1"
echo ""

echo "========= Get All MK"
chaincodeQuery -f "GetAllMk" -peer "he1"
echo ""

echo "========= Get MK By Id"
chaincodeQuery -f "GetMkById" -args "\"1\"" -peer "he1"
chaincodeQuery -f "GetMkById" -args "\"3\"" -peer "he1"
chaincodeQuery -f "GetMkById" -args "\"6\"" -peer "he1"
echo ""

echo "========= Get MK By Id SP"
chaincodeQuery -f "GetMkByIdSp" -args "\"AAA\"" -peer "he1"
chaincodeQuery -f "GetMkByIdSp" -args "\"BBB\"" -peer "he1"
chaincodeQuery -f "GetMkByIdSp" -args "\"CCC\"" -peer "he1"
echo ""

echo "========= Update MK"
chaincodeInvoke -f "UpdateMk" -args "\"4\", \"BBB\", \"PPP\", \"Audit\", \"Kode41\", \"2\", \"Magister\""  -peer "he1"
chaincodeInvoke -f "UpdateMk" -args "\"10\", \"AAA\", \"YYY\", \"Comsoc\", \"Kode101\", \"3\", \"Sarjana\""  -peer "he1"
echo ""

echo "========= Delete MK"
chaincodeInvoke -f "DeleteMk" -args "\"7\""  -peer "he1"
chaincodeInvoke -f "DeleteMk" -args "\"8\""  -peer "he1"
echo ""

echo "========= Get All MK"
chaincodeQuery -f "GetAllMk" -peer "he1"
echo ""


exit 0