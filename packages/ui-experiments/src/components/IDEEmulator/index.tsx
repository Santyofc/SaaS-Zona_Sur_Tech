"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    ChevronRight,
    ChevronDown,
    FileCode2,
    FileJson,
    FileText,
    Users,
    GitBranch,
    LayoutDashboard,
    RotateCcw,
    CheckCircle2
} from 'lucide-react';
import { CollaborativeLayer } from './CollaborativeLayer';

// --- Types & Data ---

type FileType = 'ts' | 'tsx' | 'json' | 'css' | 'md' | 'folder';

interface FileNode {
    name: string;
    type: FileType;
    children?: FileNode[];
    isOpen?: boolean;
}

const FILE_SYSTEM: FileNode[] = [
    {
        name: 'src',
        type: 'folder',
        isOpen: true,
        children: [
            {
                name: 'components',
                type: 'folder',
                isOpen: true,
                children: [
                    { name: 'IDEEmulator.tsx', type: 'tsx' },
                    { name: 'Button.tsx', type: 'tsx' },
                ]
            },
            {
                name: 'api',
                type: 'folder',
                isOpen: false,
                children: [
                    { name: 'sync.ts', type: 'ts' },
                    { name: 'auth.ts', type: 'ts' }
                ]
            },
            { name: 'main.ts', type: 'ts' },
            { name: 'globals.css', type: 'css' }
        ]
    },
    { name: 'package.json', type: 'json' },
    { name: 'README.md', type: 'md' }
];

interface Collaborator {
    id: string;
    name: string;
    color: string;
    avatarUrl: string;
    status: 'active' | 'idle';
}

