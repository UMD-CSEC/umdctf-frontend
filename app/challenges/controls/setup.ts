import type { Renderer } from "../webgl/renderer";
import { addRotationControls } from "./rotation.controls";

export async function setupControls(renderer: Renderer) {
    addRotationControls(renderer, renderer.canvas);
}
