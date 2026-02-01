import { Github, ExternalLink, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://github.com/joyqi/sfz"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition-colors hover:text-primary"
            >
              原项目地址
              <ExternalLink className="h-3 w-3" />
            </a>
            <span className="text-border">·</span>
            <a
              href="https://github.com/hloolx/shuiyin"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition-colors hover:text-primary"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
            <span className="text-border">·</span>
            <a
              href="https://github.com/hloolx/shuiyin/blob/master/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-primary"
            >
              GPL-3.0 License
            </a>
          </div>

          <div className="flex items-center gap-1 text-center md:text-right">
            <span>作者:</span>
            <a
              href="https://github.com/hloolx"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium transition-colors hover:text-primary"
            >
              阿懒同学
            </a>
            <span className="mx-1">·</span>
            <Heart className="h-3 w-3 text-red-400" />
          </div>
        </div>
      </div>
    </footer>
  );
}
