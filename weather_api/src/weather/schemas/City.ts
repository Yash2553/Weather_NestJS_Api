import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type CityDocument = City & Document

@Schema()
export class City{
    @Prop({unique: true})
    city: string;

 }

export const CitySchema = SchemaFactory.createForClass(City);
