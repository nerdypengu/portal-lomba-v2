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

# Menyalin seluruh file aplikasi ke dalam kontainer
COPY . .

# Menambahkan izin eksekusi untuk concurrently (pastikan ini dilakukan di server)
RUN chmod +x ./server/node_modules/.bin/concurrently

# Jika concurrently diperlukan secara global
RUN npm install -g concurrently

# Mengekspos port 3000 (sesuaikan dengan port yang digunakan aplikasi Anda)
EXPOSE 3000

# Menjalankan aplikasi dengan perintah npm start
CMD ["npm", "start"]
