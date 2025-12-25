
import React, { Suspense } from 'react';
import Experience from './components/Experience';
import HandTracker from './components/HandTracker';
import { useGestureStore } from './store/useGestureStore';
import { TreeState } from './types';

const App: React.FC = () => {
  const { treeState, handData, hasCamera, cameraError, toggleTreeState } = useGestureStore();

  return (
    <div 
      className={`relative w-full h-screen overflow-hidden bg-[#01120a] ${!hasCamera ? 'cursor-pointer' : ''}`}
      onClick={() => {
        if (!hasCamera) toggleTreeState();
      }}
    >
      {/* 3D 画布 */}
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center bg-[#01120a] z-50">
          <div className="text-[#D4AF37] text-3xl font-serif animate-pulse italic">正在筹备这场盛宴...</div>
        </div>
      }>
        <Experience />
      </Suspense>

      {/* UI 叠加层 */}
      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-8 md:p-12">
        <header className="text-center">
          <h1 className="text-[#D4AF37] text-5xl md:text-8xl font-bold tracking-tighter drop-shadow-[0_5px_15px_rgba(212,175,55,0.4)] transition-all">
            至臻奢华
          </h1>
          <p className="text-[#D4AF37]/80 text-xl md:text-2xl mt-2 tracking-[0.3em] font-serif italic">
            圣诞感官体验
          </p>
        </header>

        {/* 摄像头错误 / 备选横幅 */}
        {!hasCamera && (
          <div className="absolute top-32 px-6 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 backdrop-blur-md rounded-full">
            <p className="text-[#D4AF37] text-sm tracking-widest uppercase font-serif animate-pulse">
              未检测到摄像头 • 点击任意处释放混沌
            </p>
          </div>
        )}

        {/* 手势状态指示器 / 控制面板 */}
        <div className="bg-[#043927]/60 backdrop-blur-xl border border-[#D4AF37]/30 p-6 md:p-8 rounded-3xl flex flex-col items-center shadow-2xl ring-1 ring-[#D4AF37]/20">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-3 h-3 rounded-full ${handData.confidence > 0.5 ? 'bg-green-400 shadow-[0_0_10px_#4ade80]' : (hasCamera ? 'bg-red-400 animate-pulse' : 'bg-amber-400')}`}></div>
            <span className="text-[#D4AF37] text-xs uppercase tracking-widest font-bold">
              {hasCamera ? (handData.confidence > 0.5 ? '追踪中' : '正在搜寻手部...') : '手动控制模式'}
            </span>
          </div>
          
          <div className="text-[#D4AF37] text-2xl md:text-3xl font-serif italic mb-2">
            当前状态: <span className="font-bold uppercase tracking-tight">{treeState === TreeState.CHAOS ? '混沌已释放' : '秩序已归位'}</span>
          </div>

          <div className="h-[1px] w-full bg-[#D4AF37]/20 my-4"></div>

          <p className="text-[#D4AF37]/60 text-[10px] md:text-xs text-center uppercase tracking-[0.2em] leading-relaxed max-w-xs">
            {hasCamera 
              ? "张开手掌使碎片散落。握紧拳头使树木归位。移动手部可调整视觉角度。"
              : "点击屏幕背景，在圣诞树形态与混沌本质之间自由切换。"
            }
          </p>
        </div>
      </div>

      {/* 隐藏的手势追踪组件 */}
      <HandTracker />
      
      {/* 装饰性电影边框 */}
      <div className="absolute inset-0 border-[15px] md:border-[30px] border-[#D4AF37]/5 pointer-events-none z-10" />
      <div className="absolute inset-0 border-[1px] border-[#D4AF37]/20 pointer-events-none z-10 m-4 md:m-8" />
    </div>
  );
};

export default App;
