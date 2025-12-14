export class Title {
  private constructor(private readonly value: string) {}

  static create(value: string): Title {
    if (!value || value.trim().length === 0) {
      throw new Error('Title must not be empty');
    }

    if (value.length > 100) {
      throw new Error('Title must be 100 characters or less');
    }

    return new Title(value);
  }

  get raw(): string {
    return this.value;
  }
}
