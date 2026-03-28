# Mahjong Score Calculator

麻雀点数計算アプリ（React + TypeScript + Vite + Tailwind CSS）

## コマンド

```bash
npm run dev        # 開発サーバー起動
npm run build      # TypeScript ビルド + Vite ビルド
npm run typecheck  # 型チェックのみ
npm test           # テスト実行（vitest）
npm run lint       # ESLint
```

## ディレクトリ構成

```
src/
├── components/      # React コンポーネント（Step*, ResultView, UI部品）
├── logic/           # ビジネスロジック（scoreCalculator, fuCalculator, yakuList）
├── lib/             # ユーティリティ（haptics, utils）
├── assets/          # 画像アセット（tiles/, hero.png, celebration.jpg）
├── __tests__/       # テストファイル（vitest）
├── App.tsx          # メインアプリ（useReducer でステップ管理）
├── types.ts         # 型定義
└── index.css        # グローバルスタイル + Tailwind
docs/
└── celebration-easter-egg.md  # イースターエッグ機能のドキュメント
```

## イースターエッグ: 祝福アニメーション

リザルト画面で **12,000点以上** の場合に祝福画像が表示される隠し機能あり。
**この機能は今後改良予定**。詳細は `docs/celebration-easter-egg.md` を参照。

変更時の注意点:
- `src/logic/scoreCalculator.ts` の `getTotalPoints()` が合計得点の計算ロジック
- `src/components/CelebrationOverlay.tsx` がアニメーションコンポーネント
- アニメーションは `motion/react` ライブラリを使用
- 変更後は `docs/celebration-easter-egg.md` も必ず更新すること
