#!/bin/bash
# Navigate to server directory and start backend
cd server
npm install
npm run dev &

# Navigate to client directory and start frontend
cd ../client
npm install
npm run dev
