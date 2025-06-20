"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function FloatingPaths({ position }: { position: number }) {
    const paths = Array.from({ length: 36 }, (_, i) => ({
        id: i,
        d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
            380 - i * 5 * position
        } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
            152 - i * 5 * position
        } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
            684 - i * 5 * position
        } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
        color: `rgba(15,23,42,${0.1 + i * 0.03})`,
        width: 0.5 + i * 0.03,
    }));

    return (
        <div className="absolute inset-0 pointer-events-none">
            <svg
                className="w-full h-full text-foreground/20"
                viewBox="0 0 696 316"
                fill="none"
            >
                <title>Background Paths</title>
                {paths.map((path) => (
                    <motion.path
                        key={path.id}
                        d={path.d}
                        stroke="currentColor"
                        strokeWidth={path.width}
                        strokeOpacity={0.1 + path.id * 0.03}
                        initial={{ pathLength: 0.3, opacity: 0.6 }}
                        animate={{
                            pathLength: 1,
                            opacity: [0.3, 0.6, 0.3],
                            pathOffset: [0, 1, 0],
                        }}
                        transition={{
                            duration: 20 + Math.random() * 10,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                        }}
                    />
                ))}
            </svg>
        </div>
    );
}

export function BackgroundPaths({
    title = "Background Paths",
}: {
    title?: string;
}) {
    const words = title.split(" ");

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background pt-14">
            <div className="absolute inset-0">
                <FloatingPaths position={1} />
                <FloatingPaths position={-1} />
            </div>

            <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2 }}
                    className="max-w-4xl mx-auto"
                >
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 sm:mb-8 tracking-tighter leading-tight">
                        {words.map((word, wordIndex) => (
                            <span
                                key={wordIndex}
                                className="inline-block mr-4 last:mr-0"
                            >
                                {word.split("").map((letter, letterIndex) => (
                                    <motion.span
                                        key={`${wordIndex}-${letterIndex}`}
                                        initial={{ y: 100, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{
                                            delay:
                                                wordIndex * 0.1 +
                                                letterIndex * 0.03,
                                            type: "spring",
                                            stiffness: 150,
                                            damping: 25,
                                        }}
                                        className="inline-block text-transparent bg-clip-text 
                                        bg-gradient-to-r from-foreground to-foreground/80"
                                    >
                                        {letter}
                                    </motion.span>
                                ))}
                            </span>
                        ))}
                    </h1>

                    <div className="flex flex-col sm:flex-row gap-4 mt-4 sm:mt-6">
                        <div
                            className="inline-block group relative bg-gradient-to-b from-border/50 to-border/20 
                            p-px rounded-2xl backdrop-blur-lg overflow-hidden shadow-lg hover:shadow-xl 
                            transition-shadow duration-300"
                        >
                            <Button
                                variant="ghost"
                                className="rounded-[1.15rem] px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-semibold backdrop-blur-md 
                                bg-background/95 hover:bg-background/100 border border-border
                                transition-all duration-300 group-hover:-translate-y-0.5 hover:shadow-md"
                            >
                                <span className="opacity-90 group-hover:opacity-100 transition-opacity">
                                    Discover Excellence
                                </span>
                                <span
                                    className="ml-2 sm:ml-3 opacity-70 group-hover:opacity-100 group-hover:translate-x-1.5 
                                    transition-all duration-300"
                                >
                                    →
                                </span>
                            </Button>
                        </div>
                        
                        <div
                            className="inline-block group relative bg-gradient-to-b from-primary/50 to-primary/20 
                            p-px rounded-2xl backdrop-blur-lg overflow-hidden shadow-lg hover:shadow-xl 
                            transition-shadow duration-300"
                        >
                            <Link href="/hero-3d">
                                <Button
                                    variant="ghost"
                                    className="rounded-[1.15rem] px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-semibold backdrop-blur-md 
                                    bg-primary/10 hover:bg-primary/20 border border-primary/30
                                    transition-all duration-300 group-hover:-translate-y-0.5 hover:shadow-md text-primary"
                                >
                                    <span className="opacity-90 group-hover:opacity-100 transition-opacity">
                                        3D Experience
                                    </span>
                                    <span
                                        className="ml-2 sm:ml-3 opacity-70 group-hover:opacity-100 group-hover:translate-x-1.5 
                                        transition-all duration-300"
                                    >
                                        ✨
                                    </span>
                                </Button>
                            </Link>
                        </div>
                        
                        <div
                            className="inline-block group relative bg-gradient-to-b from-purple-500/50 to-blue-500/20 
                            p-px rounded-2xl backdrop-blur-lg overflow-hidden shadow-lg hover:shadow-xl 
                            transition-shadow duration-300"
                        >
                            <Link href="/timeline">
                                <Button
                                    variant="ghost"
                                    className="rounded-[1.15rem] px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-semibold backdrop-blur-md 
                                    bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30
                                    transition-all duration-300 group-hover:-translate-y-0.5 hover:shadow-md text-purple-400"
                                >
                                    <span className="opacity-90 group-hover:opacity-100 transition-opacity">
                                        Family Timeline
                                    </span>
                                    <span
                                        className="ml-2 sm:ml-3 opacity-70 group-hover:opacity-100 group-hover:translate-x-1.5 
                                        transition-all duration-300"
                                    >
                                        ⭕
                                    </span>
                                </Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
