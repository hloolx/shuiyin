import { Github, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-gray-600 md:flex-row">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://github.com/joyqi/sfz"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-blue-600"
            >
              原项目地址
              <ExternalLink className="h-3 w-3" />
            </a>
            <span>·</span>
            <a
              href="https://github.com/hloolx/shuiyin"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-blue-600"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
            <span>·</span>
            <a
              href="https://github.com/hloolx/shuiyin/blob/master/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600"
            >
              GPL-3.0 License
            </a>
          </div>

          <div className="text-center md:text-right">
            <p>
              作者:{' '}
              <a
                href="https://github.com/hloolx"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600"
              >
                阿懒同学
              </a>
              {' '}·{' '}
              <a
                href="https://www.alantx.cn"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600"
              >
                博客
              </a>
            </p>
            <p className="mt-1 text-xs text-gray-500">
              使用 React + TypeScript + Tailwind CSS 重构
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
