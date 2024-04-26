import type {CTFEndedResponse} from '@/util/errors';


export type Challenge = {
    name: string,
    id: string,
    files: FileData[]
    category: string,
    author: string,
    description: string,
    sortWeight: number,
    solves: number,
    points: number,
}

type FileData = {
    url: string,
    name: string
}

type ChallengesResponse = {
    kind: 'goodChallenges',
    message: string,
    data: Challenge[]
}

export async function getChallenges(token: string): Promise<ChallengesResponse | CTFEndedResponse> {
    const res = await fetch(`${process.env.API_BASE}/challs`, {
        headers: {'Authorization': `Bearer ${token}`}
    });
    return await res.json();

    return {
        kind: 'goodChallenges',
        message: "wow",
        data: [
            {
                name: "Test Challenge",
                id: "chall",
                files: [{
                    url: "http://localhost:1377/wow",
                    name: "test.c"
                }],
                category: "pwn",
                author: "triacontakai",
                description: "this is a cool test challenge",
                sortWeight: 1,
                solves: 13,
                points: 727,
            },
            {
                name: "Pepega",
                id: "chall2",
                files: [{
                    url: "http://localhost:1377/wow",
                    name: "test.c"
                }],
                category: "pwn",
                author: "hari",
                description: "dumbass bozo",
                sortWeight: 2,
                solves: 13,
                points: 420,
            },
            {
                name: "french baguette",
                id: "chall3",
                files: [{
                    url: "http://localhost:1377/baguette",
                    name: "baguette"
                }],
                category: "osint",
                author: "seg L",
                description: "impossible segal ml",
                sortWeight: 3,
                solves: 0,
                points: 500,
            },
            {
                name: "placeholder 1",
                id: "chall4",
                files: [{
                    url: "http://localhost:1377/baguette",
                    name: "placeholder"
                }],
                category: "misc",
                author: "impostor",
                description: "cool funny description that is reasonably long so i can see what it looks like in the preview wow wow wow wow wow wow wow",
                sortWeight: 3,
                solves: 0,
                points: 500,
            },
            {
                name: "placeholder 2",
                id: "chall5",
                files: [{
                    url: "http://localhost:1377/baguette",
                    name: "placeholder"
                }],
                category: "misc",
                author: "impostor",
                description: "cool funny description that is reasonably long so i can see what it looks like in the preview wow wow wow wow wow wow wow",
                sortWeight: 3,
                solves: 0,
                points: 500,
            },
            {
                name: "rev 3",
                id: "chall6",
                files: [{
                    url: "http://localhost:1377/baguette",
                    name: "placeholder"
                }],
                category: "rev",
                author: "impostor",
                description: "cool funny description that is reasonably long so i can see what it looks like in the preview wow wow wow wow wow wow wow",
                sortWeight: 3,
                solves: 0,
                points: 500,
            },
            {
                name: "pwn 4",
                id: "chall7",
                files: [{
                    url: "http://localhost:1377/baguette",
                    name: "placeholder"
                }],
                category: "pwn",
                author: "impostor",
                description: "cool funny description that is reasonably long so i can see what it looks like in the preview wow wow wow wow wow wow wow",
                sortWeight: 3,
                solves: 0,
                points: 500,
            },
            {
                name: "cryptoooooo",
                id: "chall8",
                files: [{
                    url: "http://localhost:1377/baguette",
                    name: "placeholder"
                }],
                category: "crypto",
                author: "cryptocryptocrypto",
                description: "cool funny description that is reasonably long so i can see what it looks like in the preview wow wow wow wow wow wow wow",
                sortWeight: 3,
                solves: 0,
                points: 500,
            },
            {
                name: "web of trust",
                id: "chall9",
                files: [{
                    url: "http://localhost:1377/baguette",
                    name: "placeholder"
                }],
                category: "web",
                author: "edward feng",
                description: "cool funny description that is reasonably long so i can see what it looks like in the preview wow wow wow wow wow wow wow",
                sortWeight: 3,
                solves: 0,
                points: 500,
            }
        ]
    };
}
