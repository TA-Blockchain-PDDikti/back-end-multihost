#!/bin/bash

source scripts/utils.sh

CHANNEL_NAME=${1:-"academicchannel"}
CC_NAME=${2:-"klscontract"}
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

echo "===================================== Test KLSContract ====================================="

echo "========= Create KLS"
chaincodeInvoke -f "CreateKls" -args "\"1\", \"SP1\", \"XXX\", \"ECOM A\", \"22/23 Gasal\", \"3\""  -peer "he1"
chaincodeInvoke -f "CreateKls" -args "\"2\", \"SP1\", \"XXX\", \"ECOM B\", \"22/23 Gasal\", \"3\""  -peer "he1"
chaincodeInvoke -f "CreateKls" -args "\"3\", \"SP1\", \"YYY\", \"AP\", \"22/23 Gasal\", \"4\""  -peer "he1"
chaincodeInvoke -f "CreateKls" -args "\"4\", \"SP2\", \"PPP\", \"MATH A\", \"22/23 Gasal\", \"3\""  -peer "he1"
chaincodeInvoke -f "CreateKls" -args "\"5\", \"SP2\", \"PPP\", \"MATH B\", \"22/23 Gasal\", \"3\""  -peer "he1"
chaincodeInvoke -f "CreateKls" -args "\"6\", \"SP3\", \"RRR\", \"KRIP\", \"22/23 Genap\", \"3\""  -peer "he1"
chaincodeInvoke -f "CreateKls" -args "\"7\", \"SP2\", \"QQQ\", \"PHIS\", \"22/23 Gasal\", \"2\""  -peer "he1"
chaincodeInvoke -f "CreateKls" -args "\"8\", \"SP2\", \"QQQ\", \"PHIS\", \"21/22 Gasal\", \"2\""  -peer "he1"
chaincodeInvoke -f "CreateKls" -args "\"9\", \"SP1\", \"YYY\", \"AP A\", \"22/23 Genap\", \"4\""  -peer "he1"
chaincodeInvoke -f "CreateKls" -args "\"10\", \"SP1\", \"YYY\", \"AP B\", \"22/23 Genap\", \"4\""  -peer "he1"
chaincodeInvoke -f "CreateKls" -args "\"11\", \"SP1\", \"YYY\", \"AP B\", \"22/23 Genap\", \"4\""  -peer "he1"
echo ""

echo "========= Get All KLS"
chaincodeQuery -f "GetAllKls" -peer "he1"
echo ""

echo "========= Get KLS By Id"
chaincodeQuery -f "GetKlsById" -args "\"1\"" -peer "he1"
chaincodeQuery -f "GetKlsById" -args "\"3\"" -peer "he1"
chaincodeQuery -f "GetKlsById" -args "\"6\"" -peer "he1"
echo ""

echo "========= Get KLS By Id Mk"
chaincodeQuery -f "GetKlsByIdMk" -args "\"XXX\"" -peer "he1"
chaincodeQuery -f "GetKlsByIdMk" -args "\"YYY\"" -peer "he1"
chaincodeQuery -f "GetKlsByIdMk" -args "\"PPP\"" -peer "he1"
echo ""

echo "========= Update KLS"
chaincodeInvoke -f "UpdateKls" -args "\"7\", \"BBB\", \"QQQ\", \"PHAR\", \"22/23 Gasal\", \"2\""  -peer "he1"
chaincodeInvoke -f "UpdateKls" -args "\"5\", \"BBB\", \"PPP\", \"MATH A\", \"22/23 Genap\", \"2\""  -peer "he1"
echo ""

echo "========= Delete KLS"
chaincodeInvoke -f "DeleteKls" -args "\"4\""  -peer "he1"
echo ""

echo "========= Get All KLS"
chaincodeQuery -f "GetAllKls" -peer "he1"
echo ""

echo "========= Update KLS ListPTK"
chaincodeInvoke -f "UpdateKlsListPtk" -args "\"9\", \"[DSN1, DSN2]\""  -peer "he1"
chaincodeInvoke -f "UpdateKlsListPtk" -args "\"5\", \"[DSN3]\""  -peer "he1"
echo ""

echo "========= Update KLS ListPD"
chaincodeInvoke -f "UpdateKlsListPd" -args "\"2\", \"[MHS1, MHS2, MHS3, MHS4, MHS5, MHS6]\""  -peer "he1"
chaincodeInvoke -f "UpdateKlsListPd" -args "\"5\", \"[MHS3, MHS5, MHS6, MHS7, MHS8]\""  -peer "he1"
echo ""

echo "========= Get KLS By Id"
chaincodeQuery -f "GetKlsById" -args "\"5\"" -peer "he1"
chaincodeQuery -f "GetKlsById" -args "\"9\"" -peer "he1"
chaincodeQuery -f "GetKlsById" -args "\"2\"" -peer "he1"
echo ""

echo "========= Get KLS By Id Sp"
chaincodeQuery -f "GetKlsByIdSp" -args "\"SP1\"" -peer "he1"
chaincodeQuery -f "GetKlsByIdSp" -args "\"SP2\"" -peer "he1"
chaincodeQuery -f "GetKlsByIdSp" -args "\"SP3\"" -peer "he1"
echo ""

exit 0