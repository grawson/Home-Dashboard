const Mustache = require("mustache");

const DOW = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


String.prototype.capitalize = function() {
    return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};


function render(weatherData) {
http://cdn.apixu.com/weather/64x64/day/113.png
    data = {}

    data.currentWeather = weatherData.current.temp_f + "˚ " +
                          (weatherData.current.condition.text).capitalize();

    data.forecast = [];
    var today = (new Date()).getDay();
    for (var i = 0; i < weatherData.forecast.forecastday.length; i++) {

        var icon = "http://" + weatherData.forecast.forecastday[i].day.condition.icon;

        data.forecast.push({
            "forecastDay": DOW[(today+i)%7],
            "forecastTemp": weatherData.forecast.forecastday[i].day.maxtemp_f + " / "
                            + weatherData.forecast.forecastday[i].day.mintemp_f,
            "forecastIcon": icon
        });
    }

    // Render
    $.get('./_view/weatherCard.mst', function(template) {
        var rendered = Mustache.render(template, data);
        $('#weather-card').html(rendered);
    });
}

function loadWeather(callback) {
    var key = "623028cc072c4e76a8b210502172309";
    var url = "https://api.apixu.com/v1/forecast.json?key="+key+"&q=10804&days=8";
    $.getJSON(url, function(json){
        callback(json);
        console.log(json);
    });
}



$(document).ready(function() {

    loadWeather(function(weatherData) {
        render(weatherData);
    });


});
