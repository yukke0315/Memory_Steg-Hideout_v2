import { UploadCloud, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 mt-10 md:mt-20">
    
      {/* タイトル */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Step Into Hideout
        </h2>
        <p className="text-zinc-400">
          Welcome.
        </p>
      </div>

      {/* メインの入力パネル */}
      <div className="w-full max-w-4xl bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 md:p-10 flex flex-col md:flex-row gap-8 md:gap-12 relative overflow-hidden backdrop-blur-sm">
        
        {/* 左側：ZIPアップロード */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-4 text-zinc-300 font-medium">
            <UploadCloud size={20} />
            <span>UPLOAD ZIP FILE</span>
          </div>
          
          <button className="flex-1 min-h-[200px] flex flex-col items-center justify-center gap-3 border-2 border-dashed border-zinc-700 rounded-xl hover:border-zinc-500 hover:bg-zinc-800/30 transition-all group">
            <span className="text-zinc-300 font-medium group-hover:text-zinc-100 transition-colors">
              DRAG & DROP ZIP
            </span>
          </button>
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