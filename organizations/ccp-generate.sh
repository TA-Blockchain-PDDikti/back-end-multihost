#!/bin/bash

function one_line_pem {
    echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
}

function json_ccp {
    local PP=$(one_line_pem $5)
    local CP=$(one_line_pem $6)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${ORGCAP}/$2/" \
        -e "s/\${P0PORT}/$3/" \
        -e "s/\${CAPORT}/$4/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        organizations/ccp-template.json
}

function yaml_ccp {
    local PP=$(one_line_pem $5)
    local CP=$(one_line_pem $6)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${ORGCAP}/$2/" \
        -e "s/\${P0PORT}/$3/" \
        -e "s/\${CAPORT}/$4/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        organizations/ccp-template.yaml | sed -e $'s/\\\\n/\\\n          /g'
}

ORG=kemdikbud
ORGCAP=Kemdikbud
P0PORT=7051
CAPORT=7054
PEERPEM=organizations/peerOrganizations/kemdikbud.example.com/tlsca/tlsca.kemdikbud.example.com-cert.pem
CAPEM=organizations/peerOrganizations/kemdikbud.example.com/ca/ca.kemdikbud.example.com-cert.pem

echo "$(json_ccp $ORG $ORGCAP $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/kemdikbud.example.com/connection-kemdikbud.json
echo "$(yaml_ccp $ORG $ORGCAP $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/kemdikbud.example.com/connection-kemdikbud.yaml

ORG=he1
ORGCAP=HE1
P0PORT=9051
CAPORT=8054
PEERPEM=organizations/peerOrganizations/he1.example.com/tlsca/tlsca.he1.example.com-cert.pem
CAPEM=organizations/peerOrganizations/he1.example.com/ca/ca.he1.example.com-cert.pem

echo "$(json_ccp $ORG $ORGCAP $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/he1.example.com/connection-he1.json
echo "$(yaml_ccp $ORG $ORGCAP $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/he1.example.com/connection-he1.yaml
