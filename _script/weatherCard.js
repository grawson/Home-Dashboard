const Mustache = require("mustache");
const Keys = require("./keys");

const DOW = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const REFRESH_RATE = 2000;  // seconds

String.prototype.capitalize = function() {
    return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};
//
// const ICON_MAPPING = {
//     "clear-day": "clear-day"
//     "clear-night": "clear-night"
//     "rain": "",
//     "snow": "",
//     "wind": "",
//     "fog": "",
//     "cloudy": "",
//     "partly-cloudy-day": "",
//     "partly-cloudy-night": ""
// };


function render(weatherData) {

    data = {};

    data.currentWeather = Math.round(weatherData.currently.temperature) + "˚ "
                            + weatherData.currently.summary;

    data.forecast = [];
    var today = (new Date()).getDay();
    for (var i = 0; i < weatherData.daily.data.length; i++) {

        var icon = weatherData.daily.data[i].icon;

        data.forecast.push({
            "forecastDay": DOW[(today+i)%7],
            "forecastTemp": Math.round(weatherData.daily.data[i].temperatureMax) + " / " +
                            Math.round(weatherData.daily.data[i].temperatureMin),
            "forecastIcon": "_assets/imgs/" + icon + "@2x.png"
        });
    }

    // Render
    $.get('./_view/weatherCard.mustache', function(template) {
        var rendered = Mustache.render(template, data);
        $('#weather-card').html(rendered);
    });
}

function loadWeather(callback) {
    var url = "https://api.darksky.net/forecast/" + Keys.weatherKey() + "/40.9115,-73.7824?exclude=minutely,hourly,alerts,flags";
    $.getJSON(url, function(json){
        callback(json);
    });
}




$(document).ready(function() {

    loadWeather(render);
    window.setInterval(function() {
        console.log("Reloading weather data...");
        loadWeather(render);
    }, REFRESH_RATE*1000);

});





