import Cheerio from "cheerio";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { getParsha } from "../api/api";
import Card from '../Card';

const TimeRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 4px;

  &:first-child {
    margin-top: 0;
  }
`;

const Name = styled.span`
  font-size: 13px;
  margin-right: 16px;
`

const Time = styled.span`
  font-size: 13px;
  color: #686868;
`

const ShabbatTimes = props => {
  const [parsha, setParsha] = useState(null);
  const [times, setTimes] = useState({
    candleLighting: null,
    friMincha: null,
    shabMincha: null,
    havadala: null,
  });

  // parsha
  useEffect(() => {
    getParsha()
      .then(data => {
        const newParsha = data.items && data.items.find(e => e.category === 'parashat')?.title;
        setParsha(newParsha);
      })
  }, []);

  // times
  useEffect(() => {
    const newTimes = {};

    fetch('https://cors-anywhere.herokuapp.com/https://www.yinr.org')
      .then(webpage => {
        webpage.text().then(webpage => {
          const html = Cheerio.load(webpage)

          // candle lighting
          const candleLightingMatch = html.text().match(/Candle Lighting: (\d:\d\dpm)/);

          const candleLighting = candleLightingMatch?.[1];

          newTimes.candleLighting = candleLighting;

          // mincha times
          const minchaMatches = html.text().matchAll(/Mincha: (\d:\d\dpm)/g);

          const friMincha = minchaMatches.next()?.value?.[1];
          const shabMincha = minchaMatches.next()?.value?.[1];

          newTimes.friMincha = friMincha;
          newTimes.shabMincha = shabMincha;

          // havdala
          const havdalaMatch = html.text().match(/Shabbat ends: (\d:\d\dpm)/);

          const havdala = havdalaMatch?.[1];

          newTimes.havdala = havdala;


          setTimes(newTimes);
        })
      })
  }, []);

  return (
    <Card
      header={parsha}
    >
      <TimeRow>
        <Name>Candle Lighting</Name>
        <Time>{times.candleLighting}</Time>
      </TimeRow>

      <TimeRow>
        <Name>Friday Mincha</Name>
        <Time>{times.friMincha}</Time>
      </TimeRow>

      <TimeRow>
        <Name>Shabbat Mincha</Name>
        <Time>{times.shabMincha}</Time>
      </TimeRow>

      <TimeRow>
        <Name>Havdala</Name>
        <Time>{times.havdala}</Time>
      </TimeRow>
    </Card>
  )
}

export default ShabbatTimes;