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

# Menyalin seluruh file aplikasi ke dalam kontainer
COPY . .

# Build aplikasi React menggunakan Vite
RUN npx vite build --config ./client/vite.config.js

# Mengekspos port yang digunakan oleh aplikasi Vite preview
EXPOSE 4173

# Jalankan Vite preview untuk melihat aplikasi hasil build
CMD ["npx", "vite", "preview", "--config", "./client/vite.config.js"]
