'use client'

import {useContext, useMemo, useRef } from 'react';

// Components
import Challenge from '@/app/challenges/Challenge';
//import GridChallenge from '@/app/challenges/GridChallenge';

// Contexts
import FilterContext from '@/contexts/FilterContext';
import PreferencesContext from '@/contexts/PreferencesContext';

// Utils
import type {Challenge as ChallengeData} from '@/util/challenges';
import Filters from './Filters';
import { Solve } from '@/util/profile';

import { Quality } from "./webgl/settings/quality";

import dynamic from 'next/dynamic';

const Canvas = dynamic(()=>import('./Canvas'), {ssr: false});

type ChallengesProps = {
    challenges: ChallengeData[]
    solves: Solve[]
}
export default function Challenges(props: ChallengesProps) {
    const {filter} = useContext(FilterContext);
    const {preferences} = useContext(PreferencesContext);

    const solved = new Set(props.solves.map(s => s.name));

    // Filter by category if any category boxes are checked.
    const filtered = useMemo(() => {
        let res = (filter.categories.size === 0)
            ? props.challenges
            : props.challenges.filter((c) => filter.categories.has(c.category));

        if (!filter.showSolved)
            res = res.filter((c) => !solved.has(c.name));

        return res.toSorted((a, b) => a.points - b.points);
    }, [filter, props.challenges])

    // Group challenges by category for grid layout
    // TODO: abstraction with `Filters`, efficiency?
    const grouped = useMemo(() => {
        const res: {[category: string]: ChallengeData[]} = {};

        for (const c of filtered) {
            if (!(c.category in res)) res[c.category] = [];
            res[c.category].push(c);
        }

        return res;
    }, [filtered]);

    const canvasRef = useRef(null);
    const lineRef = useRef(null);
    const line2Ref = useRef(null);
    const miscRef = useRef(null);
    const webRef = useRef(null);
    const pwnRef = useRef(null);
    const osintRef = useRef(null);
    const revRef = useRef(null);
    const cryptoRef = useRef(null);
    let renderer = {};

    renderer.numChallenges = filtered.length;
    renderer.cats = [miscRef, osintRef, pwnRef, webRef, revRef, cryptoRef];
    renderer.catLines = [];
    for (let i = 0; i < 12; i++) {
        renderer.catLines.push(useRef(null));
    }

    const qualityChangeHandler = (e) => {
        renderer.renderer.setQuality(Quality[e.target.value]);
    };

    const styles = {"fontFamily": "'Dune Rise'", "fontSize": "14px"};
    if (window.innerWidth <= 768 || preferences.classic) {
        preferences.classic = true;
    } else {
        preferences.classic = false;
    }
    // console.log("preferences.classic:", preferences.classic);
    return preferences.classic ? (
        <div className="container relative pt-32 pb-14 flex flex-col md:flex-row gap-6">
            <Filters
                challenges={props.challenges}
                solves={props.solves}
            />
            <div suppressHydrationWarning className="flex flex-col gap-3 flex-grow min-w-0">
                {filtered.map((c) => (
                    <Challenge
                        {...c}
                        solved={solved.has(c.name)}
                        key={c.id}
                    />
                ))}
            </div>
        </div>
    ) : (
        <div>
            <Canvas innerRef={canvasRef} renderer={renderer} />
            <svg className={'fixed h-full w-full pointer-events-none'}>
                <line strokeWidth={2} ref={lineRef} />
                <line strokeWidth={2} ref={line2Ref} />
                <text className={'fill-white'} style={styles} textAnchor={'middle'} ref={miscRef}>arrakis - misc</text>
                <text className={'fill-white'} style={styles} textAnchor={'middle'} ref={webRef}>caladan - osint</text>
                <text className={'fill-white'} style={styles} textAnchor={'middle'} ref={pwnRef}>giedi prime - pwn</text>
                <text className={'fill-white'} style={styles} textAnchor={'middle'} ref={osintRef}>tleilax - web</text>
                <text className={'fill-white'} style={styles} textAnchor={'middle'} ref={revRef}>salusa secundus - rev</text>
                <text className={'fill-white'} style={styles} textAnchor={'middle'} ref={cryptoRef}>kaitain - crypto</text>
                <line strokeWidth={1} ref={renderer.catLines[0]} />
                <line strokeWidth={1} ref={renderer.catLines[1]} />
                <line strokeWidth={1} ref={renderer.catLines[2]} />
                <line strokeWidth={1} ref={renderer.catLines[3]} />
                <line strokeWidth={1} ref={renderer.catLines[4]} />
                <line strokeWidth={1} ref={renderer.catLines[5]} />
                <line strokeWidth={1} ref={renderer.catLines[6]} />
                <line strokeWidth={1} ref={renderer.catLines[7]} />
                <line strokeWidth={1} ref={renderer.catLines[8]} />
                <line strokeWidth={1} ref={renderer.catLines[9]} />
                <line strokeWidth={1} ref={renderer.catLines[10]} />
                <line strokeWidth={1} ref={renderer.catLines[11]} />
            </svg>
            <div className="container relative pt-32 pb-14 pr-10 flex flex-col md:flex-row-reverse md:mr-0 md:max-w-[40%] gap-6">
                <div suppressHydrationWarning className="flex flex-col gap-3 flex-grow min-w-0">
                    {filtered.map((c, idx) => (
                        <Challenge
                            {...c}
                            solved={solved.has(c.name)}
                            key={c.id}
                            renderer={renderer}
                            index={idx}
                            lineRef={lineRef}
                            line2Ref={line2Ref}
                        />
                    ))}
                </div>
            </div>
            <select className={'fixed top-2 right-1'} onChange={qualityChangeHandler} defaultValue={'LOW'}>
                <option value={'LMAO'}>lmao</option>
                <option value={'SUPER_SUPER_LOW'}>super super low</option>
                <option value={'SUPER_LOW'}>super low</option>
                <option value={'LOW'}>low</option>
                <option value={'MEDIUM'}>medium</option>
                <option value={'OPTIMAL'}>optimal</option>
            </select>
        </div>
    );
}
