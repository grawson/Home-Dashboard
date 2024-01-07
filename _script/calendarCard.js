const Mustache = require('mustache');
// const calendarAuth = require('./auth/CalendarAuth');
const google = require('googleapis');
require('datejs');

const REFRESH_RATE = 600; // seconds
const DOW = [
	'Sunday',
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
];
const MONTHS = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

var calendar = google.calendar('v3');

const getDateOffset = (date, offset) => {
	const d = new Date(date);
	d.setDate(d.getDate() - offset);

	return d;
};

const getFormattedDate = date => {
	const isToday = date.setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0);
	const isCurrentMonth = new Date().getMonth() === date.getMonth();

	return {
		isToday,
		dayOfMonth: date.getDate(),
		dayColor: isToday ? 'today' : !isCurrentMonth ? 'out-of-month' : '',
		dayBackground: isToday ? 'todayBackground' : '',
		isCurrentMonth,
		date,
	};
};

const getStartToEndDates = () => {
	const days = [];

	const today = new Date();
	const todaysDayOfWeek = today.getDay();

	for (let i = todaysDayOfWeek; i > 0; i--) {
		days.push(getFormattedDate(getDateOffset(today, i)));
	}

	days.push(getFormattedDate(today));

	for (let i = 1; i < 35 - todaysDayOfWeek; i++) {
		days.push(getFormattedDate(getDateOffset(today, -i)));
	}

	return days;
};

// Parse events into event data for mustache
function parseEvents(events) {
	var eventData = {};
	for (const event of events) {
		var start = event.start.dateTime || event.start.date;
		var end = event.end.dateTime || event.end.date;
		var startDate = new Date(start);
		var endDate = new Date(end);

		// All day event: time zone must be set to UTC +0
		if (start.indexOf('T') == -1) {
			// Will change the time and date, but not the time zone tag
			var timeZone = startDate.getTimezoneOffset() / 60;
			startDate.setUTCHours(timeZone);
			var dateStr =
				startDate.getFullYear() +
				'-' +
				(startDate.getMonth() + 1) +
				'-' +
				startDate.getDate();
			if (eventData[dateStr] == null) {
				eventData[dateStr] = [];
			}
			eventData[dateStr].push({
				summary: event.summary,
				start: 'All Day',
			});
		}

		// Add to events data
		else if (startDate.getDate() == endDate.getDate()) {
			// single day event
			var dateStr =
				startDate.getFullYear() +
				'-' +
				(startDate.getMonth() + 1) +
				'-' +
				startDate.getDate();
			if (eventData[dateStr] == null) {
				eventData[dateStr] = [];
			}
			eventData[dateStr].push({
				summary: event.summary,
				start: startDate.toString('h:mmtt'),
			});

			// multi day event
		} else {
			for (j = startDate.getDate(); j <= endDate.getDate(); j++) {
				var dateStr =
					startDate.getFullYear() + '-' + (startDate.getMonth() + 1) + '-' + j;
				if (eventData[dateStr] == null) {
					eventData[dateStr] = [];
				}

				var startLabel = 'All Day';
				if (j == startDate.getDate()) {
					// fist day of multi day event
					startLabel = startDate.toString('h:mmtt');
				} else if (j == endDate.getDate()) {
					// last day
					startLabel = '12:00 AM';
				}

				eventData[dateStr].push({
					summary: event.summary,
					start: startLabel,
				});
			}
		}
	}
	return eventData;
}

function render() {
	const days = getStartToEndDates();

	const currentDay = `${DOW[Date.today().getDay()]}, ${
		MONTHS[Date.today().getMonth()]
	} ${ordinalSuffixOf(Date.today().getDate())}, `;
	const currentTime = `${
		new Date().getHours() % 12 ? new Date().getHours() % 12 : 12
	}:${
		new Date().getMinutes() < 10
			? '0' + new Date().getMinutes()
			: new Date().getMinutes()
	}${new Date().getHours() > 12 ? 'pm' : 'am'}`;

	const auth = calendarAuth.authorize();

	calendar.events.list(
		{
			auth,
			calendarId: 'primary',
			timeMin: days[0].date.toISOString(),
			timeMax: days[days.length - 1].date.toISOString(),
			maxResults: 500,
			singleEvents: true,
			orderBy: 'startTime',
		},
		function (err, response) {
			if (err) {
				console.log('The API returned an error: ' + err);
			}

			if (response && response.items) {
				var events = response.items;
				if (events.length == 0) {
					console.log('No upcoming events found.');
				} else {
					eventData = parseEvents(events);
				}

				for (const day of days) {
					var dateOfEvent = day.date;
					initEvents(dateOfEvent, day, eventData);
				}
			}

			const data = {
				dow: DOW.map(dow => ({ dowFirstLetter: dow.charAt(0) })),
				days,
				currentDay,
				currentTime,
			};

			$.get('./_view/calendarCard.mustache', function (template) {
				var rendered = Mustache.render(template, data);
				$('#calendar-card').html(rendered);
			});
		}
	);
}

// Init events mustache data
function initEvents(dateOfEvent, data, eventData) {
	var dateLabel =
		dateOfEvent.getFullYear() +
		'-' +
		(dateOfEvent.getMonth() + 1) +
		'-' +
		dateOfEvent.getDate();
	data.events = [];
	if (eventData[dateLabel] != null) {
		for (var k = 0; k < eventData[dateLabel].length; k++) {
			data.events.push({
				eventTitle: eventData[dateLabel][k].summary,
				eventTime: eventData[dateLabel][k].start,
			});
		}
	}
}

function ordinalSuffixOf(i) {
	var j = i % 10,
		k = i % 100;
	if (j == 1 && k != 11) {
		return i + 'st';
	}
	if (j == 2 && k != 12) {
		return i + 'nd';
	}
	if (j == 3 && k != 13) {
		return i + 'rd';
	}
	return i + 'th';
}

function load() {
	render();
}

function update_time() {
	var time = `${new Date().getHours() % 12 ? new Date().getHours() % 12 : 12}:${
		new Date().getMinutes() < 10
			? '0' + new Date().getMinutes()
			: new Date().getMinutes()
	}${new Date().getHours() > 12 ? 'pm' : 'am'}`;
	$('#currTime').text(time);
}

$(document).ready(function () {
	// load();
	// window.setInterval(function () {
	// 	console.log('Reloading calendar data...');
	// 	load();
	// }, REFRESH_RATE * 1000);

	// window.setInterval(() => {
	// 	console.log('Updating time');
	// 	update_time();
	// }, 10000);
});
