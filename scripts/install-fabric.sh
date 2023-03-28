#!/bin/bash
# Scripts to install fabric binaries and docker


#########################################################

echo "--------------------------------------------------"
echo "------- Install Fabric Binaries and Docker -------"
echo "--------------------------------------------------"

set -x

rm -Rf fabric

mkdir fabric
pushd fabric

FABRICVER='2.4.9'       # Fabric Version
FABRICCAVER='1.5.5'     # Fabric CA Version

curl -sSL -o install-fabric.sh https://s.id/fabric-script && chmod +x install-fabric.sh
./install-fabric.sh -f $FABRICVER -c $FABRICCAVER d b
res=$?

{ set +x; } 2>/dev/null
if [ $res -eq 0 ]; then
  echo "--------------------------------------------------"
  echo "Add fabric path"

  echo "#Hyperledger Fabric" >> ~/.bashrc
  echo "FABRICPATH=$(pwd)/bin" >> ~/.bashrc
  echo 'export PATH=$PATH:$FABRICPATH' >> ~/.bashrc

  echo "--------------------------------------------------"
  echo "Successfully install fabric docker and binaries"
  echo ""
else
  echo "--------------------------------------------------"
  echo "Failed to install fabric docker and binaries"
  echo ""
fi

popd

#########################################################

echo "--------------------------------------------------"