# Menggunakan image Node.js sebagai base image
FROM node:18

# Tentukan direktori kerja di dalam kontainer
WORKDIR /app

# Menyalin dan menginstal dependensi client
COPY client/package*.json ./client/
RUN echo "Installing Client Dependencies" && \
    npm ci --prefix ./client

# Menyalin dan menginstal dependensi server
COPY server/package*.json ./server/
RUN echo "Installing Server Dependencies" && \
    npm ci --prefix ./server

# Jika concurrently diperlukan secara global
RUN npm install -g concurrently

# Menyalin seluruh file aplikasi ke dalam kontainer
COPY . .

# Build aplikasi React (Frontend)
RUN npm run build --prefix ./client

# Mengekspos port 3000 (sesuaikan dengan port yang digunakan aplikasi Anda)
EXPOSE 5000

# Menjalankan aplikasi dengan perintah npm start
CMD ["npm", "start"]
