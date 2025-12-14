import { Content } from './value-objects/content.vo';
import { PostStatus, PostStatusType } from './value-objects/post-status.vo';
import { Slug } from './value-objects/slug.vo';
import { Title } from './value-objects/title.vo';

export class Post {
  private constructor(
    private readonly id: string,
    private title: Title,
    private slug: Slug,
    private content: Content,
    private status: PostStatus,
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {}

  /**
   * 新規記事を作成する（下書き）
   */
  static createNew(params: {
    id: string;
    title: Title;
    slug: Slug;
    content: Content;
  }): Post {
    const now = new Date();

    return new Post(
      params.id,
      params.title,
      params.slug,
      params.content,
      PostStatus.draft(),
      now,
      now,
    );
  }

  /**
   * 保存済みの記事を開く
   */
  static reconstruct(params: {
    id: string;
    title: Title;
    slug: Slug;
    content: Content;
    status: PostStatus;
    createdAt: Date;
    updatedAt: Date;
  }): Post {
    return new Post(
      params.id,
      params.title,
      params.slug,
      params.content,
      params.status,
      params.createdAt,
      params.updatedAt,
    );
  }

  /**
   * 公開する
   */
  publish(): void {
    if (this.status.isPublished()) {
      return;
    }

    this.status = PostStatus.published();
    this.updatedAt = new Date();
  }

  /**
   * 非公開（下書きに戻す）
   */
  unpublish(): void {
    if (this.status.isDraft()) {
      return;
    }

    this.status = PostStatus.published();
    this.updatedAt = new Date();
  }

  /**
   * 記事内容を更新する
   */
  updateContent(params: { title: Title; slug: Slug; content: Content }): void {
    this.title = params.title;
    this.slug = params.slug;
    this.content = params.content;
    this.updatedAt = new Date();
  }

  // ==== Getter ====
  getId(): string {
    return this.id;
  }

  getTitle(): string {
    return this.title.raw;
  }

  getSlug(): string {
    return this.slug.raw;
  }

  getContent(): string {
    return this.content.raw;
  }

  getStatus(): string {
    return this.status.raw;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }
}
