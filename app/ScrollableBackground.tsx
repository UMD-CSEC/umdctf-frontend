'use client'

import {useContext} from 'react';
import PreferencesContext from '@/contexts/PreferencesContext';


export default function ScrollableBackground() {
    const {preferences} = useContext(PreferencesContext);

    return (
        <img
            src="/assets/dune.svg"
            className={'fixed top-0 opacity-10 object-cover object-center min-h-[100vh] max-h-[100vh] origin-bottom'}
        />
    )
}
