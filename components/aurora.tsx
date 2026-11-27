"use client";

import { useEffect, useRef } from "react";

const VERT = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAG = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uPointer;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = (uv - 0.5) * vec2(uRes.x / max(uRes.y, 1.0), 1.0);
  p += (uPointer - 0.5) * 0.22;
  float t = uTime;

  float silk = sin(p.x * 1.65 + p.y * 0.42 + t * 0.34);
  silk += sin(p.y * 1.45 - p.x * 0.68 + t * 0.27) * 0.72;
  silk += sin((p.x + p.y) * 1.12 - t * 0.21) * 0.46;

  float y = p.y + silk * 0.11;
  float bandA = exp(-pow(y + 0.16, 2.0) * 7.2);
  float bandB = exp(-pow(y - 0.24 + sin(p.x * 1.15 + t * 0.31) * 0.08, 2.0) * 8.6);
  float bandC = exp(-pow(p.x * 0.5 + y + 0.08, 2.0) * 5.8);

  vec3 col = vec3(0.027, 0.038, 0.07);
  col += vec3(0.16, 0.74, 0.96) * bandA * 0.78;
  col += vec3(0.36, 0.34, 0.96) * bandB * 0.52;
  col += vec3(0.15, 0.78, 0.58) * bandC * 0.36;

  vec2 cell = fract(p * 5.5) - 0.5;
  float grid = smoothstep(0.49, 0.5, 1.0 - min(abs(cell.x), abs(cell.y)));
  col += vec3(0.55, 0.78, 1.0) * grid * 0.045;

  vec2 gid = floor(p * 8.0);
  float n = hash(gid);
  float spark = smoothstep(0.07, 0.0, length(fract(p * 8.0) - 0.5));
  float twinkle = 0.45 + 0.55 * sin(t * 0.7 + n * 14.0);
  col += vec3(1.0, 0.74, 0.42) * spark * step(0.84, n) * twinkle * 0.7;

  float vig = smoothstep(1.28, 0.22, length(p));
  col *= mix(0.42, 1.0, vig);
  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function Aurora() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
    });
    if (!gl) return;

    const vertex = compile(gl, gl.VERTEX_SHADER, VERT);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vertex || !fragment) return;
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.bindAttribLocation(program, 0, "aPos");
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.useProgram(program);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "uRes");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uPointer = gl.getUniformLocation(program, "uPointer");
    const pointer = { x: 0.5, y: 0.5 };
    const target = { x: 0.5, y: 0.5 };
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let running = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    const draw = (time: number) => {
      resize();
      pointer.x += (target.x - pointer.x) * 0.045;
      pointer.y += (target.y - pointer.y) * 0.045;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, time);
      gl.uniform2f(uPointer, pointer.x, pointer.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const loop = (now: number) => {
      if (!running) return;
      draw(now * 0.001);
      frame = requestAnimationFrame(loop);
    };

    const onPointer = (event: PointerEvent) => {
      target.x = event.clientX / Math.max(window.innerWidth, 1);
      target.y = 1 - event.clientY / Math.max(window.innerHeight, 1);
    };

    const start = () => {
      cancelAnimationFrame(frame);
      if (motion.matches || document.hidden) {
        draw(8.5);
        return;
      }
      running = true;
      frame = requestAnimationFrame(loop);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    start();
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("resize", start);
    document.addEventListener("visibilitychange", onVisibility);
    motion.addEventListener("change", start);

    return () => {
      stop();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", start);
      document.removeEventListener("visibilitychange", onVisibility);
      motion.removeEventListener("change", start);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return (
    <div className="wallpaper" aria-hidden="true">
      <canvas ref={canvasRef} className="aurora-canvas" />
    </div>
  );
}
