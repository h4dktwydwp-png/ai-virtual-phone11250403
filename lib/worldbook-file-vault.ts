// lib/worldbook-file-vault.ts
import { loadFileVaultLibrary, type FileVaultEntry } from "./chat-document-import";

export async function getWorldbookVaultEntries(): Promise<FileVaultEntry[]> {
    try {
        return await loadFileVaultLibrary("documents");
    } catch {
        return [];
    }
}

export function generateKeywords(title: string, text: string): string[] {
    const keywords = new Set<string>();
    if (title && title.trim()) {
        keywords.add(title.trim());
    }
    const matches = text.match(/[\u4E00-\u9FA5]{2,4}/g);
    if (matches) {
        for (let i = 0; i < Math.min(5, matches.length); i++) {
            keywords.add(matches[i]);
        }
    }
    return Array.from(keywords).slice(0, 5);
}
