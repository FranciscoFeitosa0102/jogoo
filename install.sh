#!/bin/bash
set -e

# Verificar se o script está sendo executado como root
if [[ $EUID -ne 0 ]]; then
  echo "Este script deve ser executado como root (sudo)." 
  exit 1
fi

echo "Iniciando instalação..."

# Atualizar o sistema
echo "Atualizando o sistema..."
sudo apt update && sudo apt upgrade -y

# Instalar dependências básicas
echo "Instalando dependências básicas (curl, git, nginx)..."
sudo apt install -y curl git nginx

# Função para verificar se uma porta está em uso
check_port() {
  local port=$1
  if netstat -tulpn | grep ":$port "; then
    echo "Erro: A porta $port já está em uso."
    return 1
  else
    return 0
  fi
}

# Verificar se as portas estão em uso
echo "Verificando se as portas estão em uso..."
check_port 80 || exit 1
check_port 5000 || exit 1
check_port 27017 || exit 1
check_port 8080 || exit 1

# Instalar UFW, se não estiver instalado
if ! command -v ufw &> /dev/null
then
    echo "Instalando UFW..."
    sudo apt install -y ufw
fi

# Habilitar o UFW, se necessário
if ! sudo ufw status | grep -q "Status: active"; then
    echo "Habilitando UFW..."
    sudo ufw enable
fi

# Abrir portas necessárias no firewall
echo "Abrindo portas no firewall..."
sudo ufw allow 80
sudo ufw allow 5000
sudo ufw allow 27017
sudo ufw allow 8080
#Verifica se o firewall está ativo.
sudo ufw status

# Instalar MongoDB corretamente
echo "Instalando MongoDB (isso pode levar alguns minutos)..."
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -sc)/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org

# Iniciar MongoDB
echo "Iniciando o MongoDB..."
sudo systemctl enable mongod
sudo systemctl start mongod

# Verificar se MongoDB está rodando
if ! systemctl is-active --quiet mongod; then
    echo "Erro ao iniciar o MongoDB. Saindo..."
    exit 1
fi

# Instalar Node.js e npm via NVM
echo "Instalando Node.js e NVM (isso pode levar alguns minutos)..."
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"
nvm install 18
nvm use 18

# Instalar PM2 para gerenciar processos Node.js
echo "Instalando PM2..."
npm install -g pm2

# Clonar o repositório do projeto
echo "Clonando o repositório..."
sudo mkdir -p /var/www/gamifica_complete_project
sudo chown $USER:$USER /var/www/gamifica_complete_project
git clone https://github.com/FranciscoFeitosa0102/jogoo.git /var/www/gamifica_complete_project
cd /var/www/gamifica_complete_project

# Instalar dependências do projeto
echo "Instalando dependências do Node.js (isso pode levar alguns minutos)..."
npm install

# Iniciar o projeto com PM2 para rodar na porta 3000
echo "Iniciando o projeto com PM2..."
cd server
pm2 start server.js --name "gamifica"
pm2 save
cd ..
pm2 startup systemd
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $(whoami) --hp /home/$(whoami)

# Instalar Docker e Docker Compose
echo "Instalando Docker e Docker Compose..."

# Instalar dependências do Docker
sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common

# Adicionar chave oficial do Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

# Adicionar repositório do Docker
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

# Atualizar novamente os pacotes
sudo apt-get update -y

# Instalar Docker
sudo apt-get install -y docker-ce

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verificar a instalação do Docker Compose
docker-compose --version

# Configurar e iniciar containers com Docker Compose
echo "Iniciando containers com Docker Compose..."
cd /var/www/gamifica_complete_project
sudo docker-compose up --build -d

# Configurar o Nginx para proxy reverso na porta 3000
echo "Configurando Nginx..."

cat <<EOF | sudo tee /etc/nginx/sites-available/gamifica
server {
    listen 80;
    server_name gamifica.leadscdt.com.br;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Habilitar a configuração no Nginx
sudo ln -sf /etc/nginx/sites-available/gamifica /etc/nginx/sites-enabled/

# Testar configuração e reiniciar Nginx
sudo nginx -t && sudo systemctl reload nginx

# Informar ao usuário
echo "Instalação concluída! Acesse http://gamifica.leadscdt.com.br"




