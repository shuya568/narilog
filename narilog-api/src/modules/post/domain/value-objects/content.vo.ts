export class Content {
  private constructor(private readonly markdwon: string) {}

  static create(markdown: string): Content {
    if (!markdown || markdown.trim().length === 0) {
      throw new Error('Content must not empty');
    }

    return new Content(markdown);
  }

  get raw(): string {
    return this.markdwon;
  }
}
