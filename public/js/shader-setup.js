window.addEventListener("load", setupWebGL, false);

function getRenderingContext(player) {
  const canvas = document.querySelector(`canvas#${player.id}`);
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  const gl =
    canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  if (!gl) {
    console.error(
      "Failed to get WebGL context. Your browser or device may not support WebGL.",
    );
    return null;
  }
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  return gl;
}

let gl;
let program;

function setupWebGL(ev) {
  window.removeEventListener(ev.type, setupWebGL, false);
  if (!(gl = getRenderingContext())) return;

  let source = document.querySelector("#vertex-shader").innerHTML;
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, source);
  gl.compileShader(vertexShader);

  source = document.querySelector("#fragment-shader").innerHTML;
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, source);
  gl.compileShader(fragmentShader);

  program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.detachShader(program, vertexShader);
  gl.detachShader(program, fragmentShader);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const linkErrorLog = gl.getProgramInfoLog(program);
    cleanup();
    console.error(
      `Shader program did not link successfully. Error: ${linkErrorLog}`,
    );
    return;
  }

  gl.useProgram(program);
  initializeAttributes();

  gl.drawArrays(gl.TRIANGLES, 0, 6);

  const start = Date.now();
  setInterval(() => {
    const time = (Date.now() - start) / 1000;
    gl.uniform1f(program.time, time);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.enableVertexAttribArray(program.pos);
    gl.vertexAttribPointer(program.pos, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }, 10);
}

let vertexBuffer;
function initializeAttributes() {
  const aspect = 194 / 182;
  const size = 1;
  const vertices = new Float32Array([
    -size,
    size * aspect,
    size,
    size * aspect,
    size,
    -size * aspect,
    -size,
    size * aspect,
    size,
    -size * aspect,
    -size,
    -size * aspect,
  ]);

  vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  program.pos = gl.getAttribLocation(program, "pos");
  gl.enableVertexAttribArray(program.pos);
  gl.vertexAttribPointer(program.pos, 2, gl.FLOAT, false, 0, 0);

  program.time = gl.getUniformLocation(program, "time");
  gl.uniform1f(program.time, 0);

  program.res = gl.getUniformLocation(program, "res");
  gl.uniform2f(program.res, gl.canvas.width, gl.canvas.height);
}

window.addEventListener("beforeunload", cleanup, true);
function cleanup() {
  gl.useProgram(null);
  if (vertexBuffer) {
    gl.deleteBuffer(vertexBuffer);
  }
  if (timeBuffer) {
    gl.deleteBuffer(timeBuffer);
  }

  if (program) {
    gl.deleteProgram(program);
  }
}
