export function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">批量图片水印工具</h1>
            <p className="mt-1 text-sm text-blue-100">
              完全本地处理 · 隐私安全 · 批量操作 · 实时预览
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-100">v1.0.0</div>
          </div>
        </div>
      </div>
    </header>
  );
}
