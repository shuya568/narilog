import { Injectable } from '@nestjs/common';
import { Post } from '../domain/post.entity';
import { Title } from '../domain/value-objects/title.vo';
import { Slug } from '../domain/value-objects/slug.vo';
import { Content } from '../domain/value-objects/content.vo';
import {
  PostStatus,
  PostStatusType,
} from '../domain/value-objects/post-status.vo';

@Injectable()
export class PostRepository {
  /**
   * Prismaの1レコードをPost Entityに変換
   */
  private toEntity(record: any): Post {
    return Post.reconstruct({
      id: record.id,
      title: Title.create(record.title),
      slug: Slug.create(record.slug),
      content: Content.create(record.contentMd),
      status:
        record.status === PostStatusType.PUBLISHED
          ? PostStatus.published()
          : PostStatus.draft(),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  /**
   * Post EntityをPrisma用に変換
   */
  private toRecord(post: Post): any {
    return {
      id: post.getId(),
      title: post.getTitle(),
      slug: post.getSlug(),
      contentMd: post.getContent(),
      status: post.getStatus(),
      createdAt: post.getCreatedAt(),
      updatedAt: post.getUpdatedAt(),
    };
  }

  /**
   * 今後実装予定
   */
  async findById(id: string): Promise<Post | null> {
    // TODO: prisma.post.findUnique()
    return null;
  }

  async findAll(): Promise<Post[]> {
    // TODO: prisma.post.findMany()
    return [];
  }

  async save(post: Post): Promise<void> {
    const record = this.toRecord(post);
    // TODO: prisma.post.upsert()
    console.log('Saving post:', record);
  }
}
