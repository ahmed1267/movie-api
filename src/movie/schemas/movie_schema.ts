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
    @Prop({ required: true, unique: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    releaseDate: Date;

    @Prop({ type: [SchemaTypes.ObjectId], ref: 'Genre', required: true })
    genre: string[];



}

export const MovieSchema = SchemaFactory.createForClass(Movie)

