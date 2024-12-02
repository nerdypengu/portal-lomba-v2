# Menggunakan image Node.js sebagai base image
FROM node:18

# Tentukan direktori kerja di dalam kontainer
WORKDIR /app

# Menyalin file package.json dan package-lock.json untuk instalasi dependensi
COPY package*.json ./

# Instalasi dependensi
RUN npm install

# Menyalin seluruh file aplikasi ke dalam kontainer
COPY . .

# Mengekspos port 3000 (sesuaikan dengan port yang digunakan aplikasi Anda)
EXPOSE 3000

# Menjalankan aplikasi dengan perintah npm start
CMD ["npm", "start"]
