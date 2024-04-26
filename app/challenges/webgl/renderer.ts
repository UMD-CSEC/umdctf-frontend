'use client'

import vertexShader from "./shaders/vertex.vert";
import fragmentShader from "./shaders/procedural.frag";
import { Quality } from "./settings/quality";

const defaultUniforms = {
    uTime: 0,
    uQuality: Quality.LOW,
    uResolution: [0, 0],
    uRotationOffset: [0, 0],
    uSelectedPlanet: 0,
    uHoveredPlanet: 0,
    uPlanetPositions: [
        0, 0, 0,
        4, -5, -100, // caladan
        -50, 30, -100, // giedi prime
        15, -35, -100, // tleilax
        -15, 20, -100, // salusa secundus
        -85, 26, -100, // kaitain
    ],
    uChallengeCount: 8,
    uCameraPosition: [2 * 1.125, 2 * 0.75, 2 * 2],
    uCameraDirection: [0, 0, -1]
};

const planetRadii = [2, 4.16, 5.37, 4, 3, 5];

const challengeThetaPhi = [
    [0.2, 1.2],
    [-0.4, 1.1],
    [1.6, 0.6],
    [-1.7, 0.8],
    [1.7, 1],
    [2.7, 0.8],
    [-2.9, 0.7],
    [-2.4, 1.2],
];

export class Renderer {
    readonly canvas: HTMLCanvasElement;
    private readonly gl: WebGL2RenderingContext;

    private readonly shaderProgram: WebGLProgram;
    private readonly vao: WebGLVertexArrayObject;
    private readonly vbo: WebGLBuffer;
    private readonly noiseTexture: WebGLTexture;

    readonly uniforms = defaultUniforms;
    private readonly uniformLocations: { [key in keyof typeof defaultUniforms]: WebGLUniformLocation };

    private challengeSelected = false;
    private challengeIndex = 0;
    private chalAnimStartTime = 0;
    private planetStartThetaPhi = [0, 0];
    private planetStartThetaOffset = 0;

