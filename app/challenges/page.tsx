import type {Metadata} from 'next';
import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';

// Components
import Filters from '@/app/challenges/Filters';
import Challenges from '@/app/challenges/Challenges';
import CTFNotStarted from '@/components/CTFNotStarted';

// Utils
import {getChallenges} from '@/util/challenges';
import {getMyProfile} from '@/util/profile';
import {AUTH_COOKIE_NAME} from '@/util/config';
import PreferencesContext from '@/contexts/PreferencesContext';
import { useContext } from 'react';
import ThemeSwitcher from '../ThemeSwitcher';


export const metadata: Metadata = {
    title: 'Challenges'
}

export default async function ChallengesPage() {
    const token = cookies().get(AUTH_COOKIE_NAME)!.value;

    const challenges = await getChallenges(token);
    const profile = await getMyProfile(token);

    if (profile.kind === 'badToken')
        return redirect('/logout');

    return challenges.kind === 'goodChallenges' ? (
        //<div className="container relative pt-32 pb-14 flex flex-col md:flex-row gap-6">
        <div>
            {<ThemeSwitcher />}
            <Challenges
                challenges={challenges.data}
                solves={profile.data.solves}
            />
        </div>
    ) : (
        <CTFNotStarted />
    )
        //{/*<div className="container relative pt-32 pb-14 flex flex-col md:flex-row-reverse md:max-w-[40%] md:mr-0 gap-6">*/}
        //    {/*<Filters
        //        challenges={challenges.data}
        //        solves={profile.data.solves}
        //    />*/}
}
