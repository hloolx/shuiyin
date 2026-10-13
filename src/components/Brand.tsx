const logo = `${import.meta.env.BASE_URL}images/logo108.png`;

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <img src={logo} alt="" width={36} height={36} className="h-9 w-9 shrink-0 rounded-xl" />
      <div className="min-w-0">
        <p className="truncate text-[15px] font-semibold leading-tight text-foreground">水印工具</p>
        {!compact && <p className="truncate text-[11px] leading-tight text-foreground-tertiary">本地处理 · 隐私安全</p>}
      </div>
    </div>
  );
}
