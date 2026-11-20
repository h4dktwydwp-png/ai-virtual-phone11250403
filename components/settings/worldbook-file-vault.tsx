// components/settings/worldbook-file-vault.tsx
import React, { useEffect, useState } from "react";
import { getWorldbookVaultEntries, generateKeywords } from "../../lib/worldbook-file-vault";
import type { FileVaultEntry } from "../../lib/chat-document-import";
import "../../styles/worldbook-file-vault.css";

interface WorldbookFileVaultModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (entry: { title: string; content: string; keys: string[] }) => void;
}

export const WorldbookFileVaultModal: React.FC<WorldbookFileVaultModalProps> = ({
    isOpen,
    onClose,
    onSelect,
}) => {
    const [entries, setEntries] = useState<FileVaultEntry[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            getWorldbookVaultEntries()
                .then(setEntries)
                .finally(() => setLoading(false));
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="wb-fv-modal" onClick={onClose}>
            <div className="wb-fv-content" onClick={(e) => e.stopPropagation()}>
                <div className="wb-fv-header">
                    <span className="wb-fv-title">从文件库导入世界书条目</span>
                    <button onClick={onClose} style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: 16 }}>×</button>
                </div>
                <div className="wb-fv-body">
                    {loading ? (
                        <div style={{ textAlign: "center", padding: "20px", color: "#6b7280" }}>加载中...</div>
                    ) : entries.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "20px", color: "#6b7280" }}>文件库中暂无材料，请先在「文件库」APP 中添加</div>
                    ) : (
                        <div className="wb-fv-list">
                            {entries.map((entry) => (
                                <div
                                    key={entry.id}
                                    className="wb-fv-item"
                                    onClick={() => {
                                        const keys = generateKeywords(entry.title, entry.text);
                                        onSelect({
                                            title: entry.title,
                                            content: entry.text,
                                            keys,
                                        });
                                        onClose();
                                    }}
                                >
                                    <div className="wb-fv-item-title">{entry.title}</div>
                                    <div className="wb-fv-item-text">{entry.text}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
