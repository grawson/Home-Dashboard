import { useQuery } from "@tanstack/react-query";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import axios from "axios";
import * as cheerio from 'cheerio';
import { getFormattedDateForYINR, getNextDayOfWeek } from "../../../../vite/src/tools/dates";
import Card from "./Card";

export const getServerShabbatData = createServerFn().handler(async () => {
    var parshaResponse = await axios.get(
        'https://www.hebcal.com/shabbat/?cfg=json&zip=10804&m=0'
    );

    const parshaData = parshaResponse.data as {
        items: {
            category: string;
            title: string;
        }[]
    }

    const parsha = parshaData.items.find(e => e.category == 'parashat')?.title || '';

    const times = [];
    const saturdayDate = getNextDayOfWeek(new Date(), 6);
    const saturdayDateString =
        saturdayDate && getFormattedDateForYINR(saturdayDate);
    const fridayDate = new Date(
        new Date(saturdayDate).setDate(saturdayDate.getDate() - 1)
    );
    const fridayDateString = fridayDate && getFormattedDateForYINR(fridayDate);

    const url = `https://www.yinr.org/calendar?advanced=Y&calendar=&date_start=specific+date&date_start_x=0&date_start_date=${fridayDateString}&has_second_date=Y&date_end=specific+date&date_end_x=0&date_end_date=${saturdayDateString}&view=day&day_view_horizontal=N`;

    const webpage = await axios.get(url, {
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36",
            Accept:
                "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            Referer: "https://www.yinr.org/",
            "Accept-Language": "en-US,en;q=0.9",
        },
    });
    const html = cheerio.load(webpage.data);

    const htmlText = html.text();

    // candle lighting
    const candleLightingMatch = htmlText.match(
        /\b(\d{1,2}:\d{2}(?:am|pm))\s+Candle Lighting\b/i
    );

    const candleLighting = candleLightingMatch && candleLightingMatch[1];

    times.push({
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

        times.push({
            title,
            time: times.join('/'),
        });
    }

    // havdala
    const havdalaMatch = htmlText.match(
        /\b(\d{1,2}:\d{2}(?:am|pm))\s+Shabbat Ends\b/i
    );

    const havdala = havdalaMatch && havdalaMatch[1];

    times.push({
        title: 'Havdalah',
        time: havdala,
    });

    return { parsha, times };
})

export default function ShabbatTimesCard() {
    const getShabbatData = useServerFn(getServerShabbatData)

    const { data } = useQuery({
        queryKey: ['shabbat-data'],
        queryFn: () => getShabbatData(),
    })

    const { parsha = '', times = [] } = data || {}

    return (
        <Card header={parsha} >
            {times.map(time =>
                <div key={time.title} className="flex justify-between">
                    <p>{time.title}</p>
                    <p>{time.time}</p>
                </div>
            )}
        </Card>
    )
}