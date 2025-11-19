#!/bin/bash

echo "🚀 Starting GeneticPortfolio System..."

# Function to kill processes on exit
trap 'kill %1; kill %2' SIGINT

# 1. Pindah ke Server & Jalankan
echo "📡 Starting Backend Server..."
cd server
npm run dev &

# 2. Pindah ke Client & Jalankan
# Kita beri jeda 2 detik agar backend siap dulu
sleep 2
echo "💻 Starting Frontend Client..."
cd ../client
npm run dev &

# Wait for any process to exit
wait