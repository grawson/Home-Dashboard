const Mustache = require("mustache");
require('datejs');
const Cheerio = require('cheerio')
const Axios = require('axios')

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

    var timeRegex =  /\d{1,2}:\d*pm/

    cLTime = timeRegex.exec(html(candle_lighting_node).text())[0]

    data.holidays.push({
        title: "Candle Lighting",
        time: cLTime
    })

    // Mincha
    var minchaNodes = html(nodes).find(":contains('Mincha')")
    var fridayMinchaTime = timeRegex.exec(html(minchaNodes[0]).text())[0]

    data.holidays.push({
        title: "Friday Mincha",
        time: fridayMinchaTime
    })

    var satMinchaTime = timeRegex.exec(html(minchaNodes[2]).text())[0]

    data.holidays.push({
        title: "Shabbat Mincha",
        time: satMinchaTime
    })

    // Havdala
    var havdalNodes = html(nodes).find(":contains('Shabbat Ends')")
    havdalaTime = timeRegex.exec(html(havdalNodes).text())[0]

    data.holidays.push({
        title: "Havdala",
        time: havdalaTime
    })

    callback(data)
}

function render(data) {
    $.get(TEMPLATE, function(template) {
        var rendered = Mustache.render(template, data);
        $('#shabbat-card').html(rendered);
    });
}

$(function () {
    scrapeData(render);
});