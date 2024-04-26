import SectionHeader from '@/components/SectionHeader';


export default function Rules() {
    return (
        <>
            <SectionHeader id="rules">
                Rules
            </SectionHeader>
            <ol className="list-decimal list-outside pl-6 space-y-2 mb-16">
                <li>
                    Do not attack the infrastructure. This includes csec.umd.edu, the umdctf.io platform,
                    and any external communication channels or other platforms associated with UMDCTF.
                </li>
                <li>
                    All flags are of the format
                    {' '}<code className="bg-black/40 px-2 py-1 text-primary rounded">{'UMDCTF{[a-zA-Z0-9_,.\'"?!@$<>*:\-+ ]+}'}</code>{' '}
                    unless otherwise noted in the challenge description. Do not bruteforce flags.
                </li>
                <li>
                    Be respectful - regardless of skill level or any other factor. We will not tolerate
                    derogatory and discriminatory language or behavior of any kind.
                </li>
                <li>
                    Make a good-faith attempt on challenges before asking for help from
                    UMDCTF organizers/developers (i.e: no begging for flags).
                </li>
                <li>
                    Do not ask for help on challenges outside of tickets. Competitors should report
                    unsolicited help requests in tickets.
                </li>
                <li>
                    Only collaborate with the people in your team.
                    Do not share flags or methodology outside of your team until the end of UMDCTF.
                </li>
                <li>
                    Do not bruteforce the online infrastructure - it is not necessary for any challenge.
                </li>
            </ol>
        </>
    )
}
