# 1. Gunakan Image dasar Node.js (Versi ringan)
FROM node:18-slim

# 2. Install Python 3 dan PIP ke dalam environment Node.js ini
RUN apt-get update || : && apt-get install -y \
    python3 \
    python3-pip \
    build-essential

# 3. Set folder kerja di dalam server
WORKDIR /app

# 4. Copy file dependency dulu (agar caching efisien)
COPY package.json ./
COPY server/package.json ./server/
COPY engine/requirements.txt ./engine/

# 5. Install Dependency Node.js (Root & Server)
RUN npm install
RUN cd server && npm install

# 6. Install Dependency Python (Engine)
# Gunakan --break-system-packages karena Debian terbaru membatasi pip
RUN pip3 install -r engine/requirements.txt --break-system-packages

# 7. Copy seluruh kode proyek
COPY . .

# 8. Expose port (Render menggunakan environment variable PORT)
ENV PORT=5000
EXPOSE 5000

# 9. Jalankan Server
CMD ["node", "server/index.js"]