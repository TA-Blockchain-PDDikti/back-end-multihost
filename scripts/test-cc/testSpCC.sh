#!/bin/bash

source scripts/utils.sh

CHANNEL_NAME=${1:-"academicchannel"}
CC_NAME=${2:-"spcontract"}
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

echo "===================================== Test SPContract ====================================="

echo "========= Create SP"
chaincodeInvoke -f "CreateSp" -args "\"1\", \"MSP1\", \"SP1\", \"adminsp1\""  -peer "kemdikbud"
chaincodeInvoke -f "CreateSp" -args "\"2\", \"MSP2\", \"SP2\", \"adminsp2\""  -peer "kemdikbud"
chaincodeInvoke -f "CreateSp" -args "\"3\", \"MSP3\", \"SP3\", \"adminsp3\""  -peer "kemdikbud"
chaincodeInvoke -f "CreateSp" -args "\"4\", \"MSP4\", \"SP4\", \"adminsp4\""  -peer "kemdikbud"
chaincodeInvoke -f "CreateSp" -args "\"5\", \"MSP5\", \"SP5\", \"adminsp5\""  -peer "kemdikbud"
chaincodeInvoke -f "CreateSp" -args "\"6\", \"MSP6\", \"SP6\", \"adminsp6\""  -peer "kemdikbud"
chaincodeInvoke -f "CreateSp" -args "\"7\", \"MSP7\", \"SP7\", \"adminsp7\""  -peer "kemdikbud"
echo ""

echo "========= Get All SP"
chaincodeQuery -f "GetAllSp" -peer "kemdikbud"
echo ""

echo "========= Get SP By Id"
chaincodeQuery -f "GetSpById" -args "\"1\"" -peer "kemdikbud"
chaincodeQuery -f "GetSpById" -args "\"3\"" -peer "kemdikbud"
chaincodeQuery -f "GetSpById" -args "\"6\"" -peer "kemdikbud"
echo ""

echo "========= Update SP"
chaincodeInvoke -f "UpdateSp" -args "\"3\", \"MSP313\", \"SP131\""  -peer "kemdikbud"
chaincodeInvoke -f "UpdateSp" -args "\"5\", \"MSP515\", \"SP151\""  -peer "kemdikbud"
echo ""

echo "========= Delete SP"
chaincodeInvoke -f "DeleteSp" -args "\"7\""  -peer "kemdikbud"
echo ""

echo "========= Get All SP"
chaincodeQuery -f "GetAllSp" -peer "kemdikbud"
echo ""

exit 0