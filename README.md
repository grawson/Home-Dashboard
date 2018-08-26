# Home-Dashboard
A dashboard for your every day needs! Deploy on a Raspberry Pi and hook up to a display in your home!

Check out the [screenshot](https://github.com/grawson/Home-Dashboard/blob/master/screenshot.png) for a view of the UI.

Features include:

1. Calendar view using Google Calendar API
2. Weather forecast
3. Upcoming Jewish holidays

All features are separate modules on the dashboard, which will allow room for more features to come! Check out
the screenshot for a quick view.

# To Run
1. The project is built using Electron. Begin by adding a client_secret.json to `_script/auth` for Google Calendar authentication.

2. To authenticate, run command `npm run auth` and follow on-screen instructions.

3. Once authenticated, run `npm install && npm start`

4. Enjoy!

# Next Steps

The next step is to fix some good old bugs in the calendar card. I plan on rewriting the JS using datejs for 
more robust date management. 
