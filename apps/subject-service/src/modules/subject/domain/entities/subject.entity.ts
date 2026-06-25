export class Subject {
  constructor(
    public readonly id: string,
    public code: string,
    public name: string,
    public credits: number,
    public academicLevel: number,
    public isActive: boolean,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}
}
