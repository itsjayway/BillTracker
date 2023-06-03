#!/bin/bash

function kill_port (){
    npx kill-port 3000
}

function start_app (){
    kill_port
    cd frontend
    npm install
    npm start &
    cd ../backend
    source venv/Scripts/activate    
    pip install -r requirements.txt
    python main.py
}

echo "Starting BillTracker w_run script"
echo "Did you git pull? (y/n)"
read answer

if [ "$answer" != "${answer#[Yy]}" ] ;then
    echo "Starting BillTracker"
    start_app
else
    echo "Pull from git first!"
    exit 1
fi