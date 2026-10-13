const logo = `${import.meta.env.BASE_URL}images/logo108.png`;
export function Brand({ compact = false }: { compact?: boolean }) {
  return <div className="brand"><img src={logo} alt="" width={36} height={36} />
    <div className="min-w-0"><p className="brand-name">水印</p>
      {!compact && <p className="brand-note">图片水印工具</p>}</div></div>;
}
