// lib/mixology/file-vault.ts
import { loadFileVaultLibrary, type FileVaultEntry } from "../chat-document-import";

export async function getMixologyVaultEntries(): Promise<FileVaultEntry[]> {
    try {
        return await loadFileVaultLibrary("documents");
    } catch {
        return [];
    }
}

export function entryToMixMaterial(entry: FileVaultEntry, kind: string) {
    return {
        id: `mat_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        name: entry.title,
        kind,
        profileMode: "freeform" as const,
        profileText: entry.text,
        worldText: entry.note || "",
        content: entry.text,
        tags: entry.tags || [],
    };
}
