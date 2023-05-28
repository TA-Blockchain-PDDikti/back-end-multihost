#!/bin/bash

source scripts/utils.sh

CHANNEL_NAME=${1:-"academicchannel"}
CC_NAME=${2:-"ptkcontract"}
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


echo "===================================== Test PTKContract ====================================="

echo "========= Create PTK"
chaincodeInvoke -f "CreatePtk" -args "\"1\", \"SP1\", \"SMS1\", \"Namaxx1\", \"NIDN1\", \"Jabatan1\", \"NomorSK1\", \"unptk1\""  -peer "he1"
chaincodeInvoke -f "CreatePtk" -args "\"2\", \"SP1\", \"SMS2\", \"Namaxx2\", \"NIDN2\", \"Jabatan2\", \"NomorSK2\", \"unptk2\""  -peer "he1"
chaincodeInvoke -f "CreatePtk" -args "\"3\", \"SP1\", \"SMS1\", \"NamaXX3\", \"NIDN3\", \"Jabatan3\", \"NomorSK3\", \"unptk3\""  -peer "he1"
chaincodeInvoke -f "CreatePtk" -args "\"4\", \"SP2\", \"SMS3\", \"Namaxx4\", \"NIDN4\", \"Jabatan4\", \"NomorSK4\", \"unptk4\""  -peer "he1"
chaincodeInvoke -f "CreatePtk" -args "\"5\", \"SP2\", \"SMS3\", \"Namaxx5\", \"NIDN5\", \"Jabatan5\", \"NomorSK5\", \"unptk5\""  -peer "he1"
chaincodeInvoke -f "CreatePtk" -args "\"6\", \"SP3\", \"SMS4\", \"Namaxx6\", \"NIDN6\", \"Jabatan6\", \"NomorSK6\", \"unptk6\""  -peer "he1"
chaincodeInvoke -f "CreatePtk" -args "\"7\", \"SP3\", \"SMS5\", \"NamaXX7\", \"NIDN7\", \"Jabatan7\", \"NomorSK7\", \"unptk7\""  -peer "he1"
chaincodeInvoke -f "CreatePtk" -args "\"8\", \"SP2\", \"SMS6\", \"NamaXX8\", \"NIDN8\", \"Jabatan8\", \"NomorSK8\", \"unptk8\""  -peer "he1"
chaincodeInvoke -f "CreatePtk" -args "\"9\", \"SP1\", \"SMS2\", \"NamaXX9\", \"NIDN9\", \"Jabatan9\", \"NomorSK9\", \"unptk9\""  -peer "he1"
echo ""

echo "========= Get All PTK"
chaincodeQuery -f "GetAllPtk" -peer "he1"
echo ""

echo "========= Get PTK By Id"
chaincodeQuery -f "GetPtkById" -args "\"1\"" -peer "he1"
chaincodeQuery -f "GetPtkById" -args "\"3\"" -peer "he1"
chaincodeQuery -f "GetPtkById" -args "\"6\"" -peer "he1"
echo ""

echo "========= Get PTK By Id Sp"
chaincodeQuery -f "GetPtkByIdSp" -args "\"SP1\"" -peer "he1"
chaincodeQuery -f "GetPtkByIdSp" -args "\"SP2\"" -peer "he1"
chaincodeQuery -f "GetPtkByIdSp" -args "\"SP3\"" -peer "he1"
echo ""

echo "========= Get PTK By Id Sms"
chaincodeQuery -f "GetPtkByIdSms" -args "\"SMS1\"" -peer "he1"
chaincodeQuery -f "GetPtkByIdSms" -args "\"SMS2\"" -peer "he1"
chaincodeQuery -f "GetPtkByIdSms" -args "\"SMS3\"" -peer "he1"
echo ""

echo "========= Update PTK"
chaincodeInvoke -f "UpdatePtk" -args "\"5\", \"SP2\", \"SMS3\", \"Namayy5\", \"NIDN5\", \"Jabatan15\", \"NomorSK15\""  -peer "he1"
chaincodeInvoke -f "UpdatePtk" -args "\"9\", \"SP1\", \"SMS1\", \"Namayy9\", \"NIDN9\", \"Jabatan19\", \"NomorSK19\""  -peer "he1"
echo ""

echo "========= Delete PTK"
chaincodeInvoke -f "DeletePtk" -args "\"7\""  -peer "he1"
chaincodeInvoke -f "DeletePtk" -args "\"4\""  -peer "he1"
echo ""

echo "========= Get All PTK"
chaincodeQuery -f "GetAllPtk" -peer "he1"
echo ""

echo "========= Get PTK By Id"
chaincodeQuery -f "GetPtkById" -args "\"1\"" -peer "he1"
chaincodeQuery -f "GetPtkById" -args "\"5\"" -peer "he1"
chaincodeQuery -f "GetPtkById" -args "\"9\"" -peer "he1"
echo ""


exit 0