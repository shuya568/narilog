import { Injectable } from '@nestjs/common';
import { PostRepository } from './infra/post.repository';
import { Post } from './domain/post.entity';
import { randomUUID } from 'crypto';
import { Title } from './domain/value-objects/title.vo';
import { Slug } from './domain/value-objects/slug.vo';
import { Content } from './domain/value-objects/content.vo';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  /**
   * 記事を新規作成（下書き）
   */
  async createDraft(params: {
    title: string;
    slug: string;
    content: string;
  }): Promise<Post> {
    const post = Post.createNew({
      id: randomUUID(),
      title: Title.create(params.title),
      slug: Slug.create(params.slug),
      content: Content.create(params.content),
    });

    await this.postRepository.save(post);
    return post;
  }

  /**
   * 記事を公開する
   */
  async publish(postId: string): Promise<void> {
    const post = await this.postRepository.findById(postId);

    if (!post) {
      throw new Error('Post Not Found');
    }

    post.publish();
    await this.postRepository.save(post);
  }

  /**
   * 記事一覧を取得する
   */
  async findAll(): Promise<Post[]> {
    return await this.postRepository.findAll();
  }
}
