import { useEffect, useState } from 'react';
import Cheerio from 'cheerio';
import { getParsha } from '../../api/api';

type Times = {
  candleLighting: string | undefined;
  friMincha: string | undefined;
  shabMincha: string | undefined;
  havdala: string | undefined;
};

export const useShabbatTimes = (): [Times | null, boolean, boolean] => {
  const [times, setTimes] = useState<Times | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // times
  useEffect(() => {
    fetch('https://cors-anywhere.herokuapp.com/https://www.yinr.org')
      .then((webpage) => {
        webpage.text().then((webpage) => {
          const html = Cheerio.load(webpage);

          // candle lighting
          const candleLightingMatch = html.text().match(/Candle Lighting: (\d:\d\dpm)/);

          const candleLighting = candleLightingMatch?.[1];

          // mincha times
          const minchaMatches = html.text().matchAll(/Mincha: (\d:\d\dpm)/g);

          const friMincha = minchaMatches.next()?.value?.[1];
          const shabMincha = minchaMatches.next()?.value?.[1];

          // havdala
          const havdalaMatch = html.text().match(/Shabbat ends: (\d:\d\dpm)/i);

          const havdala = havdalaMatch?.[1];

          const newTimes: Times = {
            candleLighting,
            friMincha,
            shabMincha,
            havdala,
          };

          setTimes(newTimes);
          setIsLoading(false);
        });
      })
      .catch(() => {
        setIsError(true);
      });
  }, []);

  return [times, isLoading, isError];
};

export const useParsha = (): [string, boolean, boolean] => {
  const [parsha, setParsha] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // parsha
  useEffect(() => {
    getParsha()
      .then((data) => {
        const newParsha =
          data.items?.find((e: { category: string }) => e.category === 'parashat')?.title || '';
        setParsha(newParsha);
        setIsLoading(false);
      })
      .catch(() => {
        setIsError(true);
      });
  }, []);

  return [parsha, isLoading, isError];
};
