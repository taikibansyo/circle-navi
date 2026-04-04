# CircleNavi

CircleNavi は、インデックス形式のメニュー切り替え UI を簡単に実装できる TypeScript 製の軽量コンポーネントです。
ボタンをクリックするとインジケータ（丸いマーカー）がスムーズに移動し、アクティブな項目をビジュアルで示します。外部ライブラリ不要で、個人サイトや小規模な Web プロジェクトにすぐ組み込めます。

## デモ

[GitHub Pages デモを見る](https://taikibansyo.github.io/circle-navi/)

---

## 特長

- **依存ライブラリなし** — TypeScript/JavaScript のみで動作。React・Vue などのフレームワーク不要。
- **簡単カスタマイズ** — セレクタ・サイズ・移動間隔などを設定オブジェクト 1 つで指定できる。
- **軽量・高速** — 必要最低限のコードなので、サイトのパフォーマンスを損なわない。
- **シンプル導入** — 複雑なセットアップ不要。既存 HTML にすぐ組み込める。

---

## インストール

### npm（TypeScript / モジュールバンドラ使用時）

```bash
npm install circle-navi
```

### ファイルコピー（HTML 単体で使用する場合）

`dist/` ディレクトリ内のビルド済みファイルをプロジェクトにコピーし、`<script>` タグで読み込みます。

---

## 使い方

### 1. HTML の準備

ナビゲーションボタンに `data-index` 属性（0 始まりの連番）を付けてください。
インジケータとして動かしたい要素（例：`.circle`）も配置します。

```html
<div class="navi__inner">
  <button data-index="0">メニュー1</button>
  <button data-index="1">メニュー2</button>
  <button data-index="2">メニュー3</button>
</div>
<div class="circle"></div>
```

### 2. JavaScript での初期化

```javascript
const settings = {
  btn: ".navi__inner button",
  target: ".circle",
  bgArea: "body",
  diameter: 40,
  interval: 5,
};

const menu = new CircleNavi(settings);
menu.addEvent();
```

### 3. TypeScript での初期化

```ts
import { CircleNavi } from 'circle-navi';

const menu = new CircleNavi({
  btn: ".navi__inner button",
  target: ".circle",
  bgArea: "body",
  diameter: 40,
  interval: 5,
});
menu.addEvent();
```

---

## 設定オプション

| オプション | 型       | 説明                                                                 |
| ---------- | -------- | -------------------------------------------------------------------- |
| `btn`      | `string` | メニューボタンの CSS セレクタ。各ボタンに `data-index` 属性が必要。  |
| `target`   | `string` | インジケータ要素（例：`.circle`）の CSS セレクタ。                   |
| `bgArea`   | `string` | ボタン切り替え時に背景スタイルを変化させるエリアの CSS セレクタ。    |
| `diameter` | `number` | インジケータの直径（px）。                                           |
| `interval` | `number` | ボタン間のインジケータ移動距離（px）。                               |

---

## 動作の仕組み

- ボタンをクリックすると、インジケータが前の位置から新しい位置へ伸縮しながら移動します。
- `target` 要素と `bgArea` 要素に `bg-color-{index}` クラスが付与されるので、CSS でアクティブ時のスタイルを自由に定義できます。
- アクティブなボタンには `inview` クラスが付与されます。

---

## 注意点

- ボタンには `data-index` 属性が必要です（0 から始まる連番）。
- インジケータや背景の見た目は CSS 側で定義してください（`bg-color-0`、`bg-color-1`、`inview` など）。

---

## 想定ユースケース

- ポートフォリオ・個人ブログのナビゲーション
- LP や 1 ページサイトのセクション切り替え
- 画像ギャラリーやタブ UI のアクティブ表示

---

## ライセンス

[MIT License](https://opensource.org/licenses/MIT) — ご自由にご利用・改変いただけます。

## 作者

[taikibansyo](https://github.com/taikibansyo)

---

ご要望・バグ報告は [Issue](https://github.com/taikibansyo/circle-navi/issues) / PR でお気軽にどうぞ。
