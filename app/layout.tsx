import type {ReactNode} from 'react';
import type {Metadata} from 'next';
import { Inter } from 'next/font/google';

// Components
import NavBar from '@/app/NavBar';
import Footer from '@/app/Footer';
import ScrollableBackground from '@/app/ScrollableBackground';

// Providers
import TimeProvider from '@/components/TimeProvider';
import FilterProvider from '@/components/FilterProvider';
import PreferencesProvider from '@/components/PreferencesProvider';
import FlagDispatchProvider from '@/components/FlagDispatchProvider';

import './globals.css';


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: {
        absolute: 'UMDCTF 2024',
        template: '%s - UMDCTF 2024'
    },
    description: 'UMDCTF is the jeopardy-style CTF hosted by the UMDCSEC CTF team at the University of Maryland, College Park.',
}

export default function RootLayout(props: { children: ReactNode }) {
    return (
        <html lang="en" className="h-full overflow-y-scroll scroll-smooth">
            <body
                className="bg-gradient-to-b from-background from-25% to-theme-dark bg-fixed text-white h-full flex flex-col"
                style={inter.style}
            >
                <TimeProvider>
                    <FilterProvider>
                        <PreferencesProvider>
                            <FlagDispatchProvider>
                                <ScrollableBackground />

                                <NavBar />
                                {props.children}

                                <Footer />
                            </FlagDispatchProvider>
                        </PreferencesProvider>
                    </FilterProvider>
                </TimeProvider>
            </body>
        </html>
    )
}
