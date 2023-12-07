import { processFetchRequest } from "../tools/fetch";

export const getHolidays = () => {
  const url = 'http://www.hebcal.com/hebcal/?v=1&cfg=json&maj=on&min=on&mod=on&nx=on&year=now&month=x&ss=on&mf=on&c=off&s=off';

  return processFetchRequest(url, 'GET');
}

export const getParsha = () => {
  const url = 'https://www.hebcal.com/shabbat/?cfg=json&zip=10804&m=0';

  return processFetchRequest(url, 'GET');
}