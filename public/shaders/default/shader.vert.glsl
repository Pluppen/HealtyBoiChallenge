#version 100
precision highp float;

attribute vec2 pos;
attribute vec2 tex;

uniform float time;
uniform vec2 res;
uniform float xp;
uniform float level;

varying vec2 v_tex;

void main() {
  v_tex = tex;
  gl_Position = vec4(pos.x, pos.y, 0, 1.0);
}
