# Usa una imagen base oficial de Node.js
FROM node:18

# Establece el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copia el archivo package.json y package-lock.json (si existe)
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto de los archivos del proyecto
COPY . .

# Instala dotenv para cargar las variables de entorno desde el archivo .env
RUN npm install dotenv --save-dev

# Copia el archivo .env al contenedor
COPY .env ./

# Expone el puerto que la aplicación utilizará (obtén el valor desde el archivo .env)
ARG PORT
EXPOSE $PORT

# Comando por defecto para ejecutar la aplicación
CMD ["npm", "start"]
