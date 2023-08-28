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


    async findAll(query: ExpressQuery): Promise<Object> {

        const params = {
            _limit: 3,
            _offset: 0
        }

        const currentPage = +(query.page) || 1

        if (query.limit) {
            params._limit = +query.limit;
        }

        if (currentPage > 1) {
            params._offset = ((currentPage - 1) * (+query.limit)) || 0;

        }

        const genres = await this.genreModel
            .find()
            .limit(params._limit)
            .skip(params._offset);

        const totalCount = await this.genreModel.find().countDocuments();

        return { genres: genres, totalCount: totalCount || 0 } || {};

    }

    async findGenreById(id: string): Promise<GenreDocument> {

        const idValid = mongoose.isValidObjectId(id)
        if (!idValid) throw new BadRequestException('Please enter correct Id')

        let genre = await this.genreModel.findById(id)

        if (!genre) throw new NotFoundException('There is no genre with this id')
        return genre
    }

    async findGenreByName(genreName: string): Promise<Genre> {


        let genre = await this.genreModel.findOne({
            name: {
                $regex: genreName,
                $options: 'i'
            }
        }).lean().exec();

        return genre;
    }

    async createGenre(name: string): Promise<GenreDocument> {

        const genre = await this.genreModel.create({ name }).catch(err => {
            throw err
        })
        return genre

    }

    async deleteGenre(id: string) {
        const idValid = mongoose.isValidObjectId(id);
        if (!idValid) {
            throw new BadRequestException('Please enter a correct Id');
        }

        const deletedGenre = await this.genreModel.findByIdAndDelete(id)
    }
}
