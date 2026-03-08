"use client";

import React, { useState, useEffect, useRef } from 'react';
import styles from './Terminal.module.css';

interface TerminalLine {
    type: 'system' | 'command' | 'response' | 'error';
    content: string;
}

export default function HackerTerminal() {
    const [history, setHistory] = useState<TerminalLine[]>([
        { type: 'system', content: 'ZONA SUR TECH [Version 3.1.2]' },
        { type: 'system', content: 'System established. Connection secure.' },
        { type: 'system', content: 'Type "help" for a list of available commands.' },
    ]);
    const [input, setInput] = useState('');
    const outputRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [history]);

    const handleCommand = (cmd: string) => {
        const cleanCmd = cmd.trim().toLowerCase();
        const newHistory: TerminalLine[] = [...history, { type: 'command', content: `> ${cmd}` }];

        switch (cleanCmd) {
            case 'help':
                newHistory.push({ type: 'response', content: 'Available commands:\n- status: Check system status\n- logs: View recent activity\n- sys-info: Detailed hardware specifications\n- hack: [REDACTED]\n- clear: Purge terminal history\n- exit: Terminate session' });
                break;
            case 'status':
                newHistory.push({ type: 'response', content: 'SYSTEM STATUS: OPERATIONAL\nVULNERABILITIES: 0\nUPTIME: 142:32:04\nLOAD: 1.2% | MEM: 452MB | CPU: 2.1GHz' });
                break;
            case 'sys-info':
                newHistory.push({ type: 'response', content: 'HARDWARE ARCHITECTURE: x86_64\nQUANTUM COMPUTE CORES: 128 [STABLE]\nGRID SYNC: ACTIVE [0ms OFFSET]\nNEURAL INTERFACE: OPTICAL_LINK_8G' });
                break;
            case 'logs':
                newHistory.push({ type: 'response', content: `[${new Date().toLocaleTimeString()}] INBOUND CONNECTION FROM 192.168.1.104\n[${new Date().toLocaleTimeString()}] AUTHENTICATION SUCCESSFUL (root)\n[${new Date().toLocaleTimeString()}] MODULE "CURSOR_TRAIL" INITIALIZED\n[${new Date().toLocaleTimeString()}] SWARM_ENGINE_v2 COLD START` });
                break;
            case 'hack':
                newHistory.push({ type: 'error', content: 'ACCESS DENIED. AUTHORIZATION LEVEL 4 REQUIRED.' });
                newHistory.push({ type: 'system', content: 'Security bypass attempt logged.' });
                break;
            case 'clear':
                setHistory([]);
                return;
            case 'exit':
                newHistory.push({ type: 'system', content: 'Terminating session... Goodbye.' });
                break;
            default:
                newHistory.push({ type: 'error', content: `Command not found: ${cleanCmd}` });
        }

        setHistory(newHistory);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            handleCommand(input);
            setInput('');
        }
    };

    const focusInput = () => {
        inputRef.current?.focus();
    };

    return (
        <div className={styles.container} onClick={focusInput}>
            <header className={styles.header}>
                <div className={styles.title}>ZS_TERMINAL_EMULATOR_v3.1.2</div>
                <div className={styles.controls}>
                    <div className={styles.dot} />
                    <div className={styles.dot} />
                    <div className={styles.dot} />
                </div>
            </header>

            <div className={styles.terminalOutput} ref={outputRef}>
                {history.map((line, idx) => (
                    <div key={idx} className={`${styles.line} ${styles[line.type]}`}>
                        {line.content}
                    </div>
                ))}
            </div>

            <form className={styles.inputArea} onSubmit={handleSubmit}>
                <span className={styles.prompt}>root@zs_tech:~$</span>
                <input
                    ref={inputRef}
                    type="text"
                    className={styles.input}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    autoFocus
                    spellCheck={false}
                    autoComplete="off"
                />
            </form>
        </div>
    );
}
