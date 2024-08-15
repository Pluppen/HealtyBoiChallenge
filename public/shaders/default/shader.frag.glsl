#version 100
precision highp float;

uniform float time;
uniform vec2 res;
uniform float xp;
uniform float level;

varying vec2 v_tex;

uniform sampler2D texture;

void renderTexture();
void renderDistortedTexture();
void renderProcedural();

void main() {
  renderDistortedTexture();
}

void renderTexture() {
  gl_FragColor = texture2D(texture, v_tex);
}

void renderDistortedTexture() {
  float x_speed = 0.5;
  float y_speed = 0.75;
  float cx = cos(time*x_speed) * 0.5 + 0.5;
  float cy = cos(time*y_speed) * 0.5 + 0.5;
  float d = (1.0 - distance(v_tex, vec2(cx, cy)));
  vec2 t = fract(v_tex * (2.0 * d * d));

  vec4 color = texture2D(texture, t);
  color = color*color;
  gl_FragColor = 1.0 - color;
}

void renderProcedural() {
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