const COLLABORATORS: Collaborator[] = [
    { id: '1', name: 'Santy', color: '#3b82f6', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Santy&backgroundColor=b6e3f4', status: 'active' },
    { id: '2', name: 'Elena', color: '#ec4899', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena&backgroundColor=ffdfbf', status: 'active' },
    { id: '3', name: 'Dev_03', color: '#10b981', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dev&backgroundColor=c0aede', status: 'idle' },
];

// --- Helper Components ---

const FileIcon = ({ type, isOpen }: { type: FileType, isOpen?: boolean }) => {
    switch (type) {
        case 'folder': return isOpen ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />;
        case 'ts': return <FileCode2 size={14} className="text-blue-400" />;
        case 'tsx': return <FileCode2 size={14} className="text-blue-500" />;
        case 'json': return <FileJson size={14} className="text-yellow-400" />;
        case 'css': return <FileCode2 size={14} className="text-sky-400" />;
        case 'md': return <FileText size={14} className="text-slate-400" />;
        default: return <FileCode2 size={14} className="text-slate-400" />;
    }
};

const FileTree = ({ nodes, level = 0, activeFile, onSelect }: { nodes: FileNode[], level?: number, activeFile: string, onSelect: (name: string) => void }) => {
    return (
        <div className="flex flex-col">
            {nodes.map((node, i) => (
                <div key={`${node.name}-${i}`}>
                    <div
                        className={`flex items-center gap-1.5 px-2 py-1 cursor-pointer hover:bg-slate-800/50 transition-colors ${activeFile === node.name ? 'bg-slate-800/80 text-white' : 'text-slate-400'}`}
                        style={{ paddingLeft: `${(level * 12) + 8}px` }}
                        onClick={() => node.type !== 'folder' && onSelect(node.name)}
                    >
                        <FileIcon type={node.type} isOpen={node.isOpen} />
                        <span className="text-sm truncate">{node.name}</span>
                    </div>
                    {node.type === 'folder' && node.isOpen && node.children && (
                        <FileTree nodes={node.children} level={level + 1} activeFile={activeFile} onSelect={onSelect} />
                    )}
                </div>
            ))}
        </div>
    );
};

// --- Main Component ---

interface IDEEmulatorProps {
    code?: string;
    activeLines?: { [key: string]: number[] };
}

export default function IDEEmulator({ code, activeLines: externalActiveLines }: IDEEmulatorProps) {
    const [activeTab, setActiveTab] = useState('IDEEmulator.tsx');
    const [isVisible, setIsVisible] = useState(true);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const codeLines = (code || "").split('\n');

    useEffect(() => {
        setPrefersReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { threshold: 0.1 }
        );

        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    // Safe access to active lines for each collaborator
    const activeSanty = externalActiveLines?.Santy || [];
    const activeElena = externalActiveLines?.Elena || [];

    // Auto-scroll to active line
    useEffect(() => {
        if (!scrollContainerRef.current) return;

        let targetLine = -1;
        if (activeSanty.length > 0) targetLine = activeSanty[0];
        else if (activeElena.length > 0) targetLine = activeElena[0];

        if (targetLine !== -1) {
            // Calculate scroll target based on line height (24px leading-6) and some padding offset
            const scrollTarget = (targetLine * 24) - 150;

            scrollContainerRef.current.scrollTo({
                top: Math.max(0, scrollTarget),
                behavior: 'smooth'
            });
        }
    }, [externalActiveLines]);

    return (
        <div className="flex flex-col w-full h-full min-h-[650px] max-h-[800px] bg-[#1e1e1e] rounded-xl shadow-2xl overflow-hidden border border-slate-700/50 text-slate-300 font-sans" ref={containerRef}>

            {/* Window Header (macOS) */}
            <div className="h-9 bg-[#2d2d2d] flex items-center px-4 border-b border-black/20 shrink-0">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>
                <div className="flex-1 text-center text-xs text-slate-400 font-medium select-none flex justify-center items-center gap-2">
                    <LayoutDashboard size={14} />
                    SantyWorkspace.tsx — Live Workspace
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <div className="hidden md:flex flex-col w-64 bg-[#181818] border-r border-[#2b2b2b] shrink-0">
                    <div className="flex items-center px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Ecosistema
                    </div>

                    {/* File Tree */}
                    <div className="flex-1 overflow-y-auto pt-2">
                        <FileTree nodes={FILE_SYSTEM} activeFile={activeTab} onSelect={setActiveTab} />
                    </div>

                    {/* Active Collaboration Panel */}
                    <div className="h-48 border-t border-[#2b2b2b] flex flex-col shrink-0">
                        <div className="flex items-center gap-2 px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            <Users size={14} />
                            Colaboradores Santy
                        </div>
                        <div className="flex-1 overflow-y-auto px-2 pb-2">
                            {COLLABORATORS.map(user => (
                                <div key={user.id} className="flex items-center gap-3 px-2 py-2 hover:bg-slate-800/50 rounded-md transition-colors cursor-pointer">
                                    <div className="relative shrink-0">
                                        <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden ring-2" style={{ "--tw-ring-color": user.color } as React.CSSProperties}>
                                            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#181818] ${user.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                    </div>
                                    <div className="flex flex-col truncate">
                                        <span className="text-sm font-medium text-slate-200">{user.name}</span>
                                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                            <GitBranch size={10} /> main
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e]">

                    {/* Editor Tabs */}
                    <div className="h-9 bg-[#252526] flex items-end shrink-0 overflow-x-auto overflow-y-hidden">
                        <div className="h-full px-4 flex items-center gap-2 bg-[#1e1e1e] border-t border-t-blue-500 cursor-default shrink-0">
                            <FileCode2 size={14} className="text-blue-500" />
                            <span className="text-sm text-slate-200">{activeTab}</span>
                        </div>
                        <div className="h-full px-4 flex items-center gap-2 bg-[#2d2d2d] text-slate-500 hover:bg-[#2a2a2b] cursor-pointer shrink-0 border-r border-[#1e1e1e]">
                            <FileCode2 size={14} className="text-sky-400" />
                            <span className="text-sm">globals.css</span>
                        </div>
                    </div>

                    {/* Breadcrumbs */}
                    <div className="h-6 flex items-center px-4 text-xs text-slate-500 gap-1 shrink-0 border-b border-[#2b2b2b]">
                        <span>src</span> <ChevronRight size={12} /> <span>components</span> <ChevronRight size={12} /> <span className="text-slate-300">{activeTab}</span>
                    </div>

                    {/* Editor / Code Area */}
                    <div className="flex-1 relative overflow-hidden flex flex-col">
                        <div className="flex-1 overflow-auto relative font-mono text-sm leading-6 py-4" ref={scrollContainerRef}>

                            {/* Code Lines with Presence Gutter */}
                            <div className="min-w-max px-4 pb-16">
                                {codeLines.map((line, i) => {
                                    const lineNum = i + 1;
                                    const isSantyActive = activeSanty.includes(lineNum);
                                    const isElenaActive = activeElena.includes(lineNum);

                                    // Very basic split to avoid replacing inside our own tags
                                    // A robust solution would use PrismJS, but for this demo we'll use a safer regex approach
                                    // that escapes HTML entities first, then wraps Keywords without colliding.
                                    const safeHtml = line
                                        .replace(/</g, '&lt;')
                                        .replace(/>/g, '&gt;');

                                    // Basic Safe Highlighting
                                    let highlighted = safeHtml;

                                    // 1. Strings (amber-300)
                                    highlighted = highlighted.replace(/(".*?"|'.*?'|`.*?`)/g, '<span class="text-amber-300">$1</span>');
                                    // 2. Keywords (pink-400) - Only match if not inside an HTML tag
                                    highlighted = highlighted.replace(/\b(import|from|export|const|let|var|return|async|await)\b(?![^<]*>)/g, '<span class="text-pink-400">$1</span>');
                                    // 3. React/Hooks (sky-300)
                                    highlighted = highlighted.replace(/\b(useState|useEffect|console\.log)\b(?![^<]*>)/g, '<span class="text-sky-300">$1</span>');
                                    // 4. Component imports (emerald-300)
                                    highlighted = highlighted.replace(/\b(React|motion|AnimatePresence)\b(?![^<]*>)/g, '<span class="text-emerald-300">$1</span>');
                                    // 5. Constants (blue-300)
                                    highlighted = highlighted.replace(/\b(className)\b(?![^<]*>)/g, '<span class="text-blue-300">$1</span>');
                                    // 6. Comments (slate-500)
                                    highlighted = highlighted.replace(/(\/\/[^\n]*)/g, '<span class="text-slate-500 italic">$1</span>');

                                    return (
                                        <div key={i} className="flex hover:bg-white/5 relative group">
                                            {/* Gutter (Line numbers) */}
                                            <div className="w-12 shrink-0 text-right pr-4 text-slate-600 select-none border-r border-transparent">
                                                {lineNum}
                                            </div>

                                            {/* Presence Indicator Lines */}
                                            <div className="absolute left-10 w-[3px] h-full flex flex-col border-r border-[#1e1e1e]">
                                                {isSantyActive && <div className="h-full bg-blue-500" title="Santy" />}
                                                {isElenaActive && <div className="h-full bg-pink-500" title="Elena" />}
                                            </div>

                                            {/* Code Highlight Simulator */}
                                            <div className="pl-6 whitespace-pre text-slate-300">
                                                <span dangerouslySetInnerHTML={{ __html: highlighted }} />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Collaborative Layer (Remote Cursors & Auto-Typing) */}
                            <CollaborativeLayer pause={!isVisible || prefersReducedMotion} />

                        </div>
                    </div>

                </div>
            </div>

            {/* Status Bar (VS Code style lower bar) */}
            <div className="h-6 bg-[#007acc] flex items-center justify-between px-3 text-white text-[10px] shrink-0 font-medium">
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 cursor-pointer hover:bg-white/20 px-1 rounded"><GitBranch size={12} /> main*</span>
                    <span className="flex items-center gap-1 cursor-pointer hover:bg-white/20 px-1 rounded"><RotateCcw size={12} /> 0 <CheckCircle2 size={12} className="ml-1" /> 0</span>
                    <span className="flex items-center gap-1 ml-4 cursor-pointer hover:bg-white/20 px-1 rounded">Live Share (3)</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="cursor-pointer hover:bg-white/20 px-1 rounded hidden sm:inline-block">Ln 14, Col 21</span>
                    <span className="cursor-pointer hover:bg-white/20 px-1 rounded hidden sm:inline-block">Spaces: 2</span>
                    <span className="cursor-pointer hover:bg-white/20 px-1 rounded hidden md:inline-block">UTF-8</span>
                    <span className="cursor-pointer hover:bg-white/20 px-1 rounded">TypeScript React</span>
                </div>
            </div>

        </div>
    );
}
