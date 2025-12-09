# narilog 要件定義書（MVP 版）

Version: 0.1  
Status: Draft  
Last Updated: 2025-12-07

---

## 1. 前提・背景

narilog は、フルスタック TypeScript 技術を用いた  
**個人ブログ兼ポートフォリオサイト**として開発する。

本プロジェクトの背景は次の通り。

- 自作サービスを設計・実装・運用する経験を積みたい
- Next.js / NestJS / Prisma / GCP を用いた実戦的フルスタック構成を学びたい
- AI と共同開発する新しい開発プロセスを確立したい
- 長期的に運用し、改善を続けられるプロダクトを作りたい

本ドキュメントは、MVP（Minimum Viable Product）に必要な要件を定義する。

---

## 2. 目的

narilog の目的は以下の 2 点である。

1. **フルスタック TypeScript の技術ポートフォリオを構築する**
2. **自作サービスをクラウド上で継続運用する経験を獲得する**

そのため、MVP はシンプルに最小限のコンテンツ管理機能に留め、  
運用フェーズで段階的に機能拡張を行う。

---

## 3. 用語定義

| 用語      | 説明                                           |
| --------- | ---------------------------------------------- |
| Post      | 記事（Markdown で記述）                        |
| Draft     | 下書き状態の Post                              |
| Published | 公開状態の Post                                |
| Admin     | 記事を管理する管理者（ログイン必須）           |
| Reader    | ブログ閲覧者（ログイン不要）                   |
| Category  | 記事の分類                                     |
| Like      | 読者が記事につける「いいね」記録               |
| MVP       | Minimum Viable Product。最小実行可能プロダクト |

---

## 4. スコープ（MVP に含む/含まない）

### ✓ **MVP に含む**

#### ■ 記事機能

- 記事の作成・編集・削除
- Markdown（Milkdown）による編集 UI
- 公開/非公開（Draft/Published）の切替
- 記事の閲覧ページ（公開）

#### ■ カテゴリ

- カテゴリ作成（管理画面から）
- 記事への紐づけ
- カテゴリ別フィルタリング

#### ■ 検索

- タイトル・本文（全文 or 部分）検索

#### ■ いいね（Like）

- ログイン不要
- Cookie または IP ベースでの簡易制御
- 二重押し防止付き
- 集計数の表示

#### ■ 画像アップロード

- 管理画面で画像アップロード
- Cloud Storage への保存
- 署名付き URL 方式（Next.js → NestJS → GCS）

#### ■ 認証（管理者のみ）

- NextAuth を使用
- 管理画面へのアクセス制御
- 認証方法：Email/Password or OAuth（Google）
- JWT 認証は MVP では含めず、将来拡張とする

#### ■ SEO（最低限）

- title / description / ogp を記事単位で設定可能（基本のみ）

#### ■ フロントエンド

- Zenn 風 UI
- シンプルで読みやすい 1 カラムレイアウト
- レスポンシブ対応

#### ■ インフラ

- Next.js：Cloud Run
- NestJS：Cloud Run
- DB：Cloud SQL (PostgreSQL)
- 画像：Cloud Storage

---

### ✗ **MVP には含まない（将来拡張）**

- タグ機能
- コメント機能
- 読者アカウント・ログイン
- SNS シェア自動生成
- 記事の目次生成
- アクセス解析（GA4 など）
- 管理者ダッシュボード
- 多言語対応
- Draft のプレビュー URL 生成
- JWT 認証
- CMS 的な権限管理

---

## 5. 機能要件

### 5.1 記事（Post）

| 機能     | 詳細                                                |
| -------- | --------------------------------------------------- |
| 作成     | Markdown で新規作成。タイトル・本文・カテゴリを入力 |
| 編集     | 既存記事の編集（Markdown エディタ）                 |
| 削除     | 論理削除 or 物理削除（後で決定）                    |
| 状態     | Draft / Published を切り替え可能                    |
| 表示     | 公開記事のみ一般閲覧可能                            |
| スラッグ | 自動生成（`my-first-post`） + 手動編集も可          |

---

### 5.2 管理画面（Admin）

- `/admin/posts`：一覧
- `/admin/posts/new`：新規作成
- `/admin/posts/[id]`：編集
- 画像アップロード機能
- カテゴリ管理 UI

---

### 5.3 認証

- NextAuth による管理者ログイン
- Google OAuth（優先）または Email/Password
- 認証されていない場合 `/admin/login` にリダイレクト
- NestJS 側では NextAuth のセッションを検証して API の保護を行う

---

### 5.4 検索

- タイトル・本文（Markdown→ 平文変換）を部分一致で検索

---

### 5.5 いいね（Like）

- ログイン不要
- 1 記事につき 1 回（Cookie / LocalStorage で制御）
- バックエンドでは数値加算

---

### 5.6 画像アップロード

- NestJS の Upload API で署名 URL を生成
- Next.js から GCS に直接 PUT
- Markdown 内への画像挿入は定義済みパスで行う

---

## 6. 非機能要件

### 6.1 パフォーマンス

- ページ表示速度は Core Web Vitals を基準に最適化
- Next.js の ISR を活用し、記事ページの高速配信を実現

### 6.2 セキュリティ

- NextAuth による管理者認証
- GCS 署名 URL により安全なアップロード
- Cloud Run + Cloud Armor による防御

### 6.3 可用性

- Cloud Run による自動スケール
- DB は Cloud SQL（1 ユニット構成で OK）

---

## 7. 運用要件

- GitHub Actions による CI/CD（将来拡張）
- Cloud Run への自動デプロイ（将来導入）
- 障害時は Cloud Logging で調査
- スキーマ変更は Prisma Migrate を使用

---

## 8. ドメインモデル概要（DDD）

### 集約ルート

- Post
- Category
- User（Admin）

### エンティティ

- Post(id, title, content, status, categoryId, createdAt, updatedAt)
- Category(id, name)
- User(id, email, name)
- Like(postId, clientKey)

### 値オブジェクト

- Title
- Slug
- Content (Markdown/HTML)
- Status (Draft/Published)

---

## 9. 画面一覧

- `/`：記事一覧
- `/posts/[slug]`：記事詳細
- `/admin/login`：ログイン
- `/admin/posts`：一覧
- `/admin/posts/new`：作成
- `/admin/posts/[id]`：編集

---

## 10. API 概要

### Next.js → NestJS

| 機能                      | メソッド | パス            |
| ------------------------- | -------- | --------------- |
| 記事一覧                  | GET      | /posts          |
| 記事詳細                  | GET      | /posts/:slug    |
| 新規記事                  | POST     | /posts          |
| 更新                      | PUT      | /posts/:id      |
| 削除                      | DELETE   | /posts/:id      |
| いいね                    | POST     | /posts/:id/like |
| カテゴリ                  | GET/POST | /categories     |
| 画像アップロード URL 生成 | POST     | /upload/presign |

---

## 11. 将来拡張

- JWT 認証
- コメント機能
- タグ
- 目次生成
- プレビュー URL
- エディタ強化（ショートカット・プラグイン）
- サムネイル画像設定
- API アクセス権限
- モバイルアプリ化（Expo / React Native）

---

## 12. リスク・制約

- Cloud SQL は月額コストが一定かかる
- NextAuth + NestJS の連携に学習曲線あり
- Cloud Run は起動コールドスタートが発生
- いいね機能は不正対策が簡易的
