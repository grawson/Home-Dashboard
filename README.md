# Home-Dashboard
A dashboard for your every day needs! Deploy on a Raspberry Pi and hook up to a display in your home!
The project is in the works, but the features will include:

1. Calendar view using Google Calendar API
2. Detailed view of today's events
3. Weather forecast

All features are separate modules on the dashboard, which will allow room for more features to come!

# To Run
The project is built using Electron. Begin by adding a client_secret.json file for Google Calendar authentication.

To authenticate, run command ```./auth.sh``` and follow on-screen instructions.

Once authenticated, run
```
npm install && npm start
```

Enjoy!
