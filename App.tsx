import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Terminal, Typewriter } from './components/Terminal';
import { Table } from './components/Table';
import { LEVELS } from './services/gameData';
import { getNarrativeFeedback, analyzeEnding } from './services/geminiService';
import { Level, GameState, Citizen } from './types';
import { Terminal as TerminalIcon, Play, RefreshCw, Delete, Send, AlertTriangle } from 'lucide-react';

export default function App() {
  const [levelIndex, setLevelIndex] = useState(0);
  const [gameState, setGameState] = useState<GameState>('BOOT');
  const [queryTokens, setQueryTokens] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [endingNarrative, setEndingNarrative] = useState<string>('');
  const [endingType, setEndingType] = useState<string>('');

  const bottomRef = useRef<HTMLDivElement>(null);

  const currentLevel = LEVELS[levelIndex];

  // Randomize tokens when level changes
  const shuffledTokens = useMemo(() => {
    // Fisher-Yates shuffle
    const array = [...currentLevel.tokens];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }, [currentLevel.id]);

  // Sounds (Mock)
  const playSound = (type: 'click' | 'error' | 'success') => {
    // In a real app, use Audio API. 
  };

  useEffect(() => {
    if (gameState === 'BOOT') {
      setTimeout(() => setGameState('BRIEFING'), 2500);
    }
  }, [gameState]);

  // Auto-scroll to bottom of query buffer when adding tokens
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollTop = bottomRef.current.scrollHeight;
    }
  }, [queryTokens]);

  const handleAddToken = (token: string) => {
    playSound('click');
    setQueryTokens(prev => [...prev, token]);
  };

  const handleRemoveLastToken = () => {
    playSound('click');
    setQueryTokens(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    playSound('click');
    setQueryTokens([]);
  };

  // SQL Logic Simulation
  const evaluateQuery = async () => {
    if (queryTokens.length === 0) return;
    setLoading(true);

    const queryString = queryTokens.join(' ');

    // CRITICAL LEVEL LOGIC (Gemini Driven)
    if (currentLevel.isCritical) {
      const result = await analyzeEnding(queryString);
      setEndingType(result.type);
      setEndingNarrative(result.narrative);
      setGameState('ENDING');
      setLoading(false);
      return;
    }

    // STANDARD LEVEL LOGIC (Regex Driven)
    let isSuccess = false;

    if (currentLevel.validPattern) {
      // Create a regex from the pattern, case insensitive
      const regex = new RegExp(currentLevel.validPattern, 'i');
      if (regex.test(queryString)) {
        isSuccess = true;
      }
    } else {
      // Fallback for extremely simple "Contains all tokens" logic if no regex provided
      const allRequiredPresent = currentLevel.expectedResultIds.length > 0; // Naive fallback
      if (allRequiredPresent) isSuccess = true;
    }

    // Generate narrative
    const text = await getNarrativeFeedback(currentLevel, queryString, isSuccess);
    setFeedback(text);

    if (isSuccess) {
      playSound('success');
      setGameState('SUCCESS');
    } else {
      playSound('error');
      setGameState('FAILURE');
    }
    setLoading(false);
  };

  const nextLevel = () => {
    setQueryTokens([]);
    setFeedback('');
    if (levelIndex < LEVELS.length - 1) {
      setLevelIndex(prev => prev + 1);
      setGameState('BRIEFING');
    } else {
      setGameState('ENDING');
    }
  };

  const retry = () => {
    setFeedback('');
    setGameState('PLAYING');
  };

  // RENDERERS

  if (gameState === 'BOOT') {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center relative overflow-hidden">
        <div className="scanlines"></div>
        <div className="crt-overlay"></div>
        <div className="text-center p-4">
          <h1 className="text-6xl font-mono text-crt-green font-bold mb-4 animate-pulse">选择 (SELECT)</h1>
          <p className="text-crt-green-dim text-xl font-mono animate-flicker">真理部数据库 (MINISTRY DATABASE)</p>
          <p className="text-crt-green-dim mt-8 text-sm">正在初始化...</p>
        </div>
      </div>
    );
  }

  if (gameState === 'ENDING') {
    return (
      <div className="w-full h-screen bg-black p-4 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="scanlines"></div>
        <div className="crt-overlay"></div>
        <div className="w-full max-w-lg text-center space-y-8 z-10">
          <h1 className={`text-4xl font-mono font-bold ${endingType === 'REBELLION' ? 'text-red-500' : 'text-crt-green'} animate-pulse`}>
            {endingType === 'REBELLION' ? '严重错误 (CRITICAL FAILURE)' : '验证合规 (COMPLIANCE VERIFIED)'}
          </h1>
          <div className="border border-crt-green p-4 bg-black/80 shadow-[0_0_30px_rgba(51,255,51,0.2)] max-h-[60vh] overflow-y-auto">
            <p className="text-lg font-mono text-crt-green leading-relaxed whitespace-pre-wrap text-left">
              <Typewriter text={endingNarrative} speed={30} />
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 border border-crt-green hover:bg-crt-green hover:text-black font-mono transition-all w-full"
          >
            终止会话 (TERMINATE SESSION)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-crt-black flex flex-col relative overflow-hidden font-mono text-crt-green">
      {/* Global CRT Effects */}
      <div className="scanlines"></div>
      <div className="crt-overlay"></div>

      {/* Header */}
      <header className="flex-none flex justify-between items-center p-2 border-b border-crt-green-dim z-10 bg-crt-black/90 backdrop-blur">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4" />
          <span className="font-bold tracking-widest text-sm">真理部数据库</span>
        </div>
        <div className="text-[10px] md:text-xs text-crt-green-dim flex gap-2 md:gap-4">
          <span>等级 {currentLevel.id}</span>
          <span>分析员_742</span>
        </div>
      </header>

      {/* Main Workspace - Scrollable Top Section */}
      <main className="flex-1 overflow-y-auto z-10 scrollbar-hide">
        <div className="p-4 space-y-4 max-w-3xl mx-auto pb-32"> {/* pb-32 to account for fixed bottom */}

          <Terminal className="min-h-[200px]">
            {/* Always show Briefing/Title */}
            <div className="space-y-4 animate-flicker mb-6">
              <h2 className="text-xl font-bold border-b border-crt-green-dim pb-2">{currentLevel.title}</h2>
              <p className="text-crt-green/90 text-lg leading-relaxed"><Typewriter text={currentLevel.briefing} speed={10} /></p>

              {currentLevel.guide && (
                <div className="mt-4 p-3 border-l-2 border-crt-green-dim bg-crt-green/5 text-crt-green-dim text-sm font-mono whitespace-pre-wrap">
                  {currentLevel.guide}
                </div>
              )}

              {gameState === 'BRIEFING' && (
                <button
                  onClick={() => setGameState('PLAYING')}
                  className="mt-6 w-full py-3 border border-crt-green text-crt-green hover:bg-crt-green hover:text-black transition-colors font-bold"
                >
                  确认指令 (ACKNOWLEDGE)
                </button>
              )}
            </div>

            {(gameState === 'PLAYING' || gameState === 'SUCCESS' || gameState === 'FAILURE') && (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-crt-green-dim pb-1">
                  <span className="text-sm text-crt-green-dim">目标数据 (TARGET DATA)</span>
                  <span className="text-xs text-crt-green-dim animate-pulse">实时传输 (LIVE FEED)</span>
                </div>

                {/* Primary Table */}
                <Table
                  data={currentLevel.data}
                  highlightIds={gameState === 'SUCCESS' ? currentLevel.expectedResultIds : []}
                />

                {/* Secondary Table (For Joins) */}
                {currentLevel.secondaryData && (
                  <>
                    <div className="flex justify-between items-center border-b border-crt-green-dim pb-1 mt-4">
                      <span className="text-sm text-crt-green-dim">参考数据 (REFERENCE DATA)</span>
                    </div>
                    {/* @ts-ignore - Table generic type handling shortcut */}
                    <Table data={currentLevel.secondaryData} />
                  </>
                )}

                {feedback && (
                  <div className={`mt-4 p-3 border ${gameState === 'SUCCESS' ? 'border-crt-green bg-crt-green/10' : 'border-red-500 bg-red-900/20'} rounded`}>
                    <div className="flex items-start gap-2">
                      {gameState === 'FAILURE' && <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />}
                      <p className={gameState === 'FAILURE' ? 'text-red-400' : 'text-crt-green'}>
                        <span className="font-bold">监察官: </span>
                        <Typewriter text={feedback} speed={20} />
                      </p>
                    </div>
                    {gameState === 'SUCCESS' && (
                      <button onClick={nextLevel} className="mt-2 w-full py-2 bg-crt-green/20 hover:bg-crt-green/40 text-sm font-bold border border-crt-green/50">
                        下一项任务 &gt;&gt;
                      </button>
                    )}
                    {gameState === 'FAILURE' && (
                      <button onClick={retry} className="mt-2 w-full py-2 bg-red-900/20 hover:bg-red-900/40 text-sm font-bold border border-red-500/50 text-red-400">
                        重试 &gt;&gt;
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </Terminal>
        </div>
      </main>

      {/* Bottom Controls - Fixed Sticky Footer */}
      <section className="flex-none border-t-2 border-crt-green-dim bg-crt-black shadow-[0_-5px_20px_rgba(26,128,26,0.2)] z-20">
        <div className="max-w-3xl mx-auto p-2">

          {/* Query Buffer (Compact) */}
          <div className="flex gap-2 mb-2 items-start">
            <div
              ref={bottomRef}
              className="flex-1 bg-black border border-crt-green-dim/50 h-14 p-2 font-mono text-base text-white overflow-y-auto rounded shadow-inner relative leading-tight"
            >
              <span className="text-crt-green mr-1">&gt;</span>
              {queryTokens.map((token, i) => (
                <span key={i} className="inline-block mr-1.5 text-crt-green">
                  {token}
                </span>
              ))}
              <span className="inline-block w-1.5 h-4 bg-crt-green animate-pulse align-middle ml-1"></span>
            </div>

            <div className="flex flex-col gap-1">
              <button
                onClick={handleRemoveLastToken}
                disabled={gameState !== 'PLAYING' || queryTokens.length === 0}
                className="p-2 border border-crt-green-dim/50 rounded hover:bg-red-900/30 text-crt-green disabled:opacity-30"
              >
                <Delete className="w-4 h-4" />
              </button>
              <button
                onClick={handleClear}
                disabled={gameState !== 'PLAYING' || queryTokens.length === 0}
                className="p-2 border border-crt-green-dim/50 rounded hover:bg-crt-green/20 text-crt-green disabled:opacity-30"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Token Tray (Wrap for mobile) */}
          <div className="flex flex-wrap gap-2 justify-center mb-2">
            {shuffledTokens.map((token, i) => (
              <button
                key={`${currentLevel.id}-${i}`} // Force re-render on level change
                onClick={() => handleAddToken(token)}
                disabled={gameState !== 'PLAYING'}
                className={`
                  px-3 py-2 border border-crt-green-dim rounded 
                  text-sm font-bold text-crt-green hover:bg-crt-green hover:text-black 
                  active:scale-95 transition-all
                  disabled:opacity-30 disabled:cursor-not-allowed
                  ${['SELECT', 'FROM', 'WHERE', 'DELETE', 'AND', 'OR', 'NOT', 'JOIN', 'ON', 'GROUP', 'BY', 'SUM', 'COUNT', 'DISTINCT'].some(k => token.includes(k)) ? 'border-crt-green/60 bg-crt-green/5' : 'bg-black'}
                `}
              >
                {token}
              </button>
            ))}
          </div>

          {/* Execute Button */}
          <button
            onClick={evaluateQuery}
            disabled={gameState !== 'PLAYING' || loading || queryTokens.length === 0}
            className={`
              w-full py-3 flex items-center justify-center gap-2
              font-bold text-lg uppercase tracking-widest border-2
              transition-all duration-200
              ${loading
                ? 'border-crt-green-dim text-crt-green-dim cursor-wait'
                : 'border-crt-green bg-crt-green/10 text-crt-green hover:bg-crt-green hover:text-black'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {loading ? (
              <>处理中 <RefreshCw className="w-5 h-5 animate-spin" /></>
            ) : (
              <>执行指令 <Play className="w-5 h-5 fill-current" /></>
            )}
          </button>
        </div>
      </section>
    </div>
  );
}