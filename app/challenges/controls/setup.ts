import type { Renderer } from "../webgl/renderer";
import { addMonitor } from "./monitor.controls";
import { addQualityControl } from "./quality.controls";
import { addRotationControls } from "./rotation.controls";

export async function setupControls(renderer: Renderer) {
    /*const { Pane } = await import("tweakpane");

    const pane = new Pane({
        title: "Controls",
        expanded: true,
    });

    if (renderer) {
        addQualityControl(pane, renderer, renderer.getQuality());
    }
    addMonitor(pane);*/
    addRotationControls(renderer, renderer.canvas);
}
