import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Movie } from 'src/movie/schemas/movie_schema';

export type GenreDocument = Genre & Document;

@Schema()
export class Genre {
    @Prop({ required: true, unique: true })
    name: string;


}

export const GenreSchema = SchemaFactory.createForClass(Genre);
