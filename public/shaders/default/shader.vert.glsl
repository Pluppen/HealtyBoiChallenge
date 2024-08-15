#version 100
precision highp float;

attribute vec2 pos;

uniform float time;
uniform vec2 res;
uniform float xp;
uniform float level;

void main() {
  gl_Position = vec4(pos.x, pos.y, 0, 1.0);
}