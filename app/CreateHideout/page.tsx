"use client";

import { useState, useRef } from "react";
import { Image as ImageIcon, Trash2, FileArchive } from "lucide-react";
import Link from "next/link";

export default function CreateHideout() {
  // 画像プレビュー用のState
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 画像部分がクリックされたらinputにもっていく(デフォルトUI隠し)
  const handleImageClick = () => {
    console.log("画像エリアがクリックされた！", fileInputRef.current);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      console.log("あれ？fileInputRef.current が空っぽだよ！");
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // プレビュー用URL作っておく
      const imgUrl = URL.createObjectURL(file);
      setPreviewUrl(imgUrl);
    }
  }

  // 削除ボタン処理
  const handleRemoveImage = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // inputの中身も
    }
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-zinc-900 text-zinc-100 pt-2 md:pt-4">

      {/* タイトル */}
      <div className="text-center mb-4 md:mb-6">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Create Hideout
        </h2>
        <p className="text-zinc-400">
          Welcome.
        </p>
      </div>

      {/* メイン */}
      <main className="flex-1 p-6 md:px-10 pb-10">
        <div className="mx-auto flex flex-col lg:flex-row gap-8 max-w-5xl">
          
          {/* 左カラム：画像プレビュー */}
          <div className="flex-1">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-4">
              <div className="flex justify-between items-center px-2">
                <span className="text-sm text-zinc-400">Uploaded photo</span>
              </div>
              
              <div onClick={handleImageClick} className="w-full aspect-[4/3] bg-zinc-800 rounded-xl flex items-center justify-center border border-zinc-700/50 overflow-hidden cursor-pointer hover:bg-zinc-700/50 transition-colors">
                {/* 画像ナシならダミー */}
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />) : (
                  <ImageIcon size={48} className="text-zinc-600" />
                )}
              </div>

              {/* ファイル選択 */}
              <input 
                type="file" 
                accept="image/*" // 画像のみ
                className="hidden" // 隠す
                ref={fileInputRef} // refで動かす
                onChange={handleFileChange} // handleFileChangeを実行
              />

              <div className="flex justify-center gap-6 py-2 border-t border-zinc-800 mt-2">
                <button onClick={handleRemoveImage} className="text-zinc-400 hover:text-red-400 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* 右カラム：入力フォーム */}
          <div className="flex-[1.2] flex flex-col gap-6">
            <div>
              <h3 className="text-xl font-bold mb-1">ADD NEW MEMORY</h3>
              <p className="text-sm text-zinc-500">思い出を言葉に。</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Title</label>
                <input type="text" placeholder="カフェに行った" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all" />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm text-zinc-400 mb-2">Date</label>
                  {/* デフォルトで値入れないとダサい */}
                  <input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all [color-scheme:dark]" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Diary</label>
                <textarea rows={6} placeholder="散歩中に見つけたカフェに..." className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all resize-none"></textarea>
              </div>
            </div>

            <div className="flex items-center justify-end mt-auto pt-4">
              <button className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors shadow-lg shadow-emerald-900/20">
                <FileArchive size={18} /> Export as ZIP
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}