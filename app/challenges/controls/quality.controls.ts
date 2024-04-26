import { Renderer } from "../webgl/renderer";
import { ListBladeApi, Pane } from "tweakpane";
import { Quality } from "../webgl/settings/quality";

export function addQualityControl(
    pane: Pane,
    renderer: Renderer,
    defaultValue: Quality
) {
    (
        pane.addBlade({
            view: "list",
            label: "quality",
            options: [
                { text: "lmao", value: Quality.LMAO },
                { text: "super super low", value: Quality.SUPER_SUPER_LOW },
                { text: "super low", value: Quality.SUPER_LOW },
                { text: "low", value: Quality.LOW },
                { text: "medium", value: Quality.MEDIUM },
                { text: "optimal", value: Quality.OPTIMAL },
            ],
            value: defaultValue,
        }) as ListBladeApi<Quality>
    ).on("change", ({ value }) => {
        renderer.setQuality(value);
        renderer.setSize(window.innerWidth * value, window.innerHeight * value);
    });
}
