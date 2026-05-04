import TestHolidayData from '#/test-data/holidays'
import { getPaddedDay, getPaddedMonth } from '#/tools/dates'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { format, parseISO } from 'date-fns'
import Card from './Card'

const MAX_RESULTS = 10
const REFRESH_RATE = 21600 // seconds

const useHolidays = () => {
  return useQuery({
    queryKey: ['holidays'],
    enabled: import.meta.env.VITE_DISABLE_APIS !== 'true',
    placeholderData:
      import.meta.env.VITE_DISABLE_APIS === 'true'
        ? TestHolidayData
        : undefined,
    queryFn: async () => {
      const today = new Date()
      const start = `${today.getFullYear()}-${getPaddedMonth(today)}-${getPaddedDay(today)}`

      const nextYear = new Date(new Date().setFullYear(today.getFullYear() + 1))

      const end = `${nextYear.getFullYear()}-${getPaddedMonth(nextYear)}-${getPaddedDay(nextYear)}`

      const url = `http://www.hebcal.com/hebcal/?v=1&cfg=json&maj=on&min=on&mod=on&nx=on&start=${start}&end=${end}&month=x&ss=on&mf=on&c=off&s=off`

      const response = await axios.get(url)

      const json = response.data
      const holidays = []

      for (const item of json.items) {
        const itemDate = parseISO(item.date)
        if (today > itemDate) {
          continue
        } // ensure date is later than today
        if (holidays.length >= MAX_RESULTS) {
          break
        } // limit the items
        const holiday = {
          title: item.title,
          date: itemDate,
        }

        holidays.push(holiday)
      }

      return holidays
    },
    refetchInterval: REFRESH_RATE * 1000,
  })
}

export default function HolidaysCard() {
  const { data = [], error } = useHolidays()

  return (
    <Card header="Holidays">
      {error ? (
        <p className="flex h-full w-full items-center justify-center">
          {error.message}
        </p>
      ) : (
        data.map((holiday) => (
          <div
            key={holiday.title}
            className="mx-5 flex items-center justify-between py-1"
          >
            <p className="text-sm">{holiday.title}</p>
            <p className="text-grey-600 text-sm">
              {format(holiday.date, 'M/d')}
            </p>
          </div>
        ))
      )}
    </Card>
  )
}
