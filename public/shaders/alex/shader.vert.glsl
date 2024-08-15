#version 100
precision highp float;

uniform float time;
attribute vec2 pos;

void main() {
  float speed = 1.5;
  //gl_Position = vec4(pos.x*(cos(time*speed)*0.5+0.5), pos.y*(sin(time*speed)*0.5+0.5), 0.0, 1.0);
  gl_Position = vec4(pos, 0, 1.0);
  gl_PointSize = 64.0;
}

