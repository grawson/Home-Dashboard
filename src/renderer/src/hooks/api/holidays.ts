import { getHolidays } from '../../api/api';
import { useEffect, useState } from 'react';

type Holiday = {
	title: string;
	date: string;
};

export const useHolidays = () => {
	const [holidays, setHolidays] = useState<Holiday[] | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isError, setIsError] = useState(false);

	useEffect(() => {
		getHolidays()
			.then((newHolidays: { items: Holiday[] }) => {
				setHolidays(newHolidays?.items || []);
				setIsLoading(false);
			})
			.catch(() => {
				setIsError(true);
			});
	}, []);

	const toReturn: [Holiday[] | null, boolean, boolean] = [
		holidays,
		isLoading,
		isError,
	];

	return toReturn;
};
