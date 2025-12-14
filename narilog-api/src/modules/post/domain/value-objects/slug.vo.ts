export class Slug {
  private constructor(private readonly value: string) {}

  static create(value: string): Slug {
    if (!value || value.trim().length === 0) {
      throw new Error('Slug must not be empty');
    }

    // Allows characters: alsphanumeric characters and hyphen
    const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugPattern.test(value)) {
      throw new Error(
        'Slug must contain only lowercase letters, numbers, and hyphens',
      );
    }

    return new Slug(value);
  }

  get raw(): string {
    return this.value;
  }
}
