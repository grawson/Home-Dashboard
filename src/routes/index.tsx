import CalendarCard from '#/components/CalendarCard'
import HolidaysCard from '#/components/HolidaysCard'
import ShabbatTimesCard from '#/components/ShabbatTimesCard'
import WeatherCard from '#/components/WeatherCard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <main>
      <div className="flex bg-background h-screen w-screen p-5 gap-5">
        <CalendarCard />

        <div className="flex flex-col shrink-0 grow-0 basis-[270px] gap-5">
          <WeatherCard />
          <HolidaysCard />
          <ShabbatTimesCard />
        </div>
      </div>
    </main>
  )
}
