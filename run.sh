#!/bin/bash
npx kill-port 3000
cd frontend
npm start &
cd ../backend
source venv/Scripts/activate
python main.py
