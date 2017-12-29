// VAR ****************************************************************************************************************

const Mustache = require("mustache");
require('datejs');

const REQUEST = "http://www.hebcal.com/hebcal/?v=1&cfg=json&maj=on&min=on&mod=on&nx=on&year=2018&month=x&ss=on&mf=on&c=on&geo=geoname&geonameid=5128549&m=50&s=off";
// const REQUEST = "http://www.hebcal.com/hebcal/?v=1&cfg=json&maj=on&min=on&mod=on&nx=on&year=now&month=x&ss=on&mf=on&c=on&geo=geoname&geonameid=5128549&m=50&s=off";
const TEMPLATE = './_view/holidaysCard.mustache';
const MAX_RESULTS = 30;

// MAIN **************************************************************************************************************


$(function () {


    $.getJSON(REQUEST, function(json) {
        var data = { "holidays": [] };

        for (var i in json.items) {

            var itemDate = Date.parse(json.items[i].date);
            if (Date.today().compareTo(itemDate) > 0) { break; } // ensure date is later than today
            if (data.holidays.length >= MAX_RESULTS) { break; }  // limit the items

            data.holidays.push({
                "title": json.items[i].title,
                "date": itemDate.toString("M/d")
            });
        }


        $.get(TEMPLATE, function(template) {
            var rendered = Mustache.render(template, data);
            $('#holidays-card').html(rendered);
        });

    });
});