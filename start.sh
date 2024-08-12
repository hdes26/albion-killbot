#!/bin/sh
# Start the API service in the background
npm start -- --mode api &

# Start the bot service
npm start -- --mode bot
