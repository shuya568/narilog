# Repository Guidelines

## Project Structure & Module Organization
- ルートには NestJS API を格納する `backend/narilog-api`、スキーマ/設定の `prisma`、README で触れているフェーズごとの `docs` がある。
- `backend/narilog-api` 内では `src` にサービス/コントローラー/モジュール、`test` に Jest スペック、`dist` にビルド成果物が並ぶ。
- 新機能は名称が明確なディレクトリ配下に置き、関連する `docs/0X_*.md` にリンクして変更意図を共有する。

## Build, Test, and Development Commands
- `cd backend/narilog-api && npm install` – 依存関係を同期する。
- `npm run build` – `nest build` で `dist` を生成する。
- `npm run start`, `npm run start:dev`, `npm run start:prod` – 通常実行、ウォッチモード、ビルド成果物からの実行。
- `npm run lint`/`npm run format` – `src` と `test` を ESLint/Prettier で整える。
- `npm run test`, `npm run test:watch`, `npm run test:cov`, `npm run test:e2e` – ユニット、ウォッチ、カバレッジ、E2E（`coverage/` 出力）を順に実行。

## Coding Style & Naming Conventions
- NestJS/TypeScript のデフォルトに従い、インデントは 2 スペース、`camelCase` をメンバ、`PascalCase` をクラスやモジュール、Nest CLI 生成ファイルは `kebab-case` にする。
- モジュール/サービスの責務を分け、コントローラーはプロバイダーへ委譲し Prisma ロジックを直接書き込まない。
- コミット前に `npm run lint` と `npm run format` を走らせ、ESLint（v9）と Prettier（v3）の整合性を保つ。

## Testing Guidelines
- Jest がユニットと E2E を担当。対象コードに隣接させた `*.spec.ts`、E2E は `test/` 配下に置く。
- カバレッジは `coverage/` に出力されるので、サービス境界や認証/投稿など触ったフローを重点的にカバーする。
- 共有フィクスチャは `test/fixtures` か `docs/0X` に置き、他の貢献者が流用できるようにする。

## Commit & Pull Request Guidelines
- `feat:`, `fix:`, `chore:` などのコモンコミットプレフィックスを使い、履歴を従来のスタイルに合わせる。
- PR には変更概要、影響したフェーズ文書（例: `docs/02_domain_model.md`）、実行したコマンド（lint/test）を記載する。
- API や UI を変更した際はスクリーンショット、契約メモ、要件ドキュメントへのリンクを添え、関連する issue を参照する。

## Documentation & Phase Notes
- 要件・ドメイン・運用の変化があれば次の番号の `docs/0X_*.md` を更新し、フェーズ方式を最新に保つ。
- README のフェーズ順（要件→ドメインモデル→アーキテクチャ→実装→運用）に従ってメモを追加する。
