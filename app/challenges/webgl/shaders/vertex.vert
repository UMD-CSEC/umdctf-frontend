#version 300 es

precision highp float;

in vec2 position;
uniform vec2 uResolution;

out vec2 uv;

void main() {
  uv = (position - 0.5) * uResolution / min(uResolution.y, uResolution.x);

  gl_Position = vec4(2.0 * position - 1.0, 0.0, 1.0);
}