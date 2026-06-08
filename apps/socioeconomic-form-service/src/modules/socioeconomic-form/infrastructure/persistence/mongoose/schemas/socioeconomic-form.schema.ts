import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SocioeconomicFormDocument = HydratedDocument<SocioeconomicFormSchema>;

@Schema({ collection: 'socioeconomic_forms', timestamps: true })
export class SocioeconomicFormSchema {
  @Prop({ type: String })
  _id!: string;

  @Prop({ required: true, unique: true })
  studentId!: string;

  @Prop({ required: true })
  familyIncome!: number;

  @Prop({ required: true })
  housingType!: string;

  @Prop({ required: true })
  familyMembers!: number;

  @Prop({ required: true })
  employmentStatus!: string;

  @Prop({ required: true })
  vulnerabilityFactors!: string;

  @Prop({ required: true })
  observations!: string;

  createdAt!: Date;
  updatedAt!: Date;
}

export const SocioeconomicFormMongooseSchema =
  SchemaFactory.createForClass(SocioeconomicFormSchema);
