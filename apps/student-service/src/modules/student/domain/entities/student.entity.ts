export class Student {
  constructor(
    public readonly id: string,
    public identification: string,
    public firstName: string,
    public lastName: string,
    public email: string,
    public academicProgram: string,
    public isActive: boolean,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}
}
