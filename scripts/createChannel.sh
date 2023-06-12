#!/bin/bash

# imports
. scripts/envVar.sh
. scripts/utils.sh

CHANNEL_NAME="$1"
DELAY="$2"
MAX_RETRY="$3"
VERBOSE="$4"
: ${CHANNEL_NAME:="mychannel"}
: ${DELAY:="3"}
: ${MAX_RETRY:="5"}
: ${VERBOSE:="false"}

: ${CONTAINER_CLI:="docker"}
: ${CONTAINER_CLI_COMPOSE:="${CONTAINER_CLI}-compose"}
infoln "Using ${CONTAINER_CLI} and ${CONTAINER_CLI_COMPOSE}"

if [ ! -d "channel-artifacts" ]; then
	mkdir channel-artifacts
fi

createChannelGenesisBlock() {
	which configtxgen
	if [ "$?" -ne 0 ]; then
		fatalln "configtxgen tool not found."
	fi
	set -x
	configtxgen -profile TwoOrgsGenesis -outputBlock ./channel-artifacts/${CHANNEL_NAME}.block -channelID $CHANNEL_NAME
	res=$?
	{ set +x; } 2>/dev/null
  verifyResult $res "Failed to generate channel configuration transaction..."
}

createChannel() {
  ORG=$1
	setGlobals $ORG
	# Poll in case the raft leader is not set yet
	local rc=1
	local COUNTER=1
	while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ] ; do
		sleep $DELAY
		set -x
		osnadmin channel join --channelID $CHANNEL_NAME --config-block ./channel-artifacts/${CHANNEL_NAME}.block -o "10.128.0.4:7053" --ca-file "$ORDERER_CA" --client-cert "$ORDERER_ADMIN_TLS_SIGN_CERT" --client-key "$ORDERER_ADMIN_TLS_PRIVATE_KEY" >&log.txt
		res=$?
		{ set +x; } 2>/dev/null
		let rc=$res
		COUNTER=$(expr $COUNTER + 1)
	done
	cat log.txt
	verifyResult $res "Channel creation failed"
}

# joinChannel ORG
joinChannel() {
  FABRIC_CFG_PATH=./configtx/
  ORG=$1
  setGlobals $ORG
	local rc=1
	local COUNTER=1
	## Sometimes Join takes time, hence retry
	while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ] ; do
    sleep $DELAY
    set -x
    peer channel join -b $BLOCKFILE >&log.txt
    res=$?
    { set +x; } 2>/dev/null
		let rc=$res
		COUNTER=$(expr $COUNTER + 1)
	done
	cat log.txt
	verifyResult $res "After $MAX_RETRY attempts, peer0.${ORG} has failed to join channel '$CHANNEL_NAME' "
}

setAnchorPeer() {
  ORG=$1
  ${CONTAINER_CLI} exec cli ./scripts/setAnchorPeer.sh $ORG $CHANNEL_NAME
}

CORE_PEER_TLS_ENABLED=true
ORDERER_CA=$PWD/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
FABRIC_CFG_PATH=./configtx/

BLOCKFILE="./channel-artifacts/${CHANNEL_NAME}.block"

initChannelH1() {
  # Create channel genesis block
  infoln "Generating channel genesis block '${CHANNEL_NAME}.block'"
  createChannelGenesisBlock

  successln "Genesis block created"

  # Create channel
  infoln "Creating channel ${CHANNEL_NAME}"
  createChannel 'kemdikbudp0'

  successln "Channel '$CHANNEL_NAME' created"
}

joinChannelH1() {
  # Join the peers to the channel
  infoln "Joining kemdikbud peer to the channel..."
  joinChannel 'kemdikbudp0'

  successln "Success Join Channel '$CHANNEL_NAME'"
}

joinChannelH2() {
  # Join the peers to the channel
  infoln "Joining kemdikbud peer to the channel..."
  joinChannel 'he1p0'

  successln "Success Join Channel '$CHANNEL_NAME'"
}

joinChannelH3() {
  # Join the peers to the channel
  infoln "Joining kemdikbud peer to the channel..."
  joinChannel 'he1p1'

  successln "Success Join Channel '$CHANNEL_NAME'"
}

setAnchorPeerH1() {
  infoln "Setting anchor peer"
  setAnchorPeer 'kemdikbudp0'

  successln "Success Set Anchor Peer"
}

setAnchorPeerH1() {
  infoln "Setting anchor peer"
  setAnchorPeer 'he1p0'

  successln "Success Set Anchor Peer"
}

setAnchorPeerH3() {
  infoln "Setting anchor peer"
  setAnchorPeer 'he1p1'

  successln "Success Set Anchor Peer"
}
