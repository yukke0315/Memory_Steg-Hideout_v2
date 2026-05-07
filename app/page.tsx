import { ImagePlus, Unlock } from "lucide-react";
import Link from "next/link"; // Next.jsの画面遷移用コンポーネント

export default function Home() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 mt-10 md:mt-20">
      
      {/* タイトルとか */}
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Memory <span className="text-zinc-500">Steg-Hideout#2</span>
        </h2>
        <p className="text-zinc-400 tracking-wider">
          秘密の日記を、写真の裏側に。
        </p>
      </div>

      {/* 選択メニュー */}
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl">
        
        {/* CreateHideoutへのリンク */}
        <Link href="/CreateHideout" className="flex-1 group">
          <div className="h-full bg-zinc-900/50 border border-zinc-800 rounded-2xl p-10 flex flex-col items-center justify-center gap-6 hover:bg-zinc-800/80 hover:border-zinc-500 transition-all backdrop-blur-sm">
            <div className="p-5 bg-zinc-950 rounded-full group-hover:scale-110 transition-transform duration-300">
              <ImagePlus size={36} className="text-zinc-400 group-hover:text-zinc-100 transition-colors" />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-zinc-100 mb-2">Create Hideout</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                写真に日記を埋め込み、<br />新しい隠れ家（ZIP）を作成。
              </p>
            </div>
          </div>
        </Link>

        {/* StepIntoHideoutへのリンク */}
        <Link href="/StepIntoHideout" className="flex-1 group">
          <div className="h-full bg-zinc-900/50 border border-zinc-800 rounded-2xl p-10 flex flex-col items-center justify-center gap-6 hover:bg-zinc-800/80 hover:border-zinc-500 transition-all backdrop-blur-sm">
            <div className="p-5 bg-zinc-950 rounded-full group-hover:scale-110 transition-transform duration-300">
              <Unlock size={36} className="text-zinc-400 group-hover:text-zinc-100 transition-colors" />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-zinc-100 mb-2">Step Into Hideout</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                ZIPファイルや招待コードから、<br />隠れ家にアクセス。
              </p>
            </div>
          </div>
        </Link>

      </div>
    </div>
  );
}