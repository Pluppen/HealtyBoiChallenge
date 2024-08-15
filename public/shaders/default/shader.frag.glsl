#version 100
precision highp float;

uniform float time;
uniform vec2 res;
uniform float xp;
uniform float level;

void main() {
  float speed = 1.0;

  vec2 p = gl_FragCoord.xy / res;
  vec2 center = vec2(0.5, 0.5);
  float distanceToCenter = distance(center, p);
  float radius = 0.3;
  if (distanceToCenter > radius) {
    gl_FragColor = vec4(
      0,
      0.3,
      0.6,
      1.0
    );
    return;
  }
  float r = 1.0-distanceToCenter;
  float g = 0.9-distanceToCenter;
  float b = 0.5*(sin(time * speed) * 0.5 + 0.5);
  gl_FragColor = vec4(
    r*r+b*0.3*(2.0-distanceToCenter),
    g*g,
    b,
    1.0
  );
}
