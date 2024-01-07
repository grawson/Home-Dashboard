// VAR ****************************************************************************************************************

const Mustache = require('mustache');
const { getPaddedMonth, getPaddedDay } = require('./tools/date');
require('datejs');

const today = new Date();
const start = `${today.getFullYear()}-${getPaddedMonth(today)}-${getPaddedDay(today)}`;

const nextYear = new Date(new Date().setFullYear(new Date().getFullYear() + 1));

const end = `${nextYear.getFullYear()}-${getPaddedMonth(nextYear)}-${getPaddedDay(nextYear)}`;

const REQUEST = `http://www.hebcal.com/hebcal/?v=1&cfg=json&maj=on&min=on&mod=on&nx=on&start=${start}&end=${end}&month=x&ss=on&mf=on&c=off&s=off`;
// const REQUEST = "http://www.hebcal.com/hebcal/?v=1&cfg=json&maj=on&min=on&mod=on&nx=on&year=now&month=x&ss=on&mf=on&c=on&geo=geoname&geonameid=5128549&m=50&s=off";
const TEMPLATE = './_view/holidaysCard.mustache';
const MAX_RESULTS = 10;
const REFRESH_RATE = 21600; // seconds

// FUNC **************************************************************************************************************

// Get the holiday data
function loadData(callback) {
	$.getJSON(REQUEST, function (json) {
		var data = { holidays: [] };

		for (var i in json.items) {
			var itemDate = Date.parse(json.items[i].date);
			if (Date.today().compareTo(itemDate) > 0) {
				continue;
			} // ensure date is later than today
			if (data.holidays.length >= MAX_RESULTS) {
				break;
			} // limit the items

			var holiday = {
				title: json.items[i].title,
				date: itemDate.toString('M/d'),
			};

			data.holidays.push(holiday);
		}
		callback(data);
	});
}

function render(data) {
	$.get(TEMPLATE, function (template) {
		var rendered = Mustache.render(template, data);
		$('#holidays-card').html(rendered);
	});
}

// MAIN **************************************************************************************************************

$(function () {
	loadData(render);
	window.setInterval(function () {
		console.log('Reloading holiday data...');
		loadData(render);
	}, REFRESH_RATE * 1000);
});
