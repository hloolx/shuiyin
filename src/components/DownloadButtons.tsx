import { Download, FileArchive } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';

interface DownloadButtonsProps {
  hasCurrentImage: boolean;
  hasSelectedImages: boolean;
  selectedCount: number;
  onDownloadCurrent: () => void;
  onDownloadSelected: () => void;
  onDownloadAll: () => void;
}

export function DownloadButtons({
  hasCurrentImage,
  hasSelectedImages,
  selectedCount,
  onDownloadCurrent,
  onDownloadSelected,
  onDownloadAll,
}: DownloadButtonsProps) {
  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        {/* 三个按钮横排 */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Button
            onClick={onDownloadCurrent}
            disabled={!hasCurrentImage}
            className="w-full"
            variant="primary"
          >
            <Download className="mr-2 h-4 w-4" />
            下载当前
          </Button>

          <Button
            onClick={onDownloadSelected}
            disabled={!hasSelectedImages}
            className="w-full"
            variant="success"
          >
            <FileArchive className="mr-2 h-4 w-4" />
            选中 ({selectedCount})
          </Button>

          <Button
            onClick={onDownloadAll}
            disabled={!hasSelectedImages}
            className="w-full"
            variant="outline"
          >
            <FileArchive className="mr-2 h-4 w-4" />
            导出 ZIP
          </Button>
        </div>

        <p className="text-center text-xs text-gray-500">
          批量下载将自动打包为 ZIP 压缩文件
        </p>
      </CardContent>
    </Card>
  );
}
