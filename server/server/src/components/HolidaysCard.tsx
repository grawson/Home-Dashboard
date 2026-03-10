import { getPaddedDay, getPaddedMonth } from "#/tools/dates";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from 'date-fns';
import Card from "./Card";

const MAX_RESULTS = 10;
const REFRESH_RATE = 21600; // seconds

const useHolidays = () => {
    return useQuery({
        queryKey: ['holidays'],
        queryFn: async () => {
            const today = new Date();
            const start = `${today.getFullYear()}-${getPaddedMonth(today)}-${getPaddedDay(today)}`;

            const nextYear = new Date(new Date().setFullYear(new Date().getFullYear() + 1));

            const end = `${nextYear.getFullYear()}-${getPaddedMonth(nextYear)}-${getPaddedDay(nextYear)}`;

            const url = `http://www.hebcal.com/hebcal/?v=1&cfg=json&maj=on&min=on&mod=on&nx=on&start=${start}&end=${end}&month=x&ss=on&mf=on&c=off&s=off`;

            const response = await axios.get(url)

            const json = response.data
            const holidays = []

            for (const item of json.items) {
                console.log(1)
                var itemDate = new Date(item.date);
                if (new Date() > (itemDate)) {
                    continue;
                } // ensure date is later than today
                if (holidays.length >= MAX_RESULTS) {
                    break;
                } // limit the items
                const holiday = {
                    title: item.title,
                    date: itemDate
                };

                holidays.push(holiday);
            }

            return holidays
        },
        refetchInterval: REFRESH_RATE * 1000
    })
}

export default function HolidaysCard() {
    const { data = [] } = useHolidays();

    return (
        <Card header='Holidays'>
            {data.map(holiday => <div key={holiday.title} className="flex justify-between">
                <p>{holiday.title}</p>
                <p>{format(holiday.date, 'MM/dd/yyyy')}</p>
            </div>
            )}
        </Card>
    )
}