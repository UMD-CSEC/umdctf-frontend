import {cookies} from 'next/headers';

// Components
import ProfileCard from '@/app/profile/ProfileCard';
import ProfileSolves from '@/app/profile/ProfileSolves';
import {getChallenges} from '@/util/challenges';

// Utils
import type {ProfileData} from '@/util/profile';
import {AUTH_COOKIE_NAME} from '@/util/config';


export default async function Profile(props: ProfileData) {
    const token = cookies().get(AUTH_COOKIE_NAME)!.value;
    const challs = await getChallenges(token);

    return (
        <div className="flex flex-col gap-4 flex-grow">
            <ProfileCard {...props} challs={challs.data} />
            <ProfileSolves {...props} />
        </div>
    )
}
