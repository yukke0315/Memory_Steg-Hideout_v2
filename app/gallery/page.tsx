"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { ArrowLeft, Lock, Calendar } from "lucide-react";
import Link from "next/link";

// ダミーデータ
const memories = [
  { id: 1, title: "hello", date: "2026.03.01" },
  { id: 2, title: "hello2", date: "2026.04.01" },
  { id: 3, title: "hello3", date: "2026.05.01" },
  { id: 4, title: "hello4", date: "2026.06.01" },
  { id: 5, title: "hello5", date: "2026.07.01" },
];

export default function GalleryPage() {
  // 選択した写真のIDを管理
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <div className="flex flex-col h-screen w-full bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      
      {/* ヘッダー */}
      <header className="w-full p-6 flex justify-between items-center shrink-0 z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-100 transition-colors">
          <ArrowLeft size={16} /> Exit Gallery
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono tracking-[0.3em] text-zinc-500">Hideout</span>
        </div>
      </header>

      {/* メインギャラリー */}
      <main className="flex-1 flex flex-col justify-center relative select-none">
      
        {/* 背景ぼかし */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[500px] h-[500px] bg-emerald-900/10 rounded-full blur-[120px]" />
        </div>

        <AnimatePresence mode="wait">
          {selectedId === null ? (
            <motion.div 
              key="gallery"
              className="flex overflow-x-auto snap-x snap-mandatory gap-12 px-[10vw] md:px-[35vw] pb-20 pt-10 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
            >
            {/* 普通の状態のgallery */}
            {/* 横スクロール */}
              {memories.map((memory) => (
                <motion.div
                  key={memory.id}
                  layoutId={`memory-${memory.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: memory.id * 0.1 }}
                  className="snap-center shrink-0"
                >
                  <div className="w-[280px] md:w-[320px] group" onClick={() => setSelectedId(memory.id)}>
                    {/* カード本体 */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-sm p-3 pb-8 shadow-2xl transition-all duration-500 group-hover:border-zinc-600 group-hover:-translate-y-2">
                      
                      {/* 写真部分 */}
                      <div className="aspect-square bg-zinc-800 rounded-sm mb-6 overflow-hidden relative border border-zinc-950">
                        {/* ここに実際の画像が入る */}
                        <div className="absolute inset-0 flex items-center justify-center flex-col gap-2 text-zinc-600">
                          <motion.div
                            animate={{ opacity: [0.4, 0.7, 0.4] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                          >
                            <Lock size={32} />
                          </motion.div>
                        </div>
                      </div>

                      {/* カード下部のテキスト */}
                      <div className="px-1">
                        <h3 className="text-zinc-300 text-sm font-medium tracking-wide mb-2 group-hover:text-zinc-100 transition-colors">
                          {memory.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-zinc-600">
                            <Calendar size={12} />
                            <span className="text-[10px] font-mono">{memory.date}</span>
                          </div>
                          <span className="text-[10px] font-mono text-zinc-700">#{memory.id.toString().padStart(3, '0')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="detail"
              className="flex items-center justify-center w-full h-full p-10 gap-10"
            >
            {/* 左側：選択した写真 */}
            <div className="flex-1 flex justify-end">
              <motion.div
                layoutId={`memory-${selectedId}`}
                className="w-[300px] md:w-[400px] aspect-square bg-zinc-800 rounded-lg overflow-hidden shadow-2xl"
              >
                {/* 選択した写真の表示 (まだ)*/}
              </motion.div>
            </div>

            {/* 右側：日記の内容（まだ） */}
              <div className="flex-1 flex flex-col justify-center items-start">
                <div className="text-emerald-500 font-mono text-lg">
                  <p>{">"} DECRYPTING...</p>
                  <p className="animate-pulse">{">"} _</p>
                </div>
                
                <button onClick={() => setSelectedId(null)} className="mt-8 text-zinc-500 hover:text-zinc-300 text-sm underline">
                  [ Back ]
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}