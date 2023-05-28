#!/bin/bash

source scripts/utils.sh

CHANNEL_NAME=${1:-"academicchannel"}
CC_NAME=${2:-"pdcontract"}
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


echo "===================================== Test PDContract ====================================="

echo "========= Create PD"
chaincodeInvoke -f "CreatePd" -args "\"1\", \"SP1\", \"SMS1\", \"Namaxx1\", \"NIPD1\", \"unpd1\""  -peer "he1"
chaincodeInvoke -f "CreatePd" -args "\"2\", \"SP1\", \"SMS2\", \"Namaxx2\", \"NIPD2\", \"unpd2\""  -peer "he1"
chaincodeInvoke -f "CreatePd" -args "\"3\", \"SP1\", \"SMS1\", \"NamaXX3\", \"NIPD3\", \"unpd3\""  -peer "he1"
chaincodeInvoke -f "CreatePd" -args "\"4\", \"SP2\", \"SMS3\", \"Namaxx4\", \"NIPD4\", \"unpd4\""  -peer "he1"
chaincodeInvoke -f "CreatePd" -args "\"5\", \"SP2\", \"SMS3\", \"Namaxx5\", \"NIPD5\", \"unpd5\""  -peer "he1"
chaincodeInvoke -f "CreatePd" -args "\"6\", \"SP3\", \"SMS4\", \"Namaxx6\", \"NIPD6\", \"unpd6\""  -peer "he1"
chaincodeInvoke -f "CreatePd" -args "\"7\", \"SP3\", \"SMS5\", \"NamaXX7\", \"NIPD7\", \"unpd7\""  -peer "he1"
chaincodeInvoke -f "CreatePd" -args "\"8\", \"SP2\", \"SMS6\", \"NamaXX8\", \"NIPD8\", \"unpd8\""  -peer "he1"
chaincodeInvoke -f "CreatePd" -args "\"9\", \"SP1\", \"SMS2\", \"NamaXX9\", \"NIPD9\", \"unpd9\""  -peer "he1"
echo ""

echo "========= Get All PD"
chaincodeQuery -f "GetAllPd" -peer "he1"
echo ""

echo "========= Get PD By Id"
chaincodeQuery -f "GetPdById" -args "\"1\"" -peer "he1"
chaincodeQuery -f "GetPdById" -args "\"3\"" -peer "he1"
chaincodeQuery -f "GetPdById" -args "\"6\"" -peer "he1"
echo ""

echo "========= Get PD By Id Sp"
chaincodeQuery -f "GetPdByIdSp" -args "\"SP1\"" -peer "he1"
chaincodeQuery -f "GetPdByIdSp" -args "\"SP2\"" -peer "he1"
chaincodeQuery -f "GetPdByIdSp" -args "\"SP3\"" -peer "he1"
echo ""

echo "========= Get PD By Id Sms"
chaincodeQuery -f "GetPdByIdSms" -args "\"SMS1\"" -peer "he1"
chaincodeQuery -f "GetPdByIdSms" -args "\"SMS2\"" -peer "he1"
chaincodeQuery -f "GetPdByIdSms" -args "\"SMS3\"" -peer "he1"
echo ""

echo "========= Update PD"
chaincodeInvoke -f "UpdatePd" -args "\"2\", \"SP1\", \"SMS2\", \"Namayy2\", \"NIPD2\""  -peer "he1"
chaincodeInvoke -f "UpdatePd" -args "\"7\", \"SP3\", \"SMS5\", \"Namayy7\", \"NIPD7\""  -peer "he1"
echo ""

echo "========= Delete PD"
chaincodeInvoke -f "DeletePd" -args "\"3\""  -peer "he1"
chaincodeInvoke -f "DeletePd" -args "\"8\""  -peer "he1"
echo ""

echo "========= Get All PD"
chaincodeQuery -f "GetAllPd" -peer "he1"
echo ""

echo "========= UpdatePdRecord"
chaincodeInvoke -f "UpdatePdRecord" -args "\"1\", \"132\", \"123\", \"3.35\""  -peer "he1"
chaincodeInvoke -f "UpdatePdRecord" -args "\"7\", \"167\", \"144\", \"3.27\""  -peer "he1"
chaincodeInvoke -f "UpdatePdRecord" -args "\"9\", \"119\", \"105\", \"3.57\""  -peer "he1"
echo ""

echo "========= Set Pd Graduated"
chaincodeInvoke -f "SetPdGraduated" -args "\"7\""  -peer "he1"
echo ""

echo "========= Get PD By Id"
chaincodeQuery -f "GetPdById" -args "\"1\"" -peer "he1"
chaincodeQuery -f "GetPdById" -args "\"7\"" -peer "he1"
chaincodeQuery -f "GetPdById" -args "\"9\"" -peer "he1"
echo ""

echo "========= Get All PD"
chaincodeQuery -f "GetAllPd" -peer "he1"
echo ""


exit 0