#!/bin/bash

echo "installing base package..."
npm install
echo "installing server package..."
cd server
npm install
touch .env.development
echo "ALLOWED_ORIGINS=\"localhost\"" > .env.development
cd ..
echo "installing client package"
cd client
npm install
npm install
touch .env.development
echo "VITE_API_URL=http://localhost:3000/api" > .env.development
