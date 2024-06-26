import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';

// Components
import Filters from '@/app/challenges/Filters';
import Challenges from '@/app/challenges/Challenges';
//import DisplayToggle from '@/app/challenges/DisplayToggle';
import AdminChallengesPreviewAlert from '@/app/admin/challs/preview/AdminChallengesPreviewAlert';

// Utils
import {AUTH_COOKIE_NAME} from '@/util/config';
import {getAdminChallenges} from '@/util/admin';

import ThemeSwitcher from "@/app/ThemeSwitcher";


export default async function AdminChallengesPreview() {
    const token = cookies().get(AUTH_COOKIE_NAME)?.value;
    if (!token) return redirect('/');

    const challenges = await getAdminChallenges(token);
    if (challenges.kind !== 'goodChallenges')
        return redirect('/');

    // Map admin challenges to other challenge format
    const parsed = challenges.data.map(c => ({...c, points: c.points.max}));

    return (
        <div>
            <AdminChallengesPreviewAlert />
            {<ThemeSwitcher />}
            <Challenges
                challenges={parsed}
                solves={[]}
            />
        </div>
    )
}
