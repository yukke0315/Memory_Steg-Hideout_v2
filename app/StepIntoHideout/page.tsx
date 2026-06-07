"use client";


import { UploadCloud, ArrowRight } from "lucide-react";
import { useState, useRef, type ChangeEvent } from "react";
import JSZip from "jszip";

// ステガノ関連の関数
import { extractTextFromImage } from "@/utils/steg";

// ZIP解読用関数
const handleZipUpload = async (
  e: ChangeEvent<HTMLInputElement>,
  setExtractedData: (data: any[]) => void
) => {
  const file = e.target.files?.[0];
  
  if (!file) {
    return;
  }

  console.log("ZIPファイルの解凍");
  const zip = new JSZip();

  try {
    // ZIPの解凍
    const zipContent = await zip.loadAsync(file);
    const extractedData: any[] = [];

    // ZIP内のファイルを順に処理
    for (const [fileName, zipEntry] of Object.entries(zipContent.files)) {
      if (!zipEntry.dir && fileName.endsWith(".png")) {
        console.log(`画像ファイル: ${fileName}`);
        const blob = await zipEntry.async("blob");
        const imageUrl = URL.createObjectURL(blob);
        
        // ステガノ取り出す
        const secretText = await extractTextFromImage(blob);
        const memoryData = JSON.parse(secretText);
        extractedData.push({
          id: fileName,
          imageUrl,
          title: memoryData.title,
          date: memoryData.date,
          diary: memoryData.diary,
        });
      }
    }

    setExtractedData(extractedData);
  } catch (error) {
    console.error("ZIP解読エラー:", error);
    alert("ZIPファイルの読み込み/解読に失敗");
  }
};

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [extractedData, setExtractedData] = useState<any[]>([]);

  const handleBoxClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 mt-2 md:mt-4">
    
      {/* タイトル */}
      <div className="text-center mb-15">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Step Into Hideout
        </h2>
        <p className="text-zinc-400">
          Welcome.
        </p>
      </div>

      {/* メイン */}
      <div className="w-full max-w-4xl bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 md:p-10 flex flex-col md:flex-row gap-8 md:gap-12 relative overflow-hidden backdrop-blur-sm">
        
        {/* 左側：ZIPアップロード */}
        <div className="flex-1 flex flex-col">
          <div
            className="cursor-pointer hover:border-zinc-500 transition-colors flex items-center gap-2 mb-4 text-zinc-300 font-medium"
            onClick={handleBoxClick}
          >
            <UploadCloud size={20} />
            <span>UPLOAD ZIP FILE</span>
          </div>
          
          <button
            type="button"
            className="flex-1 min-h-[200px] flex flex-col items-center justify-center gap-3 border-2 border-dashed border-zinc-700 rounded-xl hover:border-zinc-500 hover:bg-zinc-800/30 transition-all group"
            onClick={handleBoxClick}
          >
            <span className="text-zinc-300 font-medium group-hover:text-zinc-100 transition-colors">
              DRAG & DROP ZIP
            </span>

            <input 
              type="file" 
              accept=".zip" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={(e) => handleZipUpload(e, setExtractedData)} 
            />
          </button>

          {extractedData.length > 0 && (
            <div className="mt-6 space-y-4">
              {extractedData.map((item) => (
                <div key={item.id} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                  <div className="text-xs text-zinc-500 mb-1">{item.id}</div>
                  <div className="text-lg font-semibold text-zinc-100">{item.title}</div>
                  <p className="text-sm text-zinc-400 mt-2">{item.diary}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 中央の区切り線 */}
        <div className="hidden md:flex flex-col items-center justify-center relative">
          <div className="w-px h-full bg-zinc-800 absolute"></div>
          <span className="bg-zinc-900 text-zinc-500 px-3 py-1 text-sm font-bold z-10">
            OR
          </span>
        </div>

        {/* 右側：招待コード入力 */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="mb-4 text-zinc-300 font-medium">
            <span>INVITATION CODE</span>
          </div>
          
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Enter invitation code..." 
              className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all"
            />
            <button className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 px-4 py-3 rounded-lg border border-zinc-700 transition-colors flex items-center justify-center">
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}