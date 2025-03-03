# Usando uma imagem oficial do Node.js
FROM node:14

# Definir o diretório de trabalho
WORKDIR /usr/src/app

# Copiar o package.json e o package-lock.json da raiz do projeto
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar os arquivos restantes
COPY . .

# Expor a porta para o backend
EXPOSE 5000

# Comando para iniciar o servidor
CMD ["npm", "start"]
