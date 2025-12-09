# narilog – Prisma v7 導入マニュアル（PostgreSQL）

本ドキュメントは narilog プロジェクトで Prisma v7 を利用するための  
**前提条件 → インストール → 設定 → PrismaClient 初期化** をまとめたもの。

Prisma v7 では、従来の `schema.prisma` 単体管理ではなく  
**`prisma.config.ts` の追加・driver adapter の導入** が必要になる。

---

## 📌 1. 前提条件

narilog プロジェクトでは以下を前提とする：

- Node.js 18 以上
- Next.js（フロントエンド）
- NestJS（バックエンド API）
- PostgreSQL（Cloud SQL / ローカルどちらでも可）

環境変数として以下を設定：

```env
DATABASE_URL="postgresql://user:password@localhost:5432/narilog"
```

---

## 📦 2. Prisma v7 のインストール

Prisma v7 では core パッケージと CLI が分離されている。

### インストールコマンド

```bash
# Prisma core と CLI
npm install prisma
npm install -D prisma

# Prisma Client
npm install @prisma/client

# PostgreSQL ドライバアダプタ
npm install @prisma/adapter-pg pg
```

---

## 📁 3. プロジェクト構成（初期）

```
prisma/
  ├─ prisma.config.ts
  ├─ schema.prisma
src/
  └─ lib/
       └─ prisma.ts
```

---

## ⚙️ 4. prisma.config.ts の作成

Prisma v7 からは **このファイルが必須に近い扱い**。

```ts
// prisma/prisma.config.ts
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: {
    // DATABASE_URL は .env から参照される
    url: env("DATABASE_URL"),
  },
});
```

---

## 📄 5. schema.prisma の作成

`generator client` の provider 名が変更されている点に注意。

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// --------------
//  User (admin)
// --------------
model User {
  id        String   @id @default(cuid())
  name      String?
  email     String   @unique
  role      UserRole @default(ADMIN)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  posts Post[]
}

enum UserRole {
  ADMIN
}

// --------------
//  Category
// --------------
model Category {
  id    String  @id @default(cuid())
  name  String  @unique
  posts Post[]
}

// --------------
//  Post
// --------------
model Post {
  id         String      @id @default(cuid())
  title      String
  slug       String      @unique
  contentMd  String
  contentHtml String?
  status     PostStatus  @default(DRAFT)
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt

  categoryId String?
  category   Category?   @relation(fields: [categoryId], references: [id])

  likes Like[]
}

enum PostStatus {
  DRAFT
  PUBLISHED
}

// --------------
//  Like (anonymous reaction)
// --------------
model Like {
  id        String   @id @default(cuid())
  postId    String
  clientKey String
  createdAt DateTime @default(now())

  post Post @relation(fields: [postId], references: [id])

  @@unique([postId, clientKey])
}
```

---

## 🏗 6. Prisma Client 初期化（PostgreSQL 用）

Prisma v7 の PrismaClient は、
**driver adapter を指定して生成する必要がある**。

```ts
// src/lib/prisma.ts
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({
  adapter,
  log: ["query", "warn", "error"],
});
```

---

## 🧪 7. 動作確認（Migrate）

```bash
npx prisma migrate dev --name init
```

成功すれば、`narilog` の DB スキーマが出来上がる。

---

## 🚀 8. Prisma Client の使い方（NestJS / Next.js）

### Next.js の場合：

```ts
import { prisma } from "@/lib/prisma";

export async function getAllPosts() {
  return prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
  });
}
```

### NestJS の場合：

NestJS module 内でプリインスタンスを使用。

```ts
import { prisma } from "@/lib/prisma";

@Injectable()
export class PostRepository {
  findAll() {
    return prisma.post.findMany();
  }
}
```
