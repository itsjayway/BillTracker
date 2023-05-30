#!/bin/bash
brew services start mongodb/brew/mongodb-community
npx kill-port 3000

cd /Users/misbahuddinabsarulislam/Desktop/BillTracker/frontend
npm start &
cd ../backend
source venv/bin/activate
python main.py
