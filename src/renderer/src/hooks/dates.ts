import { useEffect, useState } from 'react';
import { DOW, MONTHS, ordinalSuffixOf } from '../tools/dates';
import { Day } from '../types/calendar';

const getDateOffset = (date: Date, offset: number) => {
	const d = new Date(date);
	d.setDate(d.getDate() - offset);

	return d;
};

const getFormattedDate = (date: Date): Day => {
	const isToday = date.setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0);
	const isCurrentMonth = new Date().getMonth() === date.getMonth();

	return {
		isToday,
		dayOfMonth: date.getDate(),
		isCurrentMonth,
	};
};

export const useThisMonthsDates = () => {
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

export const useTodaysDateAndTime = () => {
	const [fullText, setFullText] = useState('');
	const time = useCurrentTime();

	useEffect(() => {
		setFullText(
			`${DOW[new Date().getDay()]}, ${
				MONTHS[new Date().getMonth()]
			} ${ordinalSuffixOf(new Date().getDate())}, ${time}`
		);
	}, [time]);

	return fullText;
};

export const useCurrentTime = () => {
	const [time, setTime] = useState<string>('');

	useEffect(() => {
		const getTime = () => {
			const newTime = `${`${
				new Date().getHours() % 12 ? new Date().getHours() % 12 : 12
			}:${
				new Date().getMinutes() < 10
					? '0' + new Date().getMinutes()
					: new Date().getMinutes()
			}${new Date().getHours() > 12 ? 'pm' : 'am'}`}`;

			setTime(newTime);
		};

		setInterval(getTime, 30000);
		getTime();
	}, []);

	return time;
};
