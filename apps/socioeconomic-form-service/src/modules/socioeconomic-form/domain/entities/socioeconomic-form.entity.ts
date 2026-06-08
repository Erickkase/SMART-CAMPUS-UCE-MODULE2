export class SocioeconomicForm {
  constructor(
    public readonly id: string,
    public readonly studentId: string,
    public familyIncome: number,
    public housingType: string,
    public familyMembers: number,
    public employmentStatus: string,
    public vulnerabilityFactors: string,
    public observations: string,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}
}
