import { cn } from '#/tools/css'
import type { ComponentProps, PropsWithChildren, ReactNode } from 'react'

type Props = ComponentProps<'div'> & {
  header: ReactNode
}

export default function Card({
  header,
  children,
  className,
  ...props
}: PropsWithChildren<Props>) {
  return (
    <div
      className={cn(
        'flex flex-col divide-y divide-border overflow-hidden bg-white rounded-lg shadow-lg grow',
        className,
      )}
      {...props}
    >
      <div className="flex mx-5 py-2 text-xl text-salmon justify-center h-fit">
        <p className="text-base">{header}</p>
      </div>

      <div className="flex flex-col h-full overflow-hidden">{children}</div>
    </div>
  )
}
