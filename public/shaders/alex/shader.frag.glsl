#version 100
precision mediump float;

uniform float time;
uniform vec2 res;

void main() {
  vec2 p = gl_FragCoord.xy / res;
  p = p * 2.0 - 1.0;
  float d = length(p);
  float dSq = d*d;
  gl_FragColor = vec4(
    (cos(time*0.8)*0.5+0.5)*(0.2/d),
    0.1/dSq,
    0.0,
    1.0
  );
}

