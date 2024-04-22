import Timer from '@/app/(home)/Timer';
import {BsChevronCompactDown} from 'react-icons/bs';
import {getConfig} from '@/util/config';


export default async function Header() {
    const config = await getConfig();

    return (
        <header className="container flex flex-col items-center justify-stretch h-screen pt-20">
            <img className="min-w-0 min-h-0 flex-1" src="/assets/logo.svg" />
            <Timer
                startTime={config.data.startTime}
                endTime={config.data.endTime}
            />
            <p className="mb-2 max-w-3xl text-center text-pretty">
                UMDCTF is the jeopardy-style CTF hosted by the UMDCSEC CTF team at the University of Maryland, College Park.
                Join our discord at <a href="https://discord.gg/RtuwvD4B9u" target="_blank" rel="noopener noreferrer" className="text-theme-bright hover:underline">discord.gg/RtuwvD4B9u</a>{' '}
                and look out for further info soon!
            </p>
            <div className="flex divide-x divide-primary text-sm">
                <a href="#rules" className="px-4 py-2 uppercase hover:underline">Rules</a>
                <a href="#prizes" className="px-4 py-2 uppercase hover:underline">Prizes</a>
                <a href="#sponsors" className="px-4 py-2 uppercase hover:underline">Sponsors</a>
            </div>

            <a href="#rules" className="text-inherit text-4xl mt-12 sm:mb-16 text-primary">
                <BsChevronCompactDown className="animate-bounce" />
                <span className="sr-only">Jump to Rules</span>
            </a>
        </header>
    )
}
