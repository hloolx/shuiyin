import { Camera, ImagePlus, SlidersHorizontal, Download, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { FileDropzone } from './arc/file-dropzone/file-dropzone';
import { Button } from './ui/Button';
import { isMac } from '../lib/utils';

interface LandingProps {
  onPick: () => void; onFiles: (files: File[]) => void; onCamera: () => void; showCamera: boolean;
}
export function Landing({ onPick, onFiles, onCamera, showCamera }: LandingProps) {
  return (
    <div className="landing-page">
      <div className="landing-intro">
        <h1>给图片加水印，<br />安心分享每一张</h1>
        <p className="landing-description">证件注明用途，作品保留署名。<br />从选择图片到批量导出，都在你的浏览器里完成。</p>
        <Button variant="primary" size="lg" onClick={onPick}>
          <ImagePlus size={20} strokeWidth={1.75} aria-hidden />选择图片<ArrowUpRight size={16} aria-hidden />
        </Button>
        <p className="landing-shortcut">也可以直接粘贴图片 <kbd>{isMac ? '⌘' : 'Ctrl'} + V</kbd></p>
        <div className="privacy-note"><ShieldCheck size={20} strokeWidth={1.75} aria-hidden /><span>图片本地处理，不上传到服务器</span></div>
      </div>
      <section className="landing-import" aria-label="导入图片">
        <div data-local-dropzone>
          <FileDropzone multiple maxFiles={Number.MAX_SAFE_INTEGER}
            label="把图片放到这里" description="拖入图片，或点按选择文件"
            note="支持 JPG、PNG、WebP 等图片格式，可一次选择多张"
            dropLabel="松手即可添加图片" onFilesChange={onFiles} />
        </div>
        {showCamera && <Button variant="ghost" onClick={onCamera}><Camera size={20} aria-hidden />拍照添加</Button>}
        <div className="import-formats"><span>原图清晰度</span><span>批量导出</span><span>无需注册</span></div>
      </section>
      <ol className="landing-workflow" aria-label="使用步骤">
        <li><ImagePlus size={20} strokeWidth={1.75} aria-hidden /><div><h2>选择图片</h2><p>拖入、粘贴，或从相册选择。</p></div></li>
        <li><SlidersHorizontal size={20} strokeWidth={1.75} aria-hidden /><div><h2>调整水印</h2><p>修改文字与样式，实时看效果。</p></div></li>
        <li><Download size={20} strokeWidth={1.75} aria-hidden /><div><h2>导出分享</h2><p>保留原始分辨率，多张打包下载。</p></div></li>
      </ol>
    </div>
  );
}
