import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Genre, GenreDocument } from './schemas/genre_schema';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { BadRequestException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
@Injectable()
export class GenreService {
    constructor(
        @InjectModel
            (Genre.name)
        private genreModel: mongoose.Model<Genre>) { }


    async findAll(query: ExpressQuery): Promise<Genre[]> {

        const resultPerPage = 2
        const currentPage = Number(query.page) || 1
        const resultsSkipped = resultPerPage * (currentPage - 1)

        const genres = await this.genreModel
            .find()
            .limit(resultPerPage)
            .skip(resultsSkipped);

        return genres

    }

    async findOrCreateGenre(name: string): Promise<GenreDocument> {
        let genre = await this.genreModel.findOne({
            name: {
                $regex: name,
                $options: 'i'
            }
        }).exec();

        if (!genre) {
            genre = await this.genreModel.create({ name });
        }

        return genre;
    }

    async deleteGenre(id: string) {
        const idValid = mongoose.isValidObjectId(id);
        if (!idValid) {
            throw new BadRequestException('Please enter a correct Id');
        }

        const deletedGenre = await this.genreModel.findByIdAndDelete(id)
    }
}
