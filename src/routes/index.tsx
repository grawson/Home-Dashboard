import HolidaysCard from '#/components/HolidaysCard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <main>
      <div className="bg-background flex h-screen w-screen gap-5 p-5">
        {/* <CalendarCard /> */}

        <div className="flex shrink-0 grow-0 basis-[270px] flex-col gap-5">
          {/* <WeatherCard /> */}
          <HolidaysCard />
          {/* <ShabbatTimesCard /> */}
        </div>
      </div>
    </main>
  )
}
