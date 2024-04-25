'use client'

import {useContext, useMemo} from 'react';

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

    console.log(preferences.classic);
    return preferences.classic ? (
        <div className="container relative pt-32 pb-14 flex flex-col md:flex-row gap-6">
            <Filters
                challenges={props.challenges}
                solves={props.solves}
            />
            <div className="flex flex-col gap-3 flex-grow min-w-0">
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
            <canvas id="henry_canvas" className="fixed min-w-[100vw] min-h-[100vh] max-w-[100vw] max-h-[100vh] top-0 left-0 bg-black"></canvas>
            <div className="container relative pt-32 pb-14 pr-10 flex flex-col md:flex-row-reverse md:mr-0 md:max-w-[40%] gap-6">
                <div className="flex flex-col gap-3 flex-grow min-w-0">
                    {filtered.map((c) => (
                        <Challenge
                            {...c}
                            solved={solved.has(c.name)}
                            key={c.id}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
