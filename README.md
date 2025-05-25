# CircleNavi

CircleNavi is a lightweight TypeScript-based UI component for toggling index menus. It allows you to switch between menu items (indexed sections, pages, etc.) by moving a highlight or indicator, all without relying on any external libraries. This component is designed to be simple and easily integrated into personal websites or standalone projects.

# Features

- No External Dependencies: Built with plain TypeScript/JavaScript, requiring no frameworks or libraries.
- Customizable Settings: Behavior and selectors are configurable via a simple settings object (e.g. choose your own element selectors, sizes, intervals).
- Lightweight & Fast: Minimal code ensures a small footprint, making it quick and efficient for any project.
- Easy Integration: Can be dropped into any webpage or project without complex setup, ideal for small projects and personal sites.

# Installation

No special installation procedure is needed. You can simply download or copy the files from the circle-navi directory into your project. Include the compiled script file in your HTML (for example, via a <script type="module" src="circleNavi.js"></script> tag) or import the CircleNavi class into your project if you are using a module bundler. There are no external packages to install or configure.

# Usage

To use CircleNavi, include the script (as noted above) and then initialize the menu with your desired settings. For example, if your HTML has a series of navigation buttons and an indicator element, you can configure and instantiate the menu as follows:

## 🔗 Demo

[GitHub Pages](https://taikibansyo.github.io/circle-navi/)

```javascript
// Configuration settings for CircleNavi
const settings = {
  btn: ".navi__inner button",
  target: ".circle",
  bgArea: "body",
  diameter: 40,
  interval: 5,
};

// Initialize the menu with the settings and activate the toggle functionality
const menu = new CircleNavi(settings);
menu.addEvent();
```

```npm
npm install circle-navi
```

```ts
import { StaticNaviMenu } from 'circle-navi';

const menu = new StaticNaviMenu({...});
menu.addEvent();
```

In this configuration:

- `btn` – CSS selector for the menu trigger buttons (e.g. all buttons inside the element with class `navi__inner`). Each button should have a data-index attribute (starting from 0) to identify its position.
- `target` – CSS selector for the moving indicator element (for example, a `.circle` element that highlights the active menu item).
- `bgArea` – CSS selector for the background area that changes style or color when the menu toggles (for instance, `"body"` to change the page background).
- `diameter` – The diameter (in pixels) of the indicator element (e.g. the circle’s size).
- `interval` – The spacing (in pixels) between each menu item’s position (controls how far the indicator moves for each step).

After defining your settings, you create a new `CircleNavi` with those settings and call `addEvent()` to bind the click events to your navigation buttons. Once set up, clicking a menu button will smoothly move the indicator (the circle) to that button’s position and toggle relevant background colors or styles, indicating the active index.

# Use Case

CircleNavi is especially suitable for personal websites or small projects. For example, you might use it on a portfolio site to navigate between different sections with a stylish indicator, or on a simple image slideshow to highlight the current item. Its simplicity and lack of external dependencies make it a great choice when you need an interactive menu feature without the overhead of large frameworks.

# License

This project is licensed under the MIT License. Feel free to use and modify it for your own projects.

---

# CircleNavi

CircleNavi は、インデックス形式のメニュー切り替え UI を簡単に実装できる、TypeScript 製の軽量コンポーネントです。
個人サイトやシンプルな Web サービスのメニュー UI に最適で、外部ライブラリなしで導入できます。

# 特長

- 依存ライブラリなし
  TypeScript/JavaScript のみで動作し、React や Vue などのフレームワーク不要です。

- 簡単カスタマイズ
  ボタンやインジケータ、背景のセレクタ・サイズ・移動間隔などを設定オブジェクトで柔軟に指定できます。

- 軽量・高速
  必要最低限のコード量なので、サイトのパフォーマンスを損ないません。

- シンプル導入
  複雑なセットアップ不要。既存の HTML にすぐ組み込めます。

# 使い方

## 1. ファイル設置

`circle-navi`ディレクトリ内のファイルを自分のプロジェクトにコピーしてください。
TypeScript プロジェクトなら直接 import、HTML ならビルド済みの js ファイルを`<script>`タグで読み込みます。

## 2. HTML サンプル

```HTML
<div class="navi__inner">
  <button data-index="0">メニュー1</button>
  <button data-index="1">メニュー2</button>
  <button data-index="2">メニュー3</button>
</div>
<div class="circle"></div>
```

## 🔗 デモ

[GitHub Pages デモを見る](https://taikibansyo.github.io/circle-navi/)

## 3. 設定例・初期化(javascript)

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

## 3. 設定例・初期化(typescript)

```npm
npm install circle-navi
```

```ts
import { StaticNaviMenu } from 'circle-navi';

const menu = new StaticNaviMenu({...});
menu.addEvent();
```

| 設定項目 | 意味                                    |
| -------- | --------------------------------------- |
| btn      | メニューボタンのセレクタ                |
| target   | インジケータ（例: `.circle`）のセレクタ |
| bgArea   | 背景を変化させるエリアのセレクタ        |
| diameter | インジケータの直径（px）                |
| interval | ボタン間のインジケータ移動距離（px）    |

# 想定ユースケース

- ポートフォリオ・個人ブログのナビゲーション
- LP や 1 ページサイトのセクション切り替え
- 画像ギャラリーやタブ UI のアクティブ表示

# カスタマイズ例

- インジケータのデザインや動きを CSS で変更可能
- ボタンや背景のアニメーションも拡張しやすい

# 注意点

- ボタンには`data-index`属性が必要です（0 から連番）。
- HTML/CSS 側で必要なスタイルを調整してください。

# ライセンス

MIT License
ご自由にご利用・改変いただけます。

# 作者

[taikibansyo](https://github.com/taikibansyo)

---

★ ご要望・バグ報告などは Issue/PR でお気軽にどうぞ！

---
