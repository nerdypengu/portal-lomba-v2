# Menggunakan image Node.js sebagai base image
FROM node:18

# Tentukan direktori kerja di dalam kontainer
WORKDIR /app

# Menyalin dan menginstal dependensi client
COPY client/package*.json ./client/
RUN echo "Installing Client Dependencies" && npm ci --prefix ./client

# Menyalin dan menginstal dependensi server
COPY server/package*.json ./server/
RUN echo "Installing Server Dependencies" && npm ci --prefix ./server

# Instal concurrently secara global
RUN npm install -g concurrently

# Menyalin seluruh file aplikasi ke dalam kontainer
COPY . .

# Build aplikasi frontend menggunakan Vite
#RUN npm run build --prefix ./client

# Expose port yang digunakan oleh frontend dan backend
EXPOSE 5000

# Jalankan kedua aplikasi secara bersamaan
CMD ["concurrently", "npm run start-client --prefix ./client", "npm run start-server --prefix ./server"]
