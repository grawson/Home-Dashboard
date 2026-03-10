import type { PropsWithChildren } from "react";

type Props = {
    header: string;
}

export default function Card({ header, children }: PropsWithChildren<Props>) {
    return (
        <div className="flex flex-col overflow-hidden bg-white rounded-lg shadow-lg grow">
            <div className="flex mx-5 py-5 text-xl text-salmon justify-center  border-b border-border h-fit">
                <p className="text-base">{header}</p>
            </div>

            <div className="flex flex-col">
                {children}
            </div>
        </div>
    )
}