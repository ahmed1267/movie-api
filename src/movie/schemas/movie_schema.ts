import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, SchemaTypes } from "mongoose";

// Define the document type for the movie schema
export type MovieDocument = Movie & Document

// Define the movie schema
@Schema({
    timestamps: true, // Add timestamps for createdAt and updatedAt
})
export class Movie {
    @Prop({ required: true, unique: true }) // Ensure title is required and unique
    title: string;

    @Prop({ required: true }) // Ensure description is required
    description: string;

    @Prop({ required: true }) // Ensure releaseDate is required
    releaseDate: Date;

    @Prop({ type: [SchemaTypes.ObjectId], ref: 'Genre', required: true }) // Array of genre IDs, reference to Genre schema
    genre: string[]; // Array of genre IDs


}

// Create the Mongoose schema for the Movie class
export const MovieSchema = SchemaFactory.createForClass(Movie)
