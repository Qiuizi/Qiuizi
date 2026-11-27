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

  vec3 col = vec3(0.009, 0.010, 0.018);
  col += vec3(0.040, 0.060, 0.140) * b1;
  col += vec3(0.034, 0.052, 0.112) * b2;
  col += vec3(0.062, 0.036, 0.118) * b3;
  col += vec3(0.026, 0.058, 0.076) * b4;
  col += vec3(0.026, 0.040, 0.078) * b1 * b3 * 0.18;

  float crest = exp(-pow(w1, 2.0) * 58.0);
  float crestB = exp(-pow(w3, 2.0) * 48.0);
  col += vec3(0.18, 0.22, 0.32) * crest * 0.26;
  col += vec3(0.12, 0.10, 0.20) * crestB * 0.14;

  float dust = pow(max(sin(p.x * 22.0 + t * 1.4) * sin(p.y * 17.0 - t * 1.1), 0.0), 18.0);
  col += vec3(0.14, 0.18, 0.26) * dust * 0.038;

  float vig = smoothstep(1.38, 0.26, length(p));
  col *= mix(0.34, 1.0, vig);

  vec3 mapped = col * (0.48 * col + 0.055);
  mapped = mapped / (col * (0.62 * col + 0.42) + 0.075);
  float peak = max(mapped.r, max(mapped.g, mapped.b));
  float sat = peak - min(mapped.r, min(mapped.g, mapped.b));
  vec3 hue = mapped / max(peak, 0.001);
  float wash = smoothstep(0.30, 0.48, peak) * (1.0 - smoothstep(0.02, 0.14, sat));
  mapped = mix(mapped, hue * 0.32, wash);
  gl_FragColor = vec4(clamp(mapped, 0.0, 0.40), 1.0);
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
  { y: 0.32, amp: 0.16, freq: 1.6, speed: 1.15, phase: 0.2, width: 0.2, color: "rgba(22, 40, 88, 0.28)", core: "rgba(110, 140, 180, 0.18)" },
  { y: 0.48, amp: 0.2, freq: 1.15, speed: -0.86, phase: 1.4, width: 0.24, color: "rgba(16, 32, 70, 0.26)", core: "rgba(90, 118, 164, 0.15)" },
  { y: 0.62, amp: 0.14, freq: 2.1, speed: 1.35, phase: 2.2, width: 0.16, color: "rgba(42, 28, 78, 0.24)", core: "rgba(118, 98, 156, 0.15)" },
  { y: 0.4, amp: 0.11, freq: 0.85, speed: 0.72, phase: 0.8, width: 0.12, color: "rgba(14, 48, 62, 0.2)", core: "rgba(72, 128, 138, 0.13)" },
];

// One clock for the shader and the canvas fallback. 0.3 is about a third of the previous pace.
const DRIFT = 0.3;

function flowTime(now: number) {
  return now * 0.001 * DRIFT;
}

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

export function Aurora({ playing = true }: { playing?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playingRef = useRef(playing);
  const startRef = useRef<() => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const pointer = { x: 0.5, y: 0.5 };
    const target = { x: 0.5, y: 0.5 };
    const pointerEase = 0.02;
    let frame = 0;
    let running = true;
    let held = 0;
    let seen = false;
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
            pointer.x += (target.x - pointer.x) * pointerEase;
            pointer.y += (target.y - pointer.y) * pointerEase;
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
      pointer.x += (target.x - pointer.x) * pointerEase;
      pointer.y += (target.y - pointer.y) * pointerEase;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = "#05070c";
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
      ctx.fillStyle = "rgba(3, 5, 10, 0.42)";
      ctx.fillRect(0, 0, width, height);
      const vignette = ctx.createRadialGradient(
        width * 0.5,
        height * 0.45,
        Math.min(width, height) * 0.18,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.72,
      );
      vignette.addColorStop(0, "rgba(5, 7, 12, 0)");
      vignette.addColorStop(1, "rgba(2, 3, 6, 0.6)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);
    };

    const draw = (time: number) => {
      if (mode === "gl" && drawGL) drawGL(time);
      else draw2D(time);
    };

    const loop = (now: number) => {
      if (!running || !playingRef.current) return;
      held = flowTime(now);
      seen = true;
      draw(held);
      frame = requestAnimationFrame(loop);
    };

    const onPointer = (event: PointerEvent) => {
      target.x = event.clientX / Math.max(window.innerWidth, 1);
      target.y = 1 - event.clientY / Math.max(window.innerHeight, 1);
    };

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduceMotion = motionQuery.matches;
    const stillTime = 12.4;

    const start = () => {
      cancelAnimationFrame(frame);
      if (document.hidden) return;
      if (!playingRef.current || reduceMotion) {
        running = false;
        draw(reduceMotion ? stillTime : seen ? held : flowTime(performance.now()));
        return;
      }
      running = true;
      frame = requestAnimationFrame(loop);
    };
    startRef.current = start;

    const onMotionPreference = () => {
      reduceMotion = motionQuery.matches;
      start();
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
    motionQuery.addEventListener("change", onMotionPreference);

    return () => {
      stop();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", start);
      document.removeEventListener("visibilitychange", onVisibility);
      motionQuery.removeEventListener("change", onMotionPreference);
    };
  }, []);

  useEffect(() => {
    playingRef.current = playing;
    startRef.current();
  }, [playing]);

  return (
    <div className="wallpaper" aria-hidden="true">
      <canvas ref={canvasRef} className="aurora-canvas" />
    </div>
  );
}
