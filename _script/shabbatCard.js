const Mustache = require('mustache');
require('datejs');
const Cheerio = require('cheerio');
const Axios = require('axios');
const { getNextDayOfWeek, getFormattedDateForYINR } = require('./tools/date');
const REFRESH_RATE = 60000; // seconds

const TEMPLATE = './_view/shabbatCard.mustache';

const scrapeData = async callback => {
	var parshaData = await $.get(
		'https://www.hebcal.com/shabbat/?cfg=json&zip=10804&m=0'
	);

	const parsha = parshaData.items.find(e => e.category == 'parashat').title;

	const holidays = [];
	const saturdayDate = getNextDayOfWeek(new Date(), 6);
	const saturdayDateString =
		saturdayDate && getFormattedDateForYINR(saturdayDate);
	const fridayDate = new Date(
		new Date(saturdayDate).setDate(new Date(saturdayDate.getDate() - 1))
	);
	const fridayDateString = fridayDate && getFormattedDateForYINR(fridayDate);

	const url = `https://www.yinr.org/calendar?advanced=Y&calendar=&date_start=specific+date&date_start_x=0&date_start_date=${fridayDateString}&has_second_date=Y&date_end=specific+date&date_end_x=0&date_end_date=${saturdayDateString}&view=day&day_view_horizontal=N`;

	var webpage = await Axios.get(url);

	const html = Cheerio.load(webpage.data);

	const htmlText = html.text();

	// candle lighting
	const candleLightingMatch = htmlText.match(
		/\b(\d{1,2}:\d{2}(?:am|pm))\s+Candle Lighting\b/i
	);

	const candleLighting = candleLightingMatch && candleLightingMatch[1];

	holidays.push({
		title: 'Candle Lighting',
		time: candleLighting,
	});

	// mincha times
	const days = html('.calendar_day_view');

	for (let i = 0; i < (days || []).length; i++) {
		const dayContainer = days[i];

		const dayText = html(dayContainer).text();
		const minchaMatches = dayText.match(
			/\b\d{1,2}:\d{2}(?:am|pm)\s+Mincha\b/gi
		);

		const minchaTimeRegex = /\b\d{1,2}:\d{2}(?:am|pm)/;

		const times = [];
		for (const match of minchaMatches || []) {
			const timeMatch = match && match.match(minchaTimeRegex);

			if (timeMatch) {
				times.push(timeMatch);
			}
		}

		const title = i === 0 ? 'Fri Mincha' : 'Shab Mincha';

		holidays.push({
			title,
			time: times.join('/'),
		});
	}

	// havdala
	const havdalaMatch = htmlText.match(
		/\b(\d{1,2}:\d{2}(?:am|pm))\s+Shabbat Ends\b/i
	);

	const havdala = havdalaMatch && havdalaMatch[1];

	holidays.push({
		title: 'Havdalah',
		time: havdala,
	});

	callback({ holidays, parsha });
};

function render(data) {
	$.get(TEMPLATE, template => {
		var rendered = Mustache.render(template, data);
		$('#shabbat-card').html(rendered);
	});
}

$(function () {
	scrapeData(render);
	window.setInterval(function () {
		console.log('Reloading calendar data...');
		scrapeData(render);
	}, REFRESH_RATE * 1000);
});
