// 保存済 HTML から抽出した構造化型。
// もとは Memoria server/api/types/note.ts。 共有パッケージとして切り出した。

export type NotionExtractedBlock =
  | { kind: 'heading_1' | 'heading_2' | 'heading_3' | 'text' | 'quote'; text: string }
  | { kind: 'todo'; text: string; checked?: boolean }
  | { kind: 'bullet_list' | 'numbered_list'; text: string; indent?: number }
  | { kind: 'code'; text: string; lang?: string }
  | { kind: 'divider' }
  | { kind: 'bookmark'; url: string; title?: string; caption?: string; image?: string };

export type ChatExtractionSource = 'chatgpt' | 'claude' | 'gemini';

export interface ChatExtractedMessage {
  role: 'user' | 'assistant' | 'system';
  text: string;
  ts?: string | null;
}
