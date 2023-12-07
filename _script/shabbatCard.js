const Mustache = require("mustache");
require('datejs');
const Cheerio = require('cheerio')
const Axios = require('axios')
const REFRESH_RATE = 60000;  // seconds

const TEMPLATE = './_view/shabbatCard.mustache';

const scrapeData = async callback => {
  var parshaData = await $.get('https://www.hebcal.com/shabbat/?cfg=json&zip=10804&m=0')

  const parsha = parshaData.items.find(e => e.category == 'parashat').title

  const holidays = [];
  var webpage = await Axios.get('https://www.yinr.org/');

  const html = Cheerio.load(webpage.data);

  // candle lighting
  const candleLightingMatch = html.text().match(/Candle Lighting: (\d:\d\dpm)/i);

  const candleLighting = candleLightingMatch && candleLightingMatch[1];

  holidays.push({
    title: 'Candle Lighting',
    time: candleLighting
  });

  // mincha times
  const minchaMatches = html.text().match(/Mincha: (\d:\d\dpm)/gi);

  const friMincha = minchaMatches[0] && minchaMatches[0].split('Mincha: ')[1];
  const shabMincha = minchaMatches[1] && minchaMatches[1].split('Mincha: ')[1];

  holidays.push({
    title: 'Fri Mincha',
    time: friMincha
  });

  holidays.push({
    title: 'Shab Mincha',
    time: shabMincha
  });

  // havdala
  const havdalaMatch = html.text().match(/Shabbat ends: (\d:\d\dpm)/i);

  const havdala = havdalaMatch && havdalaMatch[1];

  holidays.push({
    title: 'Havdalah',
    time: havdala
  });

  callback({ holidays, parsha });
}

function render(data) {
  $.get(TEMPLATE, template => {
    var rendered = Mustache.render(template, data);
    $('#shabbat-card').html(rendered);
  });
}

$(function () {
  scrapeData(render);
  window.setInterval(function () {
    console.log("Reloading calendar data...");
    scrapeData(render);
  }, REFRESH_RATE * 1000);
});