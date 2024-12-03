# Menggunakan Node.js sebagai base image
FROM node:18

# Set direktori kerja di dalam container
WORKDIR /app

# Salin file package.json dan package-lock.json untuk client
COPY client/package*.json ./client/

# Instal dependensi untuk client
RUN echo "Installing Client Dependencies" && npm ci --prefix ./client

# Salin semua file aplikasi ke container
COPY . .

# Build aplikasi React menggunakan Vite
RUN npx vite build --config ./client/vite.config.js --cwd ./client

# Ekspose port untuk Vite preview
EXPOSE 4173

# Jalankan Vite preview untuk melihat aplikasi hasil build
CMD ["npx", "vite", "preview", "--config", "./client/vite.config.js", "--cwd", "./client"]
