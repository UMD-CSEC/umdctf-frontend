'use client'

import {useContext, useState} from 'react';
import Markdown from 'react-markdown';
import {BiCheck} from 'react-icons/bi';

// Components
import SolvesModal from '@/app/challenges/SolvesModal';
import FlagSubmissionInput from '@/app/challenges/FlagSubmissionInput';

// Utils
import type {Challenge} from '@/util/challenges';
import PreferencesContext from '@/contexts/PreferencesContext';


export default function Challenge(props: any) {
    const [showSolves, setShowSolves] = useState(false);
    const {preferences} = useContext(PreferencesContext);

    let currentTimeout: any = null;

    const deselectChallenge = () => {
        if (!props.renderer) return;
        const renderer = props.renderer.renderer;
        if (!renderer) return;
        renderer.deselectChallenge();
        const line = props.lineRef.current;
        const line2 = props.line2Ref.current;
        line.setAttribute("stroke", "");
        line2.setAttribute("stroke", "");
        if (currentTimeout !== null) {
            clearTimeout(currentTimeout);
            currentTimeout = null;
        }
    }

    const selectChallenge = (ele: any) => {
        if (currentTimeout !== null) {
            clearTimeout(currentTimeout);
            currentTimeout = null;
        }
        if (!props.renderer) return;
        const renderer = props.renderer.renderer;
        if (!renderer) return;
        /*for (let i = 0; i < props.renderer.cats.length; i++) {
            const textEle = props.renderer.cats[i].current;
            const [x, y] = renderer.getPlanetPositionPx(i);
            textEle.setAttribute("x", x+50);
            textEle.setAttribute("y", y-9);
        }*/
        renderer.selectChallenge(props.index);
        currentTimeout = setTimeout(() => {
            const line = props.lineRef.current;
            const [px, py] = renderer.getChallengePositionPx();
            line.x1.baseVal.value = px;
            line.y1.baseVal.value = py;
            line.x2.baseVal.value = px+100;
            line.y2.baseVal.value = py;
            const {x, y, width, height} = ele.target.getBoundingClientRect()
            const line2 = props.line2Ref.current;
            line2.x1.baseVal.value = px+100;
            line2.y1.baseVal.value = py;
            line2.x2.baseVal.value = x;
            line2.y2.baseVal.value = y + height/2;
            line.setAttribute("stroke", "yellow");
            line2.setAttribute("stroke", "yellow");
        }, 1000);
    }

    return (
        <div className={`bg-black/50 px-6 py-4 relative rounded border border-tertiary backdrop-blur-sm
            ${preferences.classic ? "" : "hover:border-theme-dark hover:-translate-x-8 transition duration-200 cursor-pointer"}`} onMouseEnter={selectChallenge} onMouseLeave={deselectChallenge} >
            <div className="flex items-center gap-2">
                <h3 className="font-semibold">
                    {props.category}/{props.name}
                </h3>

                {props.solved && (
                    <BiCheck className="flex-none bg-success/40 p-0.5 mb-0.5 rounded-full" />
                )}

                <button
                    className="text-theme-bright hover:text-theme transition duration-200 ml-auto text-right text-pretty"
                    onClick={() => setShowSolves(true)}
                >
                    {props.solves} solve{props.solves === 1 ? '' : 's'}
                    {' / '}
                    {props.points} point{props.points === 1 ? '' : 's'}
                </button>
            </div>
            <h4 className="text-sm text-primary mt-0.5">
                {props.author}
            </h4>

            <hr className="my-3 border-secondary" />

            <Markdown className="text-sm break-words space-y-2 [&_a]:text-theme-bright [&_a:hover]:underline [&_code]:px-2 [&_code]:py-1 [&_code]:bg-black/40 [&_code]:text-primary [&_code]:rounded">
                {props.description}
            </Markdown>

            <FlagSubmissionInput
                challenge={props}
                solved={props.solved}
            />

            {props.files.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3 text-xs font-mono font-semibold">
                    {props.files.map((f: any) => (
                        <a
                            className="text-theme hover:text-theme-bright transition duration-200 bg-black/40 px-2.5 py-1 rounded"
                            href={f.url}
                            key={f.url}
                        >
                            {f.name}
                        </a>
                    ))}
                </div>
            )}

            <SolvesModal
                open={showSolves}
                setOpen={setShowSolves}
                challenge={props}
            />
        </div>
    )
}
