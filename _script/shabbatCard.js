const Mustache = require("mustache");
require('datejs');
const Cheerio = require('cheerio')
const Axios = require('axios')
const REFRESH_RATE = 60000;  // seconds


const TEMPLATE = './_view/shabbatCard.mustache';


async function scrapeData(callback) {
    var data = {
        holidays: []
    }

    var webpage = await Axios.get('https://www.yinr.org/')

    var html = await Cheerio.load(webpage.data)

    var nodes = html('.two-fifth')[0].children[1].firstChild.firstChild

    // this weeks parsha
    data.parsha = html(html(nodes).find(':contains("Shabbat")')[1]).text()


    // candle lighting

    var candle_lighting_node = html(nodes).find(':contains("Candle Lighting")')

    try {
        var timeRegex =  /\d{1,2}:\d*pm/
    
        cLTime = timeRegex.exec(html(candle_lighting_node).text())[0]
    
        data.holidays.push({
            title: "Candle Lighting",
            time: cLTime
        })
    }
    catch(err){}

    // Mincha
    var minchaNodes = html(nodes).find(":contains('Mincha')")
    try {
        var fridayMinchaTime = timeRegex.exec(html(minchaNodes[0]).text())[0]
    
        data.holidays.push({
            title: "Friday Mincha",
            time: fridayMinchaTime
        })
    }
    catch (err) {}
    try {
        var satMinchaTime = timeRegex.exec(html(minchaNodes[2]).text())[0]
        
        data.holidays.push({
            title: "Shabbat Mincha",
            time: satMinchaTime
        })
    }
    catch (err) {}


    // Havdala
    try {
        var havdalNodes = html(nodes).find(":contains('Shabbat Ends')")
        havdalaTime = timeRegex.exec(html(havdalNodes).text())[0]
    
        data.holidays.push({
            title: "Havdala",
            time: havdalaTime
        })
    }
    catch (err) {}

    callback(data)
}

function render(data) {
    $.get(TEMPLATE, template => {
        var rendered = Mustache.render(template, data);
        $('#shabbat-card').html(rendered);
    });
}

$(function () {
    scrapeData(render);
    window.setInterval(function() {
        console.log("Reloading calendar data...");
        scrapeData(render);
    }, REFRESH_RATE*1000);
});