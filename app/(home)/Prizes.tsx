import type {ReactNode} from 'react';
import SectionHeader from '@/components/SectionHeader';


export default function Prizes() {
    const openPrizes = [
        '$1500 + 1 Binary Ninja Personal License',
        '$1000 + 1 Binary Ninja Persona License',
        '$500'
    ];
    const studentPrizes = [
        '$1000 + 1 Binary Ninja Personal License',
        '$600 + 1 Binary Ninja Personal License',
        '$400 + 1 Binary Ninja Personal License',
    ];

    return (
        <>
            <SectionHeader id="prizes">
                Prizes
            </SectionHeader>

            <div className="flex flex-col lg:flex-row gap-4 mb-4">
                <PrizeTable division="Open">
                    {openPrizes.map((p, i) => (
                        <div className="table-row bg-black/20 divide-x divide-secondary" key={i}>
                            <div className="table-cell p-2 border-t border-secondary text-right">{i + 1}.</div>
                            <div className="table-cell px-4 py-2 border-t border-secondary">{p}</div>
                        </div>
                    ))}
                </PrizeTable>

                <PrizeTable division="Student">
                    {studentPrizes.map((p, i) => (
                        <div className="table-row bg-black/20 divide-x divide-secondary" key={i}>
                            <div className="table-cell p-2 border-t border-secondary text-right">{i + 1}.</div>
                            <div className="table-cell px-4 py-2 border-t border-secondary">{p}</div>
                        </div>
                    ))}
                </PrizeTable>
            </div>

            <p className="text-sm text-white">
                <b>Best Binary Ninja Writeup:</b> 1 Personal Binary Ninja License
            </p>
        </>
    )
}

function PrizeTable(props: {children: ReactNode, division: string}) {
    return (
        <div className="table w-full text-sm border border-secondary">
            <div className="table-header-group">
                <div className="table-row bg-black/40 font-semibold text-primary divide-x divide-secondary">
                    <div className="table-cell p-2 w-12 text-right">#</div>
                    <div className="table-cell px-4 py-2">
                        {props.division} division prizes
                    </div>
                </div>
            </div>

            {props.children}
        </div>
    )
}
