import type { FlagshipId } from "@/data/showcase";

const previewShell =
  "flex flex-col justify-center gap-3.5 rounded-[18px] border border-slate-900/[0.08] bg-[linear-gradient(145deg,#f8fafc_0%,#eef2ff_100%)] p-[22px] lg:min-h-[290px]";

const previewCard =
  "rounded-[14px] border border-slate-900/[0.08] bg-white px-4 py-3.5 shadow-[0_4px_14px_rgba(15,23,42,0.04)]";

const pieces = [
  { char: "帥", tone: "red" },
  { char: "炮", tone: "red" },
  { char: "車", tone: "black" },
  { char: "馬", tone: "black" },
] as const;

export function StagePreview({ id }: { id: FlagshipId }) {
  return (
    <div className={previewShell}>
      {id === "qisland" ? <QislandPreview /> : null}
      {id === "coursedesk" ? <CourseDeskPreview /> : null}
      {id === "deepunpack" ? <DeepUnpackPreview /> : null}
      {id === "xiangqi" ? <XiangqiPreview /> : null}
    </div>
  );
}

function QislandPreview() {
  return (
    <>
      <div className="flex items-center justify-between gap-3 rounded-full bg-[#111317] px-5 py-[13px] text-white shadow-[0_12px_28px_rgba(15,23,42,0.20)]">
        <span>
          <strong>Qisland</strong> · 灵动岛运行中
        </span>
        <span className="font-mono text-xs text-[#60a5fa]">v4.3.0</span>
      </div>
      <div className={previewCard}>
        <p className="text-[13.5px] font-semibold">媒体与专注胶囊</p>
        <p className="mt-1 text-[12.5px] leading-relaxed text-muted">
          无需切窗口即可控制播放、查看计时与系统轻提醒。
        </p>
      </div>
    </>
  );
}

function CourseDeskPreview() {
  return (
    <>
      <div className={previewCard}>
        <p className="text-[13.5px] font-semibold">单课一键分析 · 4 阶段完成</p>
        <div className="my-2.5 grid grid-cols-4 gap-1.5" aria-hidden="true">
          {["fetch", "transcribe", "clean", "analyze"].map((step) => (
            <div key={step} className="h-2 rounded-full bg-accent" />
          ))}
        </div>
        <p className="text-[12.5px] leading-relaxed text-muted">
          抓取资料 → 转写录音 → 清洗整理 → 单课分析
        </p>
      </div>
      <div className={previewCard}>
        <p className="text-[13.5px] font-semibold">三层结构化笔记</p>
        <p className="mt-1 text-[12.5px] leading-relaxed text-muted">
          本课讲了什么 · 关联前序 · 综合理解
        </p>
      </div>
    </>
  );
}

function DeepUnpackPreview() {
  return (
    <>
      <div className={previewCard}>
        <p className="text-[13.5px] font-semibold">解到底 → 筛选预览 → 批量重命名</p>
        <p className="mt-1 text-[12.5px] leading-relaxed text-muted">
          三步一体化完成压缩包清理与归档，全程本地离线处理。
        </p>
      </div>
      <div className={previewCard}>
        <p className="text-[13.5px] font-semibold">嵌套包自动展平 · 垃圾自动清理</p>
        <p className="mt-1 text-[12.5px] leading-relaxed text-muted">
          失败项支持行内补密码重试，一键撤销重命名。
        </p>
      </div>
    </>
  );
}

function XiangqiPreview() {
  return (
    <div className="rounded-[14px] border border-[#e2d5be] bg-[#fbf7ef] px-6 py-6 text-center">
      <p className="mb-3.5 text-lg font-bold tracking-[0.4em] text-[#8a6b43]">楚河 汉界</p>
      <div className="flex flex-wrap justify-center gap-3">
        {pieces.map((piece) => (
          <span
            key={piece.char}
            className={`grid size-9 place-items-center rounded-full border-[1.5px] bg-white text-base font-bold ${
              piece.tone === "red"
                ? "border-[#c0281c] text-[#c0281c]"
                : "border-[#1d1d1f] text-[#1d1d1f]"
            }`}
          >
            {piece.char}
          </span>
        ))}
      </div>
    </div>
  );
}
