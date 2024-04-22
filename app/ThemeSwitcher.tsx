'use client'

import PreferencesContext from '@/contexts/PreferencesContext';
import {useContext} from 'react';

export default function ThemeSwitcher() {
    const {preferences, setPreferences} = useContext(PreferencesContext);

    function toggleTheme() {
        preferences.classic = !preferences.classic;
        setPreferences({...preferences});
    }

    let img;
    if (preferences.classic) {
        img = "/assets/space.png";
    } else {
        img = "/assets/Hamburger_icon.svg";
    }

    return (
        <button
            className="fixed bottom-3 left-3 rounded-md invisible md:visible z-50 px-4 py-2 border-2 transition duration-200 border-primary text-primary hover:border-white hover:text-white"
            onClick={() => toggleTheme()}
        >
            <img className="invert max-w-[32px] max-h-[32px]" src={img} />
        </button>
    )
}