    constructor(canvas?: HTMLCanvasElement) {
        defaultUniforms.uResolution = [window.innerWidth, window.innerHeight];
        this.canvas = canvas ?? document.querySelector("canvas")!;
        this.gl = this.canvas.getContext("webgl2")!;

        this.shaderProgram = this.gl.createProgram()!;

        const vs = this.gl.createShader(this.gl.VERTEX_SHADER)!;
        this.gl.shaderSource(vs, vertexShader);
        this.gl.compileShader(vs);
        this.gl.attachShader(this.shaderProgram, vs);

        const fs = this.gl.createShader(this.gl.FRAGMENT_SHADER)!;
        this.gl.shaderSource(fs, fragmentShader);
        this.gl.compileShader(fs);
        this.gl.attachShader(this.shaderProgram, fs);

        this.gl.linkProgram(this.shaderProgram);
        this.gl.useProgram(this.shaderProgram);

        for (const shader of [vs, fs]) {
            const error = this.gl.getShaderInfoLog(shader);
            if (error) throw error;
        }

        const error = this.gl.getProgramInfoLog(this.shaderProgram);
        if (error) throw error;

        this.gl.deleteShader(vs);
        this.gl.deleteShader(fs);

        this.vao = this.gl.createVertexArray()!;
        this.gl.bindVertexArray(this.vao);

        this.vbo = this.gl.createBuffer()!;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
            0, 0,
            1, 0,
            0, 1,
            0, 1,
            1, 0,
            1, 1,
        ]), this.gl.STATIC_DRAW);

        this.gl.enableVertexAttribArray(0);
        this.gl.vertexAttribPointer(0, 2, this.gl.FLOAT, false, 0, 0);

        this.noiseTexture = this.gl.createTexture()!;
        fetch("/assets/3DNoise.bin").then(response => {
            response.arrayBuffer().then(binaryData => {
                this.gl.bindTexture(this.gl.TEXTURE_3D, this.noiseTexture);
                this.gl.texImage3D(
                    this.gl.TEXTURE_3D,
                    0,
                    this.gl.R8,
                    32,
                    32,
                    32,
                    0,
                    this.gl.RED,
                    this.gl.UNSIGNED_BYTE,
                    new Uint8Array(binaryData)
                );
                this.gl.texParameteri(this.gl.TEXTURE_3D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
                this.gl.texParameteri(this.gl.TEXTURE_3D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
            });
        });

        this.uniformLocations = {
            uTime: this.gl.getUniformLocation(this.shaderProgram, "uTime")!,
            uQuality: this.gl.getUniformLocation(this.shaderProgram, "uQuality")!,
            uResolution: this.gl.getUniformLocation(this.shaderProgram, "uResolution")!,
            uRotationOffset: this.gl.getUniformLocation(this.shaderProgram, "uRotationOffset")!,
            uSelectedPlanet: this.gl.getUniformLocation(this.shaderProgram, "uSelectedPlanet")!,
            uHoveredPlanet: this.gl.getUniformLocation(this.shaderProgram, "uHoveredPlanet")!,
            uPlanetPositions: this.gl.getUniformLocation(this.shaderProgram, "uPlanetPositions")!,
            uChallengeCount: this.gl.getUniformLocation(this.shaderProgram, "uChallengeCount")!,
            uCameraPosition: this.gl.getUniformLocation(this.shaderProgram, "uCameraPosition")!,
            uCameraDirection: this.gl.getUniformLocation(this.shaderProgram, "uCameraDirection")!
        };

        this.gl.uniform1f(this.uniformLocations.uQuality, this.uniforms.uQuality);
        this.gl.uniform2fv(this.uniformLocations.uResolution, this.uniforms.uResolution);
        this.gl.uniform2fv(this.uniformLocations.uRotationOffset, this.uniforms.uRotationOffset);
        this.gl.uniform1i(this.uniformLocations.uSelectedPlanet, this.uniforms.uSelectedPlanet);
        this.gl.uniform1i(this.uniformLocations.uHoveredPlanet, this.uniforms.uHoveredPlanet);
        this.gl.uniform3fv(this.uniformLocations.uPlanetPositions, this.uniforms.uPlanetPositions);
        this.gl.uniform1i(this.uniformLocations.uChallengeCount, this.uniforms.uChallengeCount);
        this.gl.uniform3fv(this.uniformLocations.uCameraPosition, this.uniforms.uCameraPosition);
        this.gl.uniform3fv(this.uniformLocations.uCameraDirection, this.uniforms.uCameraDirection);

        this.setSize(
            window.innerWidth * (this.uniforms.uQuality as number),
            window.innerHeight * (this.uniforms.uQuality as number)
        );

        window.addEventListener("resize", () => {
            const quality = this.uniforms.uQuality as number;
            this.setSize(
                window.innerWidth * quality,
                window.innerHeight * quality
            );
            for (let i = 0; i < (this as any).cats.length; i++) {
                const textEle = (this as any).cats[i].current;
                const [x, y] = this.getPlanetPositionPx(i);
                textEle.setAttribute("x", x+50);
                textEle.setAttribute("y", y-9);
            }
            for (let i = 0; i < (this as any).catLines.length / 2; i++) {
                const [x, y] = this.getPlanetPositionPx(i);
                const textEle = (this as any).cats[i].current;
                const width = textEle.getBoundingClientRect().width + 20;
                textEle.setAttribute("x", x+width/2);
                (this as any).catLines[i*2].current.setAttribute("stroke", "yellow");
                (this as any).catLines[i*2+1].current.setAttribute("stroke", "yellow");
                (this as any).catLines[i*2].current.x1.baseVal.value = x;
                (this as any).catLines[i*2].current.y1.baseVal.value = y-5;
                (this as any).catLines[i*2].current.x2.baseVal.value = x+width;
                (this as any).catLines[i*2].current.y2.baseVal.value = y-5;
                (this as any).catLines[i*2+1].current.x1.baseVal.value = x+width;
                (this as any).catLines[i*2+1].current.y1.baseVal.value = y-5;
                (this as any).catLines[i*2+1].current.x2.baseVal.value = x+width+10;
                (this as any).catLines[i*2+1].current.y2.baseVal.value = y-20;
            }
        });

        this.canvas.addEventListener("mousemove", (e) => this.onMouseMove(e));
        this.canvas.addEventListener("click", (e) => {
            this.selectPlanet(this.uniforms.uHoveredPlanet);
            if (this.uniforms.uHoveredPlanet != this.uniforms.uSelectedPlanet) {
                let category = ["misc", "osint", "pwn", "web", "rev", "crypto"][this.uniforms.uHoveredPlanet];
                (this as any).filter.categories = new Set([category]);
                (this as any).setFilter({...(this as any).filter});
            }
        });

        this.canvas.classList.add("loaded");
    }

    private cursorIntersectsPlanet(cursorX: number, cursorY: number): number {
        const res = this.uniforms.uResolution;
        const minRes = Math.min(...res);
        let rd = [((cursorX - (res[0] / 2)) / minRes), (((res[1] / 2) - cursorY) / minRes), 0];
        rd = [rd[0] + this.uniforms.uCameraDirection[0], rd[1] + this.uniforms.uCameraDirection[1], this.uniforms.uCameraDirection[2]];
        const mag = Math.sqrt((rd[0] * rd[0]) + (rd[1] * rd[1]) + (rd[2] * rd[2]));
        rd = [rd[0] / mag, rd[1] / mag, rd[2] / mag];
        const ro = this.uniforms.uCameraPosition;
        for (let i = 0; i < 6; i++) {
            if (i == this.uniforms.uSelectedPlanet) continue;
            const ce = this.uniforms.uPlanetPositions;
            const ra = planetRadii[i];
            const oc = [ro[0] - ce[i*3], ro[1] - ce[i*3+1], ro[2] - ce[i*3+2]];
            const b = (oc[0] * rd[0]) + (oc[1] * rd[1]) + (oc[2] * rd[2]);
            const c = (oc[0] * oc[0]) + (oc[1] * oc[1]) + (oc[2] * oc[2]) - (ra * ra);
            const h = (b * b) - c;
            if (h >= 0) {
                return i;
            }
        }
        return -1;
    }

    private onMouseMove(event: MouseEvent): void {
        const planet = this.cursorIntersectsPlanet(event.x, event.y);
        this.uniforms.uHoveredPlanet = planet != -1 ? planet : this.uniforms.uSelectedPlanet;

        this.gl.useProgram(this.shaderProgram);
        this.gl.uniform1i(this.uniformLocations.uHoveredPlanet, this.uniforms.uHoveredPlanet);
    }

    getSelectedPlanet(): number {
        return this.uniforms.uSelectedPlanet;
    }

    getChallengePositionPx(): [number, number] {
        const planet = this.uniforms.uSelectedPlanet;
        const [phi, theta] = [5 * Math.PI / 12, Math.PI / 5];
        const r = planetRadii[planet];
        const ce = [r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta)];
        const oc = [ce[0] - this.uniforms.uCameraPosition[0], ce[1] - this.uniforms.uCameraPosition[1], ce[2] - this.uniforms.uCameraPosition[2]];
        const z = this.uniforms.uCameraDirection[2];
        const rd = [z * oc[0] / oc[2], z * oc[1] / oc[2], z * oc[2] / oc[2]];
        const uv = [rd[0] - this.uniforms.uCameraDirection[0], rd[1] - this.uniforms.uCameraDirection[1]];
        const res = this.uniforms.uResolution;
        const minRes = Math.min(...res);
        return [uv[0] * minRes + (res[0] / 2), (res[1] / 2) - uv[1] * minRes];
    }

    getPlanetPositionPx(planet: number): [number, number] {
        const ps = this.uniforms.uPlanetPositions;
        const ce = [ps[planet * 3], ps[planet * 3 + 1] + planetRadii[planet], ps[planet * 3 + 2]];
        const oc = [ce[0] - this.uniforms.uCameraPosition[0], ce[1] - this.uniforms.uCameraPosition[1], ce[2] - this.uniforms.uCameraPosition[2]];
        const z = this.uniforms.uCameraDirection[2];
        const rd = [z * oc[0] / oc[2], z * oc[1] / oc[2], z * oc[2] / oc[2]];
        const uv = [rd[0] - this.uniforms.uCameraDirection[0], rd[1] - this.uniforms.uCameraDirection[1]];
        const res = this.uniforms.uResolution;
        const minRes = Math.min(...res);
        return [uv[0] * minRes + (res[0] / 2), (res[1] / 2) - uv[1] * minRes];
    }

    selectPlanet(planet: number): void {
        if (this.uniforms.uHoveredPlanet == this.uniforms.uSelectedPlanet) return;
        this.gl.useProgram(this.shaderProgram);
        const oldPos = this.uniforms.uPlanetPositions.slice(planet * 3, planet * 3 + 3);
        this.uniforms.uPlanetPositions[planet * 3] = 0;
        this.uniforms.uPlanetPositions[planet * 3 + 1] = 0;
        this.uniforms.uPlanetPositions[planet * 3 + 2] = 0;
        this.uniforms.uPlanetPositions[this.uniforms.uSelectedPlanet * 3] = oldPos[0];
        this.uniforms.uPlanetPositions[this.uniforms.uSelectedPlanet * 3 + 1] = oldPos[1];
        this.uniforms.uPlanetPositions[this.uniforms.uSelectedPlanet * 3 + 2] = oldPos[2];
        this.gl.uniform3fv(this.uniformLocations.uPlanetPositions, this.uniforms.uPlanetPositions);

        this.uniforms.uSelectedPlanet = planet;
        this.gl.uniform1i(this.uniformLocations.uSelectedPlanet, this.uniforms.uSelectedPlanet);

        this.uniforms.uCameraPosition = this.cameraPosition();
        this.gl.uniform3fv(this.uniformLocations.uCameraPosition, this.uniforms.uCameraPosition);

        this.uniforms.uRotationOffset = [0, 0];
        this.gl.uniform2fv(this.uniformLocations.uRotationOffset, this.uniforms.uRotationOffset);
    }

    deselectChallenge(): void {
        this.challengeSelected = false;
    }

    selectChallenge(challenge: number): void {
        this.challengeSelected = true;
        this.challengeIndex = challenge;
        this.chalAnimStartTime = performance.now() / 1000;
        this.planetStartThetaPhi[1] = this.uniforms.uRotationOffset[1];
        this.planetStartThetaPhi[0] = (this.uniforms.uRotationOffset[0] + this.uniforms.uTime * 0.1 / planetRadii[this.uniforms.uSelectedPlanet]) % (Math.PI * 2);
        this.planetStartThetaOffset = this.uniforms.uRotationOffset[0];
        if (this.planetStartThetaPhi[0] > Math.PI) {
            this.planetStartThetaPhi[0] -= 2 * Math.PI;
        }
        if (this.planetStartThetaPhi[1] > Math.PI) {
            this.planetStartThetaPhi[0] -= 2 * Math.PI;
        }
    }

    private cameraPosition(): [number, number, number] {
        const selectedPlanetRadius = planetRadii[this.uniforms.uSelectedPlanet];
        return [
            selectedPlanetRadius * 1.125,
            selectedPlanetRadius * 0.75,
            selectedPlanetRadius * 2
        ];
    }

    getQuality(): number {
        return this.uniforms.uQuality;
    }

    setQuality(quality: Quality): void {
        this.uniforms.uQuality = quality;
        this.gl.useProgram(this.shaderProgram);
        this.gl.uniform1f(this.uniformLocations.uQuality, this.uniforms.uQuality);
        this.setSize(
            window.innerWidth * quality,
            window.innerHeight * quality
        );
    }

    increaseRotationOffset(x: number): void {
        this.uniforms.uRotationOffset[0] += x;
        this.uniforms.uRotationOffset[0] %= Math.PI * 2;
        if (this.uniforms.uRotationOffset[0] > Math.PI) {
            this.uniforms.uRotationOffset[0] -= 2 * Math.PI;
        }
        this.gl.useProgram(this.shaderProgram);
        this.gl.uniform2fv(this.uniformLocations.uRotationOffset, this.uniforms.uRotationOffset);
    }

    setSize(width: number, height: number): void {
        this.canvas.width = width;
        this.canvas.height = height;
        this.gl.viewport(0, 0, width, height);

        this.uniforms.uResolution = [window.innerWidth, window.innerHeight];
        this.gl.useProgram(this.shaderProgram);
        this.gl.uniform2fv(this.uniformLocations.uResolution, this.uniforms.uResolution);
    }

    render() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        this.uniforms.uTime = performance.now() / 1000;
        this.gl.useProgram(this.shaderProgram);
        this.gl.uniform1f(this.uniformLocations.uQuality, this.uniforms.uQuality);
        this.gl.uniform1f(this.uniformLocations.uTime, this.uniforms.uTime);


        this.gl.uniform3fv(this.uniformLocations.uPlanetPositions, this.uniforms.uPlanetPositions);

        this.gl.uniform1i(this.uniformLocations.uSelectedPlanet, this.uniforms.uSelectedPlanet);

        this.gl.uniform3fv(this.uniformLocations.uCameraPosition, this.uniforms.uCameraPosition);
        this.gl.uniform1i(this.uniformLocations.uChallengeCount, this.uniforms.uChallengeCount);

        if (this.challengeSelected) {
            const t = performance.now() / 1000 - this.chalAnimStartTime;
            const maxTime = 0.5;
            const at = Math.min(t, maxTime);
            const aat = Math.min(Math.max(0, t - maxTime), maxTime);
            this.uniforms.uRotationOffset[0] = this.planetStartThetaOffset + (challengeThetaPhi[this.challengeIndex][0] - (Math.PI / 5) - this.planetStartThetaPhi[0]) * at / maxTime - (0.1 * t / planetRadii[this.uniforms.uSelectedPlanet]);
            this.uniforms.uRotationOffset[1] = this.planetStartThetaPhi[1] - (challengeThetaPhi[this.challengeIndex][1] - (5 * Math.PI / 12) + this.planetStartThetaPhi[1]) * aat / maxTime;
            this.gl.uniform2fv(this.uniformLocations.uRotationOffset, this.uniforms.uRotationOffset);
        }

        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

        requestAnimationFrame(() => this.render());
    }
}
