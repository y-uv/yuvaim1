'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Confetti from 'react-confetti';
import { Button } from "@/components/ui/button";

type Target = {
  x: number;
  y: number;
};

const QuickAimGame = () => {
  const [targets, setTargets] = useState<Target[]>([]);
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'finished'>('waiting');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [targetCount, setTargetCount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const generateTarget = useCallback(() => {
    const x = Math.random() * 360;
    const y = Math.random() * 360;
    return { x, y };
  }, []);

  const startGame = useCallback(() => {
    setGameState('playing');
    setStartTime(Date.now());
    setTargetCount(1);
    setTargets([generateTarget()]);
    setElapsedTime(0);
    setShowConfetti(false);
  }, [generateTarget]);

  const handleTargetClick = useCallback(() => {
    if (gameState === 'waiting') {
      startGame();
    } else if (gameState === 'playing') {
      if (targetCount === 9) {
        const endTimeNow = Date.now();
        setGameState('finished');
        setTargets([]);
        setElapsedTime((endTimeNow - (startTime || 0)) / 1000);
        setShowConfetti(true); // Trigger confetti when game finishes
      } else {
        setTargets([generateTarget()]);
        setTargetCount(prev => prev + 1);
      }
    }
  }, [gameState, targetCount, generateTarget, startGame, startTime]);

  const resetGame = useCallback(() => {
    setGameState('waiting');
    setTargets([generateTarget()]);
    setStartTime(null);
    setTargetCount(0);
    setElapsedTime(0);
    setShowConfetti(false);
  }, [generateTarget]);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (gameState === 'playing') {
      intervalId = setInterval(() => {
        setElapsedTime((Date.now() - (startTime || 0)) / 1000);
      }, 10); // Update every 10ms for smooth display
    }
    return () => clearInterval(intervalId);
  }, [gameState, startTime]);

  const formatTime = (time: number) => time.toFixed(2);

  return (
    <div className="flex flex-col cursor-crosshair items-center justify-center min-h-screen bg-gray-100 p-4">
      <style jsx global>{`
        .game-area {
          cursor: crosshair;
        }
      `}</style>
      <h1 className="text-2xl font-bold mb-4 text-black">target10</h1>
      <div className="mb-4 h-8">
        {gameState === 'waiting' && <p className="text-lg text-black">click the target to start</p>}
        {gameState === 'playing' && (
          <p className="text-lg text-black">
            hits: {targetCount}/10 | time: {formatTime(elapsedTime)}s
          </p>
        )}
        {gameState === 'finished' && (
          <p className="text-lg text-black">
            final time: {formatTime(elapsedTime)} seconds
          </p>
        )}
      </div>
      <div className="relative w-[400px] h-[400px] border-4 border-black border-dotted mb-6 game-area">
        <div className="absolute inset-0">
          {targets.map((target, index) => (
            <div
              key={index}
              className="w-10 h-10 absolute cursor-crosshair"
              style={{ left: `${target.x}px`, top: `${target.y}px` }}
              onClick={handleTargetClick}
            >
              <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="19" fill="white" stroke="black" strokeWidth="2"/>
                <circle cx="20" cy="20" r="15" fill="red" stroke="black" strokeWidth="2"/>
                <circle cx="20" cy="20" r="10" fill="white" stroke="black" strokeWidth="2"/>
                <circle cx="20" cy="20" r="5" fill="red" stroke="black" strokeWidth="2"/>
              </svg>
            </div>
          ))}
        </div>
      </div>
      <div className="h-10"> {/* Fixed height container for the button */}
        {gameState === 'finished' && (
          <Button onClick={resetGame} className="bg-neutral-500 hover:bg-neutral-700">
            run it back
          </Button>
        )}
      </div>
      {showConfetti && <Confetti width={innerWidth} height={innerHeight} numberOfPieces={200} recycle={false} tweenDuration={20000}/>}
    </div>
  );
};

export default QuickAimGame;
