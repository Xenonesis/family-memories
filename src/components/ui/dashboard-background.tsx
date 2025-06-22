'use client';

import React, { useRef, useId, useEffect, CSSProperties } from 'react';
import { animate, useMotionValue, AnimationPlaybackControls } from 'framer-motion';

// Type definitions
interface AnimationConfig {
    preview?: boolean;
    scale: number;
    speed: number;
}

interface NoiseConfig {
    opacity: number;
    scale: number;
}

interface BackgroundProps {
    sizing?: 'fill' | 'stretch';
    color?: string;
    darkModeColor?: string;
    animation?: AnimationConfig;
    noise?: NoiseConfig;
    className?: string;
}

function mapRange(
    value: number,
    fromLow: number,
    fromHigh: number,
    toLow: number,
    toHigh: number
): number {
    if (fromLow === fromHigh) {
        return toLow;
    }
    const percentage = (value - fromLow) / (fromHigh - fromLow);
    return toLow + percentage * (toHigh - toLow);
}

const useInstanceId = (): string => {
    const id = useId();
    const cleanId = id.replace(/:/g, "");
    const instanceId = `background-${cleanId}`;
    return instanceId;
};

export function DashboardBackground({
    sizing = 'fill',
    color = 'rgba(128, 128, 128, 1)',
    darkModeColor = 'rgba(50, 50, 50, 1)',
    animation,
    noise,
    className
}: BackgroundProps) {
    const id = useInstanceId();
    const animationEnabled = animation && animation.scale > 0;
    const feColorMatrixRef = useRef<SVGFEColorMatrixElement>(null);
    const hueRotateMotionValue = useMotionValue(180);
    const hueRotateAnimation = useRef<AnimationPlaybackControls | null>(null);

    const displacementScale = animation ? mapRange(animation.scale, 1, 100, 20, 100) : 0;
    const animationDuration = animation ? mapRange(animation.speed, 1, 100, 1000, 50) : 1;

    useEffect(() => {
        if (feColorMatrixRef.current && animationEnabled) {
            if (hueRotateAnimation.current) {
                hueRotateAnimation.current.stop();
            }
            hueRotateMotionValue.set(0);
            hueRotateAnimation.current = animate(hueRotateMotionValue, 360, {
                duration: animationDuration / 25,
                repeat: Infinity,
                repeatType: "loop",
                repeatDelay: 0,
                ease: "linear",
                delay: 0,
                onUpdate: (value: number) => {
                    if (feColorMatrixRef.current) {
                        feColorMatrixRef.current.setAttribute("values", String(value));
                    }
                }
            });

            return () => {
                if (hueRotateAnimation.current) {
                    hueRotateAnimation.current.stop();
                }
            };
        }
    }, [animationEnabled, animationDuration, hueRotateMotionValue]);

    return (
        <div
            className={`overflow-hidden relative w-full h-full ${className || ''}`}
        >
            <div
                className={`absolute inset-[-${displacementScale}px]`}
                style={{
                    filter: animationEnabled ? `url(#${id}) blur(4px)` : "none"
                }}
            >
                {animationEnabled && (
                    <svg className="absolute">
                        <defs>
                            <filter id={id}>
                                <feTurbulence
                                    result="undulation"
                                    numOctaves="2"
                                    baseFrequency={`${mapRange(animation.scale, 0, 100, 0.001, 0.0005)},${mapRange(animation.scale, 0, 100, 0.004, 0.002)}`}
                                    seed="0"
                                    type="turbulence"
                                />
                                <feColorMatrix
                                    ref={feColorMatrixRef}
                                    in="undulation"
                                    type="hueRotate"
                                    values="180"
                                />
                                <feColorMatrix
                                    in="dist"
                                    result="circulation"
                                    type="matrix"
                                    values="4 0 0 0 1  4 0 0 0 1  4 0 0 0 1  1 0 0 0 0"
                                />
                                <feDisplacementMap
                                    in="SourceGraphic"
                                    in2="circulation"
                                    scale={displacementScale}
                                    result="dist"
                                />
                                <feDisplacementMap
                                    in="dist"
                                    in2="undulation"
                                    scale={displacementScale}
                                    result="output"
                                />
                            </filter>
                        </defs>
                    </svg>
                )}
                <div
                    className="dark:bg-[color:var(--dark-bg-color)] bg-[color:var(--bg-color)] w-full h-full"
                    style={{
                        '--bg-color': color,
                        '--dark-bg-color': darkModeColor,
                        maskImage: `url('https://images.unsplash.com/photo-1553481187-be93c21490a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`,
                        maskSize: sizing === "stretch" ? "100% 100%" : "cover",
                        maskRepeat: "no-repeat",
                        maskPosition: "center"
                    } as CSSProperties}
                />
            </div>

            {noise && noise.opacity > 0 && (
                <div
                    className={`absolute inset-0 bg-repeat opacity-[${noise.opacity/2}]`}
                    style={{
                        backgroundImage: `url("https://images.unsplash.com/photo-1570194065650-437a05a4b7c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")`,
                        backgroundSize: noise.scale * 200
                    }}
                />
            )}
        </div>
    );
}
