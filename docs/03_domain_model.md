# narilog ドメインモデル（MVP 版）

Version: 0.1  
Status: Draft

本ドキュメントは、narilog の「記事投稿ドメイン（Post Domain）」を中心に  
どんな“もの”が存在し、どんな振る舞い・ルールを持つかを整理する。

DDD の用語はなるべく使わず、  
ブログという身近な事例に落とし込みながら定義している。

---

# 1. narilog に存在する主要な「もの」

narilog の世界には、次の 4 つの「もの」が存在する。

1. **Post（記事）**
2. **Category（カテゴリ）**
3. **Like（いいね）**
4. **User（管理者）**

この中でブログの中心になるのは **Post（記事）** である。

---

# 2. Post（記事）

## 2.1 役割

- narilog の中心となる存在
- 記事として Web に公開される
- 作成、編集、公開、非公開、更新される

## 2.2 持っている情報（プロパティ）

| 項目        | 説明                                                 |
| ----------- | ---------------------------------------------------- |
| id          | 記事を一意に識別する ID                              |
| title       | 記事タイトル                                         |
| slug        | 記事ページの URL になる文字列（例：`my-first-post`） |
| contentMd   | Markdown 本文                                        |
| contentHtml | 表示用 HTML（必要に応じて生成）                      |
| status      | Draft（下書き） or Published（公開）                 |
| categoryId  | 記事が属するカテゴリ                                 |
| createdAt   | 作成日時                                             |
| updatedAt   | 更新日時                                             |

## 2.3 持っている振る舞い（ルール）

Post は単なるデータではなく、「記事として守らなければいけないルール」を持つ。

### タイトル

- 空文字は許可しない
- 長すぎるタイトルはエラーにする（例：100 文字以内）

### スラッグ

- 半角英数字とハイフンで構成されるべき
- 他の記事と重複してはいけない
- タイトルから自動生成できるが、編集も可能

### コンテンツ

- Markdown で記述
- HTML への変換は Post 内部、もしくは専用サービスで行う

### 公開ステータス

- Draft（下書き）
- Published（公開）
- 下書き中の記事は一般公開してはいけない
- 公開済の記事は URL で閲覧できる

---

# 3. Category（カテゴリ）

## 3.1 役割

- 記事を分類するためのラベル
- 1 記事は「1 つのカテゴリ」に属する（※MVP では単一）

## 3.2 持っている情報

| 項目 | 説明                              |
| ---- | --------------------------------- |
| id   | カテゴリの識別子                  |
| name | 技術 / 日記 / 勉強メモ などの名前 |

## 3.3 ルール

- name は重複不可
- 削除した場合、Post はカテゴリ未設定になる（MVP としては許容）

---

# 4. Like（いいね）

## 4.1 役割

- 読者が記事に対して「いいね」を押す機能
- ログイン不要で押せるシンプルなリアクション

## 4.2 持っている情報

| 項目      | 説明                                       |
| --------- | ------------------------------------------ |
| id        | いいねの ID                                |
| postId    | どの記事へのいいねか                       |
| clientKey | Cookie / localStorage に保存された識別キー |
| createdAt | いいね日時                                 |

## 4.3 ルール

- 同じ記事に対して、同じ clientKey は一度しかいいねできない
- Post が存在しないと Like は作れない
- 記事が削除されたら、その記事に紐づく Like も削除する

---

# 5. User（管理者）

## 5.1 役割

- narilog を管理する唯一のユーザ
- 管理画面で記事の作成・編集ができる
- 認証は NextAuth により行う

## 5.2 持っている情報

| 項目  | 説明                         |
| ----- | ---------------------------- |
| id    | 管理者 ID                    |
| email | 認証に使用するメールアドレス |
| name  | 名前                         |
| role  | ADMIN 固定                   |

## 5.3 ルール

- role は常に ADMIN
- 一般ユーザは存在しない（MVP では）

---

# 6. 「ひとかたまり」の考え方（Post を中心とした構造）

DDD 用語では “集約” と呼ばれるが、narilog では以下のように理解しておけば OK。

> 💡「Post を中心とした一塊（ひとかたまり）として扱いたい領域」

Post に直接ぶら下がるものはこの一塊に含める：

- Title
- Slug
- Content
- Status
- Like（記事に付いたいいね）

Category は独立したオブジェクトとして存在するが、  
Post が参照するだけなので Post の一部ではない。

---

# 7. Post のライフサイクル

Post は状態が変化する。

```

作成（Draft）
↓ 編集
↓
公開（Published）
↓ さらに編集
↓
再公開（Updated）

```

状態変更のルール：

- Draft → Published は明示的に切り替える
- Published → Draft へ戻す（非公開にする）ことも可能
- 更新時は updatedAt が更新される

---

# 8. 次のステップ（実装への橋渡し）

このドメインモデルをもとに、次の作業に進む：

1. **NestJS のディレクトリ構成（domain / infra / application）を設計する**
2. Post、Category、Like、User のクラス（Entity / ValueObject）を作成
3. Prisma repository を domain に対応させて作成

この順番で書くと、非常に整理された構造になる。

```

post/
domain/
post.entity.ts
value-objects/
title.vo.ts
slug.vo.ts
content.vo.ts
post-status.vo.ts
like.entity.ts
post.repository.ts
application/
post.service.ts
infra/
prisma-post.repository.ts
post.controller.ts

```
