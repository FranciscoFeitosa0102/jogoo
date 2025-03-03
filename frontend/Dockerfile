# Usando uma imagem oficial do Node.js
FROM node:14

# Definir o diretório de trabalho
WORKDIR /usr/src/app

# Copiar o package.json e o package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar os arquivos restantes
COPY . .

# Construir o projeto React
RUN npm run build

# Expor a porta para o frontend
EXPOSE 80

# Comando para iniciar o servidor
CMD ["serve", "-s", "build", "-l", "80"]
