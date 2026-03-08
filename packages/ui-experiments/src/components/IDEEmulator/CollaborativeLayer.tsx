import React from 'react';
import { motion } from 'framer-motion';

// --- Types ---
interface CursorData {
    id: string;
    name: string;
    color: string;
    pathX: number[];
    pathY: number[];
    times: number[];
}

// Pre-defined complex paths for human-like movement
const CURSORS: CursorData[] = [
    {
        id: 'santy-layer',
        name: 'Santy',
        color: '#3b82f6', // blue-500
        pathX: [100, 250, 250, 450, 400, 100],
        pathY: [50, 120, 120, 200, 80, 50],
        times: [0, 0.2, 0.5, 0.7, 0.9, 1] // Pauses at index 1->2
    },
    {
        id: 'dev02-layer',
        name: 'Dev_02',
        color: '#ec4899', // pink-500
        pathX: [500, 300, 150, 150, 450, 500],
        pathY: [250, 300, 150, 150, 350, 250],
        times: [0, 0.3, 0.5, 0.8, 0.95, 1] // Pauses at index 2->3
    }
];

// Reusable SVG Cursor shape
const CursorIcon = ({ color }: { color: string }) => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill={color} stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-md">
        <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
    </svg>
);

export const CollaborativeLayer = ({ pause = false }: { pause?: boolean }) => {
    return (
        <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden font-mono text-sm">

            {/* Render Remote Cursors with predefined Paths */}
            {CURSORS.map((cursor) => (
                <motion.div
                    key={cursor.id}
                    className="absolute flex flex-col items-start"
                    initial={{ x: cursor.pathX[0], y: cursor.pathY[0] }}
                    animate={pause ? {} : {
                        x: cursor.pathX,
                        y: cursor.pathY,
                    }}
                    transition={{
                        duration: 8,          // Total cycle time
                        repeat: Infinity,     // Loop forever
                        ease: "easeInOut",    // Smooth transitions
                        times: cursor.times   // Control pacing and pauses
                    }}
                >
                    <CursorIcon color={cursor.color} />
                    <div
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-lg ml-3 mt-1 whitespace-nowrap"
                        style={{ backgroundColor: cursor.color }}
                    >
                        {cursor.name}
                    </div>
                </motion.div>
            ))}

        </div>
    );
};
