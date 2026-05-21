# Lector

保存済 Web HTML から構造化コンテンツを抽出する **LUDIARS 共有パーサ**。
（ラテン語 "lector" = 読み手 — HTML を読んで解釈する役）

もとは [Memoria](https://github.com/LUDIARS/Memoria) の `server/parsers/` で、
bookmark のスナップショット HTML から Notion ページ / チャットログ
(ChatGPT / Claude / Gemini) を解析していた。 これを Memoria と
[Tirocinium](https://github.com/LUDIARS/Tirocinium)（面接練習アプリの
ES 解析 / 面接データ解析）で共用するため、 独立パッケージに切り出した。

## できること

- **Notion** — 保存済 Notion ページ HTML → 見出し / テキスト / リスト / todo /
  コード / 区切り / bookmark の構造化ブロック列。
- **Chat** — ChatGPT / Claude / Gemini の保存済 HTML → `{ role, text }` の会話列。
- `reparseHtml(url, html)` — URL から種別を auto-detect して上記を返す。

## 使い方

```ts
import { reparseHtml, extractNotionBlocks } from '@ludiars/lector';

const result = reparseHtml(url, savedHtml);
if (result?.kind === 'notion') {
  for (const block of result.blocks) { /* ... */ }
}

// 低レベル関数も個別に使える
const blocks = extractNotionBlocks(savedHtml);
```

入力は **静的 HTML**（レンダリング後だが JS は走らない保存スナップショット）を
想定する。 ライブ DOM は対象外。

## ビルド / テスト

```sh
npm install
npm run build      # tsc → dist/
npm test           # vitest
npm run typecheck
```

## ライセンス

LUDIARS 内部利用。
