import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Genre, GenreDocument } from './schemas/genre_schema';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, HttpException } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';

@Injectable()
export class GenreService {
    constructor(
        @InjectModel(Genre.name)
        private genreModel: mongoose.Model<Genre>
    ) { } // Inject GenreModel

    //Find all genres
    async findAll(query: ExpressQuery): Promise<Object> {
        try {
            // Set pagination parameters
            const params = {
                _limit: 3,
                _offset: 0
            }

            const currentPage = +(query.page) || 1

            if (query.limit) {
                params._limit = +query.limit;
            }

            if (currentPage > 1) {
                params._offset = ((currentPage - 1) * (params._limit)) || 0;
            }

            // Find genres with pagination
            const genres = await this.genreModel
                .find()
                .limit(params._limit)
                .skip(params._offset)
                .catch(err => {
                    throw new InternalServerErrorException('An unexpected error happened while finding the Genre!')
                })

            // Count total genres
            const totalCount = await this.genreModel.find().countDocuments()
                .catch(err => {
                    throw new InternalServerErrorException('An unexpected error happened while finding the genre count!')
                })

            return { genres: genres, totalCount: totalCount || 0 } || {};

        } catch (error) {
            if (error instanceof HttpException) throw error
            console.log(error);
            throw new InternalServerErrorException('An unexpected error happened!')
        }
    }

    //Find genre by ID
    async findGenreById(id: string): Promise<GenreDocument> {
        try {
            // Validate ID
            const idValid = mongoose.isValidObjectId(id)
            if (!idValid) throw new BadRequestException('Please enter correct Id')

            // Find genre by ID
            let genre = await this.genreModel.findById(id)
                .catch(err => {
                    throw new InternalServerErrorException('An unexpected error happened while finding the Genre!')
                })

            if (!genre) throw new NotFoundException('There is no genre with this id')

            return genre;

        } catch (error) {
            if (error instanceof HttpException) throw error
            console.log(error);
            throw new InternalServerErrorException('An unexpected error happened!')
        }
    }

    // Create and save new genre
    async create(genre: CreateGenreDto): Promise<Genre> {
        try {
            const newGenre = await new this.genreModel(genre).save()
                .catch(err => {
                    if (err && err.code === 11000) throw new BadRequestException('The name of the genre is duplicate')

                    else throw new InternalServerErrorException('An unexpected error happened while creating the Genre!')
                })

            return newGenre;

        } catch (error) {
            if (error instanceof HttpException) throw error
            console.log(error);
            throw new InternalServerErrorException('An unexpected error happened!')
        }
    }

    //Delete genre by ID
    async deleteGenre(id: string): Promise<Genre> {
        try {
            // Validate ID
            const idValid = mongoose.isValidObjectId(id);
            if (!idValid) {
                throw new BadRequestException('Please enter a correct Id');
            }

            // Find and delete genre by ID
            const deletedGenre = await this.genreModel.findByIdAndDelete(id)
                .catch(err => {
                    throw new InternalServerErrorException('An unexpected error happened while deleting the Genre!')
                })

            if (!deletedGenre) throw new NotFoundException('There is no genre with this id')

            return deletedGenre;

        } catch (error) {
            if (error instanceof HttpException) throw error
            console.log(error);
            throw new InternalServerErrorException('An unexpected error happened!')
        }
    }

}
