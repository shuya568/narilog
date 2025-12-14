import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PostService } from './post.service';
import { title } from 'process';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  /**
   * 記事新規作成（下書き）
   */
  @Post()
  async createDraft(
    @Body() body: { title: string; slug: string; content: string },
  ) {
    return this.postService.createDraft(body);
  }

  /**
   * 公開
   */
  @Post(':id/publish')
  async publish(@Param('id') id: string) {
    await this.postService.publish(id);
    return { message: 'Published' };
  }

  /**
   * 一覧取得
   */
  @Get()
  async findAll() {
    const posts = await this.postService.findAll();

    return posts.map((p) => ({
      id: p.getId(),
      title: p.getTitle(),
      slug: p.getSlug(),
      content: p.getContent(),
      status: p.getStatus(),
      createdAt: p.getCreatedAt(),
      updatedAt: p.getUpdatedAt(),
    }));
  }
}
