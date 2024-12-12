import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface WheelProps {
    prizes: string[];
    probabilities: number[];
    onSpin: (prize: string) => void;
}

export function Wheel({ prizes, probabilities, onSpin }: WheelProps) {
    const [rotation, setRotation] = useState(0);
    const [isSpinning, setIsSpinning] = useState(false);

    // Add console logging
    console.log('Wheel rendering with prizes:', prizes);
    console.log('Probabilities:', probabilities);

    const spinWheel = () => {
        if (isSpinning) return;
        setIsSpinning(true);
        
        const random = Math.random() * 100;
        let cumulativeProbability = 0;
        let winningIndex = 0;
        
        for (let i = 0; i < probabilities.length; i++) {
            cumulativeProbability += probabilities[i] || 0;
            if (random <= cumulativeProbability) {
                winningIndex = i;
                break;
            }
        }
        
        const extraSpins = 5; // Number of full rotations
        const baseRotation = 360 * extraSpins;
        const sectionAngle = 360 / prizes.length;
        const targetRotation = baseRotation + (360 - (winningIndex * sectionAngle));
        
        setRotation(prevRotation => prevRotation + targetRotation);
        
        setTimeout(() => {
            setIsSpinning(false);
            onSpin(prizes[winningIndex]);
        }, 5000);
    };

    return (
        <div className="relative w-[300px] h-[300px]">
            <motion.div
                className="absolute w-full h-full"
                style={{
                    transform: `rotate(${rotation}deg)`,
                    transformOrigin: 'center center',
                }}
                animate={{ rotate: rotation }}
                transition={{ duration: 5, type: "spring", bounce: 0.25 }}
            >
                {prizes.map((prize, index) => {
                    const angle = (360 / prizes.length) * index;
                    const rotate = `rotate(${angle}deg)`;
                    return (
                        <div
                            key={index}
                            className="absolute w-full h-full"
                            style={{
                                transform: rotate,
                                transformOrigin: 'center center',
                            }}
                        >
                            <div
                                className="absolute w-1/2 h-1/2 right-1/2 bottom-1/2 origin-bottom-right"
                                style={{
                                    transform: 'rotate(45deg) skew(15deg, 15deg)',
                                    background: `hsl(${(360 / prizes.length) * index}, 70%, 50%)`,
                                }}
                            >
                                <span
                                    className="absolute left-1/2 bottom-[40%] -translate-x-1/2 text-white text-sm font-bold whitespace-nowrap"
                                    style={{
                                        transform: `rotate(${-angle - 45}deg)`,
                                    }}
                                >
                                    {prize}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </motion.div>
            <div className="absolute inset-0 flex items-center justify-center">
                <button
                    onClick={spinWheel}
                    disabled={isSpinning}
                    className="z-10 w-16 h-16 rounded-full bg-red-600 text-white font-bold shadow-lg hover:bg-red-700 disabled:bg-red-400 flex items-center justify-center"
                >
                    SPIN
                </button>
            </div>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                <div className="w-4 h-8 bg-red-600 transform rotate-180" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
            </div>
        </div>
    );
}

