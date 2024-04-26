'use client'

import {useContext, type ReactNode} from 'react';
import {useScroll} from '@/hooks/useScroll';
//import PreferencesContext from '@/contexts/PreferencesContext';


export default function NavWrapper(props: {children: ReactNode}) {
    const scroll = useScroll();
    //const {preferences} = useContext(PreferencesContext);

    return (
        <nav className={'flex justify-center ml-3 pt-3 pb-2 fixed self-center top-0 z-20 backdrop-blur-sm'}>
            {props.children}
        </nav>
    )
    //) : (
    //    <nav className={'flex justify-start ml-3 pt-3 pb-2 fixed w-full top-0 z-20'}>
    //        {props.children}
    //    </nav>
    //)
}
