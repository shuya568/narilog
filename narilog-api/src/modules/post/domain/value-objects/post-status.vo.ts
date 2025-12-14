export enum PostStatusType {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

export class PostStatus {
  private constructor(private readonly value: PostStatusType) {}

  static draft(): PostStatus {
    return new PostStatus(PostStatusType.DRAFT);
  }

  static published(): PostStatus {
    return new PostStatus(PostStatusType.PUBLISHED);
  }

  isDraft(): boolean {
    return this.value === PostStatusType.DRAFT;
  }

  isPublished(): boolean {
    return this.value === PostStatusType.PUBLISHED;
  }

  get raw(): PostStatusType {
    return this.value;
  }
}
