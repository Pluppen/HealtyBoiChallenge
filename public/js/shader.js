window.addEventListener("load", setupAllCanvases, false);

async function setupAllCanvases() {
  const accounts = JSON.parse(await fetch("/account"));
  const canvases = document.getElementsByTagName("canvas");
  for (const canvas of canvases) {
    const accountId = parseInt(canvas.id.replace("profilePictureCanvas", ""));
    setupCanvas(
      canvas.id,
      accounts.find((account) => account.id == accountId),
    );
  }
}

function getRenderingContext(id) {
  console.log(`Getting element with ID '${id}'`);
  const canvas = document.querySelector(`#${id}`);
  const ctx =
    canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  if (!ctx) {
    console.error(
      "Failed to get WebGL context. Your browser or device may not support WebGL.",
    );
    return null;
  }
  ctx.canvas = canvas;
  return ctx;
}

async function fetch(url) {
  return new Promise((resolve, reject) => {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
      try {
        if (this.status <= 199 || this.status >= 300) {
          reject(this.status);
          return;
        }
        resolve(this.responseText);
      } catch (ex) {
        reject(ex);
      }
    };
    xhttp.open("GET", url);
    xhttp.send();
  });
}

function compileShader(ctx, type, source) {
  const shader = ctx.createShader(type);
  ctx.shaderSource(shader, source);
  ctx.compileShader(shader);
  return shader;
}

async function createProgram(ctx, id) {
  id = parseInt(id.replace("profilePictureCanvas", ""));
  const vertexShader = compileShader(
    ctx,
    ctx.VERTEX_SHADER,
    await fetch(`/shaders/${id}/shader.vert.glsl`),
  );
  const fragmentShader = compileShader(
    ctx,
    ctx.FRAGMENT_SHADER,
    await fetch(`/shaders/${id}/shader.frag.glsl`),
  );

  const program = ctx.createProgram();
  ctx.attachShader(program, vertexShader);
  ctx.attachShader(program, fragmentShader);
  ctx.linkProgram(program);
  ctx.detachShader(program, vertexShader);
  ctx.detachShader(program, fragmentShader);
  ctx.deleteShader(vertexShader);
  ctx.deleteShader(fragmentShader);
  if (!ctx.getProgramParameter(program, ctx.LINK_STATUS)) {
    const linkErrorLog = ctx.getProgramInfoLog(program);
    cleanup(ctx);
    console.error(
      `Shader ctx.program did not link successfully. Error: ${linkErrorLog}`,
    );
    return null;
  }

  return program;
}

async function setupCanvas(id, account) {
  const ctx = getRenderingContext(id);
  try {
    console.log(`Creating shader program for id = ${id}`);
    ctx.program = await createProgram(ctx, id);
    console.log(`Shader program for id = ${id} has been created successfully`);
  } catch (ex) {
    console.error(`Creating shader failed: ${ex}`);
    return;
  }

  window.addEventListener("beforeunload", () => cleanup(ctx), true);
  ctx.useProgram(ctx.program);
  initializeAttributes(ctx, account);

  ctx.viewport(0, 0, ctx.drawingBufferWidth, ctx.drawingBufferHeight);
  ctx.clearColor(0.0, 0.0, 0.0, 1.0);
  ctx.clear(ctx.COLOR_BUFFER_BIT);
  ctx.drawArrays(ctx.TRIANGLES, 0, 6);

  const start = Date.now();
  setInterval(() => {
    if (ctx.program.time) {
      const time = (Date.now() - start) / 1000;
      ctx.uniform1f(ctx.program.time, time);
    }

    ctx.drawArrays(ctx.TRIANGLES, 0, 6);
  }, 10);
}

function initializeAttributes(ctx, account) {
  const aspect = ctx.canvas.clientWidth / ctx.canvas.clientHeight;
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

  ctx.vertexBuffer = ctx.createBuffer();
  ctx.bindBuffer(ctx.ARRAY_BUFFER, ctx.vertexBuffer);
  ctx.bufferData(ctx.ARRAY_BUFFER, vertices, ctx.STATIC_DRAW);

  ctx.program.pos = ctx.getAttribLocation(ctx.program, "pos");
  ctx.enableVertexAttribArray(ctx.program.pos);
  ctx.vertexAttribPointer(ctx.program.pos, 2, ctx.FLOAT, false, 0, 0);

  ctx.program.time = ctx.getUniformLocation(ctx.program, "time");
  if (ctx.program.time) {
    ctx.uniform1f(ctx.program.time, 0);
  }

  ctx.program.res = ctx.getUniformLocation(ctx.program, "res");
  if (ctx.program.res) {
    ctx.uniform2f(ctx.program.res, ctx.canvas.width, ctx.canvas.height);
  }

  if (ctx.program.xp) {
    ctx.program.xp = ctx.getUniformLocation(ctx.program, "xp");
    ctx.uniform1f(ctx.program.xp, account.player.xp);
  }

  if (ctx.program.level) {
    ctx.program.level = ctx.getUniformLocation(ctx.program, "level");
    ctx.uniform1f(ctx.program.level, account.player.level || 0);
  }
}

function cleanup(ctx) {
  ctx.useProgram(null);
  if (ctx.vertexBuffer) {
    ctx.deleteBuffer(ctx.vertexBuffer);
  }

  if (ctx.program) {
    ctx.deleteProgram(ctx.program);
  }
}
