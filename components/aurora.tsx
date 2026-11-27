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

float ridge(float x) {
  float a = abs(x);
  return exp(-a * a * 90.0) * 1.35 + exp(-a * a * 10.0) * 0.55 + exp(-a * a * 2.2) * 0.18;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / max(uRes.y, 1.0);
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
  p += (uPointer - 0.5) * 0.18;
  float t = uTime;

  vec2 q = p;
  q.x += 0.42 * sin(p.y * 2.1 + t * 0.72);
  q.y += 0.34 * sin(p.x * 1.7 - t * 0.58);
  q.x += 0.18 * sin(q.y * 3.4 + t * 0.95);
  q.y += 0.14 * sin(q.x * 2.8 - t * 0.8);

  float flow = t * 0.85;
  float w1 = sin(q.y * 2.6 - flow * 2.4 + q.x * 0.35);
  float w2 = sin(q.y * 1.7 + flow * 1.85 + 1.4);
  float w3 = sin(q.x * 1.15 + q.y * 2.2 - flow * 2.1 + 2.2);
  float w4 = sin((q.x * 0.45 + q.y) * 2.4 + flow * 1.55);

  float breathe = 0.82 + 0.18 * sin(t * 0.65);
  float b1 = ridge((w1 + q.y * 0.15) * 0.72) * breathe;
  float b2 = ridge((w2 - q.y * 0.25 + 0.25) * 0.64);
  float b3 = ridge((w3 + 0.15) * 0.58);
  float b4 = ridge((w4 - 0.2) * 0.5);

  vec3 col = vec3(0.012, 0.02, 0.055);
  col += vec3(0.12, 0.95, 1.0) * b1 * 1.25;
  col += vec3(0.22, 0.48, 1.0) * b2 * 1.05;
  col += vec3(0.62, 0.32, 1.0) * b3 * 0.95;
  col += vec3(1.0, 0.62, 0.72) * b4 * 0.72;
  col += vec3(0.45, 0.95, 0.82) * b2 * b4 * 0.45;

  float spec = exp(-pow(w1, 2.0) * 28.0) + exp(-pow(w3, 2.0) * 22.0) * 0.75;
  col += vec3(0.9, 0.97, 1.0) * spec * 0.62;
  col += vec3(1.0, 0.82, 0.55) * exp(-pow(w4, 2.0) * 18.0) * 0.38;

  float dust = pow(max(sin(p.x * 22.0 + t * 1.4) * sin(p.y * 17.0 - t * 1.1), 0.0), 16.0);
  col += vec3(0.75, 0.92, 1.0) * dust * 0.45;

  float vig = smoothstep(1.55, 0.2, length(p));
  col *= mix(0.78, 1.0, vig);
  col = col / (vec3(1.0) + col * 0.28);
  gl_FragColor = vec4(col, 1.0);
}
`;

type Ribbon = {
  y: number;
  amp: number;
  freq: number;
  speed: number;
  phase: number;
  width: number;
  color: string;
  core: string;
};

const RIBBONS: Ribbon[] = [
  { y: 0.32, amp: 0.16, freq: 1.6, speed: 1.15, phase: 0.2, width: 0.2, color: "rgba(56, 220, 255, 0.55)", core: "rgba(230, 252, 255, 0.9)" },
  { y: 0.48, amp: 0.2, freq: 1.15, speed: -0.86, phase: 1.4, width: 0.24, color: "rgba(90, 120, 255, 0.42)", core: "rgba(214, 226, 255, 0.75)" },
  { y: 0.62, amp: 0.14, freq: 2.1, speed: 1.35, phase: 2.2, width: 0.16, color: "rgba(168, 92, 255, 0.4)", core: "rgba(244, 232, 255, 0.72)" },
  { y: 0.4, amp: 0.11, freq: 0.85, speed: 0.72, phase: 0.8, width: 0.12, color: "rgba(255, 150, 176, 0.32)", core: "rgba(255, 228, 206, 0.7)" },
];

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

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = { x: 0.5, y: 0.5 };
    const target = { x: 0.5, y: 0.5 };
    let frame = 0;
    let running = true;
    let mode: "gl" | "2d" = "2d";

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1.25 : 1.35);
      const width = Math.max(1, Math.floor((canvas.clientWidth || window.innerWidth) * dpr));
      const height = Math.max(1, Math.floor((canvas.clientHeight || window.innerHeight) * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      return { width, height };
    };

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
    });

    let drawGL: ((time: number) => void) | null = null;
    if (gl) {
      const vertex = compile(gl, gl.VERTEX_SHADER, VERT);
      const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAG);
      const program = gl.createProgram();
      if (vertex && fragment && program) {
        gl.attachShader(program, vertex);
        gl.attachShader(program, fragment);
        gl.bindAttribLocation(program, 0, "aPos");
        gl.linkProgram(program);
        if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
          const buffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
          gl.useProgram(program);
          gl.enableVertexAttribArray(0);
          gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
          const uRes = gl.getUniformLocation(program, "uRes");
          const uTime = gl.getUniformLocation(program, "uTime");
          const uPointer = gl.getUniformLocation(program, "uPointer");
          mode = "gl";
          drawGL = (time) => {
            const { width, height } = resize();
            gl.viewport(0, 0, width, height);
            pointer.x += (target.x - pointer.x) * 0.05;
            pointer.y += (target.y - pointer.y) * 0.05;
            gl.uniform2f(uRes, width, height);
            gl.uniform1f(uTime, time);
            gl.uniform2f(uPointer, pointer.x, pointer.y);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
          };
        }
      }
      if (mode !== "gl") gl.getExtension("WEBGL_lose_context")?.loseContext();
    }

    const ctx = mode === "2d" ? canvas.getContext("2d") : null;

    const draw2D = (time: number) => {
      if (!ctx) return;
      const { width, height } = resize();
      pointer.x += (target.x - pointer.x) * 0.05;
      pointer.y += (target.y - pointer.y) * 0.05;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = "#070b16";
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";
      const shift = (pointer.x - 0.5) * height * 0.08;
      for (const ribbon of RIBBONS) {
        ctx.beginPath();
        const step = Math.max(8, Math.floor(width / 90));
        for (let x = 0; x <= width; x += step) {
          const u = x / width;
          const wave = Math.sin(u * ribbon.freq * Math.PI * 2 + time * ribbon.speed + ribbon.phase);
          const y = ribbon.y * height + wave * ribbon.amp * height + shift;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = ribbon.color;
        ctx.lineWidth = ribbon.width * height;
        ctx.stroke();
        ctx.strokeStyle = ribbon.core;
        ctx.lineWidth = Math.max(2, ribbon.width * height * 0.12);
        ctx.stroke();
      }
      ctx.globalCompositeOperation = "source-over";
    };

    const draw = (time: number) => {
      if (mode === "gl" && drawGL) drawGL(time);
      else draw2D(time);
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
        draw(2.6);
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
    };
  }, []);

  return (
    <div className="wallpaper" aria-hidden="true">
      <canvas ref={canvasRef} className="aurora-canvas" />
    </div>
  );
}
