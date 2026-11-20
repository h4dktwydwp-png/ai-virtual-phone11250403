// lib/chat-document-import.ts
import { decodeTxtArrayBuffer, extractPdfPlainText } from "./reading-parser";
import { loadInstalledCustomApps, readCustomAppCollection } from "./custom-app-storage";
import type { InstalledCustomApp } from "./custom-app-types";

export const FILE_VAULT_MANIFEST_ID = "file.vault";
export const FILE_VAULT_COLLECTION = "documents";
export const MAX_DOC_CHARS = 400000;

export type ImportedChapter = { title: string; text: string; chars: number; };
export type ImportedDocument = {
    id: string;
    title: string;
    ext: string;
    text: string;
    charCount: number;
    tokenEstimate: number;
    sourceNote: string;
    source: "file" | "library";
    category?: string;
    tags?: string[];
    note?: string;
    originalName?: string;
    chapters: ImportedChapter[];
};
export type ChatDocAttachment = {
    docId: string;
    title: string;
    ext: string;
    source: ImportedDocument["source"];
    category?: string;
    tags?: string[];
    note?: string;
    chapters: ImportedChapter[];
    selected: number[];
    capChars: number;
    charCount: number;
    tokenEstimate: number;
};

function uid(prefix: string): string {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function countDocChars(text: string): number {
    return String(text || "").replace(/\s/g, "").length;
}

export function estimateDocTokens(text: string): number {
    const value = String(text || "");
    const cjk = (value.match(/[\u3400-\u9FFF\uF900-\uFAFF\u3040-\u30FF\uAC00-\uD7AF]/g) || []).length;
    return Math.ceil(cjk + (value.length - cjk) / 3.6);
}

export function extOfName(name: string): string {
    const matched = /\.([a-z0-9]+)$/i.exec(String(name || ""));
    return matched ? matched[1].toLowerCase() : "";
}

export async function loadFileVaultLibrary(collection?: string): Promise<any[]> {
    const apps = loadInstalledCustomApps();
    const app = apps.find((a) => a.manifest?.id === FILE_VAULT_MANIFEST_ID) || apps.find((a) => (a.manifest?.name || "").toLowerCase().includes("文件库"));
    if (!app) return [];
    const rows = await readCustomAppCollection(app.id, collection || FILE_VAULT_COLLECTION);
    return rows.map((row: any) => ({
        id: row.id || uid("fv"),
        title: row.title || "未命名材料",
        category: row.category || "",
        tags: Array.isArray(row.tags) ? row.tags : [],
        note: row.note || "",
        text: String(row.text || ""),
        charCount: countDocChars(row.text || ""),
        updatedAt: row.updatedAt || "",
        sourceType: row.sourceType || "",
    }));
}
