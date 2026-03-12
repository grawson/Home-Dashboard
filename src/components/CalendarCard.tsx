import { authorize } from '#/auth/calendarAuth'
import { DOW, MONTHS } from '#/config'
import CalendarTestData from '#/test-data/calendar'
import { cn } from '#/tools/css'
import { useQuery } from '@tanstack/react-query'
import { createServerFn, useServerFn } from '@tanstack/react-start'
import { addDays, format, startOfWeek } from 'date-fns'
import { google } from 'googleapis'
import { useEffect, useState } from 'react'
import Card from './Card'

const REFRESH_RATE = 600 // seconds

function ordinalSuffixOf(i: number) {
  const j = i % 10,
    k = i % 100
  if (j == 1 && k != 11) {
    return i + 'st'
  }
  if (j == 2 && k != 12) {
    return i + 'nd'
  }
  if (j == 3 && k != 13) {
    return i + 'rd'
  }
  return i + 'th'
}

export const getFormattedDate = (date: Date) => {
  const isToday = date.setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0)
  const isCurrentMonth = new Date().getMonth() === date.getMonth()

  return {
    isToday,
    dayOfMonth: date.getDate(),
    isCurrentMonth,
    date,
  }
}

const getStartToEndDates = () => {
  const start = startOfWeek(new Date(), { weekStartsOn: 0 }) // Sunday

  return Array.from({ length: 35 }, (_, i) =>
    getFormattedDate(addDays(start, i)),
  )
}

type EventData = Record<string, { summary: string; start: string }[]>

function parseEvents(events: any) {
  const eventData: EventData = {}

  for (const event of events) {
    const start = event.start?.dateTime || event.start?.date
    const end = event.end?.dateTime || event.end?.date

    if (!start || !end) {
      console.log('Skipping event', event)
      continue
    }

    const startDate = new Date(start)
    const endDate = new Date(end)

    // All day event: time zone must be set to UTC +0
    if (start && start.indexOf('T') == -1) {
      // Will change the time and date, but not the time zone tag
      const timeZone = startDate.getTimezoneOffset() / 60
      startDate.setUTCHours(timeZone)
      const dateStr =
        startDate.getFullYear() +
        '-' +
        (startDate.getMonth() + 1) +
        '-' +
        startDate.getDate()
      if (eventData[dateStr] == null) {
        eventData[dateStr] = []
      }
      eventData[dateStr].push({
        summary: event.summary || '',
        start: 'All Day',
      })
    }

    // Add to events data
    else if (startDate.getDate() == endDate.getDate()) {
      // single day event
      const dateStr =
        startDate.getFullYear() +
        '-' +
        (startDate.getMonth() + 1) +
        '-' +
        startDate.getDate()
      if (eventData[dateStr] == null) {
        eventData[dateStr] = []
      }
      eventData[dateStr].push({
        summary: event.summary || '',
        start: format(startDate, 'h:mma'),
      })

      // multi day event
    } else {
      for (let j = startDate.getDate(); j <= endDate.getDate(); j++) {
        const dateStr =
          startDate.getFullYear() + '-' + (startDate.getMonth() + 1) + '-' + j
        if (eventData[dateStr] == null) {
          eventData[dateStr] = []
        }

        let startLabel = 'All Day'
        if (j == startDate.getDate()) {
          // fist day of multi day event
          startLabel = format(startDate, 'h:mma')
        } else if (j == endDate.getDate()) {
          // last day
          startLabel = '12:00 AM'
        }

        eventData[dateStr].push({
          summary: event.summary || '',
          start: startLabel,
        })
      }
    }
  }
  return eventData
}

function initEvents(
  dateOfEvent: Date,
  data: ReturnType<typeof getStartToEndDates>[number],
  eventData: EventData,
) {
  const dateLabel =
    dateOfEvent.getFullYear() +
    '-' +
    (dateOfEvent.getMonth() + 1) +
    '-' +
    dateOfEvent.getDate()
  const events = []
  if (eventData[dateLabel] != null) {
    for (var k = 0; k < eventData[dateLabel].length; k++) {
      events.push({
        eventTitle: eventData[dateLabel][k].summary,
        eventTime: eventData[dateLabel][k].start,
      })
    }
  }

  return {
    ...data,
    events,
  }
}

const getServerEvents = createServerFn().handler(async () => {
  const days = getStartToEndDates()

  const auth = authorize()

  const calendar = google.calendar({ version: 'v3' })

  const response = await calendar.events.list({
    auth,
    calendarId: 'primary',
    timeMin: days[0].date.toISOString(),
    timeMax: days[days.length - 1].date.toISOString(),
    maxResults: 500,
    singleEvents: true,
    orderBy: 'startTime',
  })

  const events = response?.data.items || []
  if (events.length == 0) {
    console.log('No upcoming events found.')
  }

  const eventData = parseEvents(events)

  const formattedDays = days.map((day) => initEvents(day.date, day, eventData))

  return formattedDays
})

const useEvents = () => {
  const getEvents = useServerFn(getServerEvents)

  return useQuery({
    queryKey: ['events'],
    refetchInterval: REFRESH_RATE * 1000,
    enabled: import.meta.env.VITE_DISABLE_APIS !== 'true',
    placeholderData:
      import.meta.env.VITE_DISABLE_APIS === 'true'
        ? CalendarTestData
        : undefined,
    queryFn: () => getEvents(),
  })
}

const useCurrentTime = () => {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(id)
  }, [])

  return currentTime
}

export default function CalendarCard() {
  const { data: days = [], error } = useEvents()
  const currentTime = useCurrentTime()

  const date = `${DOW[currentTime.getDay()]}, ${
    MONTHS[currentTime.getMonth()]
  } ${ordinalSuffixOf(currentTime.getDate())}`

  const time = `${currentTime.getHours() % 12 ? currentTime.getHours() % 12 : 12}:${
    currentTime.getMinutes() < 10
      ? '0' + currentTime.getMinutes()
      : currentTime.getMinutes()
  }${currentTime.getHours() > 12 ? 'pm' : 'am'}`

  return (
    <Card header={`${date}, ${time}`} className="divide-y-0">
      {error ? (
        <p className="h-full w-full justify-center flex items-center">
          {error.message}
        </p>
      ) : (
        <div className="grid grid-cols-7 grid-rows-[auto_repeat(5,1fr)] h-full">
          {DOW.map((dow) => (
            <p key={dow} className="text-center text-grey-600 text-sm">
              {dow.charAt(0)}
            </p>
          ))}

          {days.map((day) => (
            <div
              key={day.date.toString()}
              className={cn('flex border-border border-t border-r')}
            >
              <div
                className={cn(
                  'flex flex-col h-full w-full p-1',
                  day.isToday && 'bg-butter-100',
                  !day.isCurrentMonth && 'opacity-30',
                )}
              >
                <p
                  className={cn(
                    'pb-2.5 font-semibold text-sm',
                    day.isToday && 'text-salmon font-semibold',
                  )}
                >
                  {day.dayOfMonth}
                </p>

                {day.events.map((event) => (
                  <div
                    key={event.eventTitle}
                    className="grid grid-cols-[2px_auto_auto] gap-x-1 pb-1"
                  >
                    <span className="bg-salmon rounded-lg" />

                    <p className="truncate whitespace-nowrap text-sm">
                      {event.eventTitle}
                    </p>

                    <div>
                      <p className="text-xs text-grey-600 text-right  relative top-[75%] -translate-y-[75%] whitespace-nowrap">
                        {event.eventTime}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
