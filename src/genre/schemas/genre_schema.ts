import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Define a type for the Genre document
export type GenreDocument = Genre & Document;

// Create the schema for the Genre document
@Schema()
export class Genre {
    // Define a property with required and unique constraints
    @Prop({ required: true, unique: true })
    name: string;
}

// Create the Genre schema using the schema factory
export const GenreSchema = SchemaFactory.createForClass(Genre);
