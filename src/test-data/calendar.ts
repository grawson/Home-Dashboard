import { addDays, isSameMonth, isToday, startOfWeek } from "date-fns";

const today = new Date();
const start = startOfWeek(today, { weekStartsOn: 0 }); // Sunday

export default Array.from({ length: 35 }, (_, i) => {
  const date = addDays(start, i);

  return {
    events: [
      {
        eventTitle: "Event " + (i * 2 + 1),
        eventTime: "09:00 AM",
      },
      {
        eventTitle: "Event " + (i * 2 + 2),
        eventTime: "02:00 PM",
      },
    ],
    isToday: isToday(date),
    dayOfMonth: date.getDate(),
    isCurrentMonth: isSameMonth(date, today),
    date,
  };
});