'use client'

import {useContext} from 'react';
import PreferencesContext from '@/contexts/PreferencesContext';
import { usePathname } from 'next/navigation';

export default function Footer() {
    const pathname = usePathname();
    const {preferences, setPreferences} = useContext(PreferencesContext);

    /*function toggleAnimations() {
        preferences.animations = !preferences.animations;
        setPreferences({...preferences});
    }*/

    const displayFooter = pathname == '/challenges' ? preferences.classic : true;

    return displayFooter ? (
        <footer className="mx-4 mt-auto text-center pb-8 sm:pb-12 text-primary text-sm hover:text-white transition duration-200">
            <p>
                <a href="https://github.com/UMD-CSEC/umdctf-frontend" target="_blank" rel="noopener noreferrer" className="underline">UMDCTF CTF platform</a> -
                fork of <a href="https://github.com/ky28059/bctf" target="_blank" rel="noopener noreferrer" className="underline">b01lers CTF platform</a> -
                Backend powered by <a href="https://rctf.redpwn.net/" target="_blank" rel="noopener noreferrer" className="underline">rCTF</a>
            </p>
            {/*<button onClick={toggleAnimations} className="underline mt-0.5">
                {preferences.animations ? 'Disable' : 'Enable'} animations
            </button>*/}
        </footer>
    ) : (<footer></footer>);
}
