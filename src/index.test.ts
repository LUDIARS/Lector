import { describe, it, expect } from 'vitest';
import {
  detectReparseKind,
  reparseHtml,
  isNotionUrl,
  extractNotionBlocks,
  extractNotionPageId,
  detectChatSourceByUrl,
  extractChatMessages,
} from './index.js';

describe('detectReparseKind', () => {
  it('Notion / chat / 未知 を判別する', () => {
    expect(detectReparseKind('https://www.notion.so/abc')).toBe('notion');
    expect(detectReparseKind('https://example.notion.site/x')).toBe('notion');
    expect(detectReparseKind('https://chatgpt.com/c/123')).toBe('chat');
    expect(detectReparseKind('https://claude.ai/chat/x')).toBe('chat');
    expect(detectReparseKind('https://example.com/page')).toBeNull();
  });
});

describe('isNotionUrl', () => {
  it('notion.so / notion.site のみ true', () => {
    expect(isNotionUrl('https://notion.so/x')).toBe(true);
    expect(isNotionUrl('https://foo.notion.site/x')).toBe(true);
    expect(isNotionUrl('https://notion.so.evil.com/x')).toBe(false);
    expect(isNotionUrl('not-a-url')).toBe(false);
  });
});

describe('extractNotionPageId', () => {
  it('URL から 32 桁 hex を拾う', () => {
    expect(extractNotionPageId('https://notion.so/Title-0123456789abcdef0123456789abcdef'))
      .toBe('0123456789abcdef0123456789abcdef');
    expect(extractNotionPageId('https://notion.so/no-id')).toBeNull();
  });
});

describe('extractNotionBlocks', () => {
  it('見出し / テキスト / todo ブロックを抽出する', () => {
    const html = `<div class="notion-page-content">
      <div data-block-id="1" class="notion-header-block"><div contenteditable="true">志望動機</div></div>
      <div data-block-id="2" class="notion-text-block"><div contenteditable="true">本文です</div></div>
      <div data-block-id="3" class="notion-to_do-block"><input type="checkbox" checked><div contenteditable="true">提出</div></div>
    </div>`;
    const blocks = extractNotionBlocks(html);
    expect(blocks).toEqual([
      { kind: 'heading_1', text: '志望動機' },
      { kind: 'text', text: '本文です' },
      { kind: 'todo', text: '提出', checked: true },
    ]);
  });

  it('空テキストのブロックは捨てる', () => {
    const html = `<div class="notion-page-content">
      <div data-block-id="1" class="notion-text-block"><div contenteditable="true">  </div></div>
    </div>`;
    expect(extractNotionBlocks(html)).toEqual([]);
  });
});

describe('chat 抽出', () => {
  it('detectChatSourceByUrl が host を判別する', () => {
    expect(detectChatSourceByUrl('https://chatgpt.com/c/1')).toBe('chatgpt');
    expect(detectChatSourceByUrl('https://claude.ai/x')).toBe('claude');
    expect(detectChatSourceByUrl('https://gemini.google.com/x')).toBe('gemini');
    expect(detectChatSourceByUrl('https://example.com')).toBeNull();
  });

  it('ChatGPT の保存 HTML から会話を抽出する', () => {
    const html = `<div>
      <div data-message-author-role="user" data-message-id="a">質問A</div>
      <div data-message-author-role="assistant" data-message-id="b">回答B</div>
    </div>`;
    expect(extractChatMessages(html, 'chatgpt')).toEqual([
      { role: 'user', text: '質問A' },
      { role: 'assistant', text: '回答B' },
    ]);
  });
});

describe('reparseHtml', () => {
  it('Notion URL なら notion 結果を返す', () => {
    const html = `<div class="notion-page-content">
      <div data-block-id="1" class="notion-text-block"><div contenteditable="true">中身</div></div>
    </div>`;
    const r = reparseHtml('https://notion.so/T-0123456789abcdef0123456789abcdef', html);
    expect(r?.kind).toBe('notion');
    if (r?.kind === 'notion') {
      expect(r.page_id).toBe('0123456789abcdef0123456789abcdef');
      expect(r.blocks).toHaveLength(1);
    }
  });

  it('未知 URL なら null', () => {
    expect(reparseHtml('https://example.com', '<html></html>')).toBeNull();
  });
});
