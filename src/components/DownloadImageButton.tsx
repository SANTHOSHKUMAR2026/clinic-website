import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import { Download, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface DownloadImageButtonProps {
    targetRef: React.RefObject<HTMLDivElement>;
    filename?: string;
}

export function DownloadImageButton({ targetRef, filename = "appointment-card.png" }: DownloadImageButtonProps) {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        if (!targetRef.current) return;
        
        setIsDownloading(true);
        try {
            const dataUrl = await toPng(targetRef.current, {
                quality: 1.0,
                pixelRatio: 2, // High resolution
                backgroundColor: '#ffffff'
            });
            saveAs(dataUrl, filename);
        } catch (error) {
            console.error("Failed to generate image", error);
            alert("Failed to download image. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <button 
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center justify-center space-x-2 w-full sm:w-auto bg-white border-2 border-slate-200 hover:border-[var(--color-primary)] hover:bg-blue-50 text-slate-700 hover:text-[var(--color-primary)] px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
            {isDownloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
            <span>{isDownloading ? "Generating..." : "Download Pass"}</span>
        </button>
    );
}
