#!/bin/bash


###################################################

echo "--------------------------------------------"
echo "----- Checking Git -------------------------"
echo "--------------------------------------------"

git --version
res=$?

if [ $res -ne 0 ]; then
  echo "----- Git is not installed -----------------"
  echo "----- Installing Git -----------------------"

  set -x

  sudo apt-get install git
  git --version

  set +x
fi

echo "--------------------------------------------"
echo "Git already installed"
echo ""

###################################################

echo "--------------------------------------------"
echo "----- Checking cURL ------------------------"
echo "--------------------------------------------"

curl --version
res=$?

if [ $res -ne 0 ]; then
  echo "----- cURL is not installed ----------------"
  echo "----- Installing cURL ----------------------"

  set -x

  sudo apt-get install curl
  curl --version

  set +x
fi

echo "--------------------------------------------"
echo "cURL already installed"
echo ""

###################################################

echo "--------------------------------------------"
echo "----- Checking Docker ----------------------"
echo "--------------------------------------------"

docker --version
res=$?

if [ $res -ne 0 ]; then
  echo "----- Docker is not installed --------------"
  echo "----- Installing Docker --------------------"

  set -x

  sudo apt-get update
  sudo apt-get install \
    ca-certificates \
    curl \
    gnupg

  sudo mkdir -m 0755 -p /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

  echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

  sudo apt-get update

  sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

  sudo groupadd docker

  sudo usermod -aG docker $USER

  docker --version

  set +x
fi

echo "--------------------------------------------"
echo "Docker already installed"
echo ""

###################################################

echo "--------------------------------------------"
echo "----- Checking Docker Compose --------------"
echo "--------------------------------------------"

docker-compose --version
res=$?

if [ $res -ne 0 ]; then
  echo "----- Docker Compose is not installed ------"
  echo "----- Installing Docker Compose ------------"

  set -x

  sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
  sudo chmod +x /usr/local/bin/docker-compose
  docker-compose --version

  set +x
fi

echo "--------------------------------------------"
echo "Docker Compose already installed"
echo ""

###################################################

echo "--------------------------------------------"
echo "----- Checking Golang ----------------------"
echo "--------------------------------------------"

go version
res=$?

if [ $res -ne 0 ]; then
  echo "----- Golang is not installed --------------"
  echo "----- Installing Golang --------------------"

  set -x

  sudo apt-get install git
  git --version

  set +x
fi

echo "--------------------------------------------"
echo "Golang already installed"
echo ""

###################################################

echo "--------------------------------------------"
echo "----- Checking Node ------------------------"
echo "--------------------------------------------"

node --version
res=$?

if [ $res -ne 0 ]; then
  echo "----- Node is not installed ----------------"
  echo "----- Installing Node ----------------------"

  set -x

  curl -fsSL https://deb.nodesource.com/setup_19.x | sudo -E bash - &&\
  sudo apt-get install -y nodejs

  node --version

  set +x
fi

echo "--------------------------------------------"
echo "Node already installed"
echo ""


###################################################

echo "--------------------------------------------"
echo "----- Checking npm -------------------------"
echo "--------------------------------------------"

npm --version
res=$?

if [ $res -ne 0 ]; then
  echo "----- npm is not installed -----------------"
fi

echo "--------------------------------------------"
echo "npm already installed"
echo ""

###################################################

# echo "--------------------------------------------"
# echo "----- Checking Python ----------------------"
# echo "--------------------------------------------"

# python --version
# res=$?

# if [ $res -ne 0 ]; then
#   echo "----- Pyhton is not installed --------------"
#   echo "----- Installing Python --------------------"

#   set -x

#   sudo apt-get install python3
#   sudo apt-get install python-is-python3

#   python --version

#   set +x
# fi

# echo "--------------------------------------------"
# echo "Python already installed"
# echo ""

###################################################

echo "--------------------------------------------"

