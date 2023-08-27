import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, SchemaTypes } from "mongoose";
import { type } from "os";
import { Genre } from "src/genre/schemas/genre_schema";
import { NextFunction, Request, Response } from 'express';
import * as mongoose from 'mongoose'
import mongooseAutoPopulate from "mongoose-autopopulate";

export type MovieDocument = Movie & Document

@Schema({
    timestamps: true,
})
export class Movie {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    releaseDate: Date;

    @Prop({ type: SchemaTypes.ObjectId, mongooseAutoPopulate: true, ref: 'Genre', required: true })
    genre: Genre;


}

export const MovieSchema = SchemaFactory.createForClass(Movie)

// import mongoose from 'mongoose';

// import { Movie } from 'src/interface/movie.interface';


// const MovieSchema = new mongoose.Schema({

//     title: {
//         type: String,
//         required: [true, 'A movie must have a name!'],
//         unique: true,
//         maxlength: [50, 'A movie name cannot be longer than 50 characters']
//     },
//     releaseDate: {
//         type: Date,
//         required: [true, 'A movie must have a date']
//     },
//     genre:
//     {
//         type: mongoose.Schema.Types.ObjectId,
//         autopopulate: true,
//         ref: 'Genre'
//     }
//     ,
//     describtion: {
//         type: String,
//         minlength: [10, 'A movie name cannot be less than 10 characters']
//     }
// },
//     {
//         toJSON: { virtuals: true },
//         toObject: { virtuals: true },
//         id: false
//     })


// // MovieSchema.pre(/^find/, function (next) {
// //     this.populate({
// //         path: 'genre',
// //         select: '-__v -_id'

// //     });

// //     next();
// // });
// const autopopulate = require('mongoose-autopopulate')
// MovieSchema.plugin(autopopulate);

// const MovieModel = mongoose.model<Movie>('movie', MovieSchema);

// export { MovieSchema, MovieModel };