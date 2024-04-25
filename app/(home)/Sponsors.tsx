import Sponsor from '@/app/(home)/Sponsor';
import SectionHeader from '@/components/SectionHeader';


export default function Sponsors() {
    return (
        <section className="container flex flex-col gap-2">
            <SectionHeader id="sponsors">
                Sponsors
            </SectionHeader>

            <Sponsor
                href="https://www.trailofbits.com/"
                src="/assets/sponsors/trail-of-bits.png"
                name="Trail of Bits"
            >
                Trail of Bits helps secure the world's most targeted organizations and products.
                We combine high-end security research with a real-world attacker mentality to reduce risk and fortify code.
            </Sponsor>

            <Sponsor
                href="https://binary.ninja"
                src="/assets/sponsors/binary-ninja.png"
                name="Vector 35"
            >
                Binary Ninja is an interactive decompiler, disassembler, debugger, and binary analysis platform built by reverse engineers, for reverse engineers.
                Binary Ninja is actively used by malware analysts, vulnerability researchers, and software developers worldwide.
            </Sponsor>

            <Sponsor
                href="https://www.zellic.io/"
                src="/assets/sponsors/zellic.svg"
                name="Zellic"
            >
                Zellic is a security research firm. We hire top CTF talent to solve the world's most critical security problems. We specialize in ZKPs, cryptography, web app security, smart contracts, and blockchain L1/L2s. Before Zellic, we previously founded perfect blue, the #1 CTF team in 2020 and 2021. You're a good fit for Zellic if you have extensive real-world experience in vulnerability research (VR) / binary exploitation, reverse engineering (RE), cryptography, or web application security. We hire internationally and offer competitive salaries and a comprehensive benefits package.
                <br />
                <br />
                To learn more about Zellic, check out our blog: <a href="https://www.zellic.io/blog/the-auditooor-grindset" target="_blank" rel="noopener noreferrer" className="text-theme-bright hover:underline">https://www.zellic.io/blog/the-auditooor-grindset</a>
                <br />
                Work at Zellic: <a href="mailto:jobs@zellic.io" className="text-theme-bright hover:underline">jobs@zellic.io</a> | @gf_256
            </Sponsor>

            <Sponsor
                href="https://ztc.io/"
                src="/assets/sponsors/ztc.png"
                name="ZTC"
            >
                ZTC specializes in the design and development of digital forensics tools.
                Established in 2004, the company focuses on creating new and innovative solutions to meet the unique needs of each of our customers.
                We develop widely deployed and highly regarded digital forensic tools.
                Few companies can match our experience and expertise when it comes to creating customized digital forensics software.
                Our tools process petabytes of data, and reveal billions of data points for our customers.
            </Sponsor>
        </section>
    )
}
