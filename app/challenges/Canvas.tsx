'use client'
import {useContext, useMemo, useRef, useEffect} from 'react';

import { Renderer } from './webgl/renderer';
import { Quality } from "./webgl/settings/quality";
import { setupControls } from "./controls/setup";

import FilterContext from '@/contexts/FilterContext';

export default function Canvas({ innerRef, renderer }) {
    const {filter, setFilter} = useContext(FilterContext);
    useEffect(() => {
        filter.categories = new Set(["misc"]);
        setFilter({...filter});
    }, []);
    useEffect(() => {
        if (innerRef?.current !== null) {
            const henry_canvas = innerRef.current;
            if (!henry_canvas.renderer) {
                henry_canvas.renderer = renderer;
                renderer.renderer = new Renderer(henry_canvas);
                setupControls(renderer.renderer);
            } else {
                renderer.renderer = henry_canvas.renderer.renderer;
            }
            renderer.renderer.setFilter = setFilter;
            renderer.renderer.filter = filter;
            renderer.renderer.uniforms.uChallengeCount = renderer.numChallenges;
            for (let i = 0; i < renderer.cats.length; i++) {
                const textEle = renderer.cats[i].current;
                const [x, y] = renderer.renderer.getPlanetPositionPx(i);
                textEle.setAttribute("x", x+50);
                textEle.setAttribute("y", y-9);
            }
            for (let i = 0; i < renderer.catLines.length / 2; i++) {
                const [x, y] = renderer.renderer.getPlanetPositionPx(i);
                const textEle = renderer.cats[i].current;
                const width = textEle.getBoundingClientRect().width + 20;
                textEle.setAttribute("x", x+width/2);
                renderer.catLines[i*2].current.setAttribute("stroke", "yellow");
                renderer.catLines[i*2+1].current.setAttribute("stroke", "yellow");
                renderer.catLines[i*2].current.x1.baseVal.value = x;
                renderer.catLines[i*2].current.y1.baseVal.value = y-5;
                renderer.catLines[i*2].current.x2.baseVal.value = x+width;
                renderer.catLines[i*2].current.y2.baseVal.value = y-5;
                renderer.catLines[i*2+1].current.x1.baseVal.value = x+width;
                renderer.catLines[i*2+1].current.y1.baseVal.value = y-5;
                renderer.catLines[i*2+1].current.x2.baseVal.value = x+width+10;
                renderer.catLines[i*2+1].current.y2.baseVal.value = y-20;
            }
            renderer.renderer.cats = renderer.cats;
            renderer.renderer.catLines = renderer.catLines;
            renderer.renderer.render();
        }
    });
    return <canvas id="henry_canvas" className="fixed min-w-[100vw] min-h-[100vh] max-w-[100vw] max-h-[100vh] top-0 left-0 bg-black" ref={innerRef}></canvas>
}
