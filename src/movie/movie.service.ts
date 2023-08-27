import { BadRequestException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { create } from 'domain';
import { InjectModel } from '@nestjs/mongoose';
import { Movie, MovieDocument } from './schemas/movie_schema';
import { Genre, GenreDocument } from 'src/genre/schemas/genre_schema';
import * as mongoose from 'mongoose';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { GenreService } from '../genre/genre.service'
import { ObjectId } from 'mongoose';
@Injectable()
export class MovieService {
    constructor(
        @InjectModel(Movie.name)
        private movieModel: mongoose.Model<Movie>,
        @InjectModel(Genre.name)
        private genreModel: mongoose.Model<Genre>,
        private readonly genreService: GenreService,
    ) { }

    async findAll(query: ExpressQuery): Promise<Movie[]> {

        const resultPerPage = 2
        const currentPage = Number(query.page) || 1
        const resultsSkipped = resultPerPage * (currentPage - 1)

        let keyword = query.keyword ? {

            $or: [
                {
                    title: {
                        $regex: query.keyword,
                        $options: 'i'
                    }
                },
                {
                    genre: {
                        $regex: query.keyword,
                        $options: 'i'
                    }
                },
            ],

        } : {}
        // let keyword = query.keyword ? query.keyword.toString().toLowerCase() : {}


        // const foundMovies = await this.movieModel.find({}).populate({
        //     path: 'genre', name: {

        //     }
        // })


        const foundMovies = await this.movieModel
            .find({ ...keyword })
            .limit(resultPerPage)
            .skip(resultsSkipped)

        console.log(foundMovies[0].genre)
        return foundMovies
    }

    async isDuplicateMovie(title: string): Promise<boolean> {
        const existingMovie = await this.movieModel.findOne({ title }).exec();
        return !!existingMovie;
    }



    async create(title: string, description: string, releaseDate: Date, genreName: string): Promise<Movie> {

        const isDuplicate = await this.isDuplicateMovie(title);

        let genre = await this.genreModel.findOne({ name: genreName }).exec();

        if (!genre) {
            genre = await this.genreModel.create({ name: genreName });
        }

        if (isDuplicate) {
            throw new NotAcceptableException('A movie with the same title already exists.');
        }

        const createdMovie = await this.movieModel.create({
            title,
            description,
            releaseDate,
            genre
        })
        return createdMovie
    }

    async find(id: string): Promise<Movie> {
        const idValid = mongoose.isValidObjectId(id)
        if (!idValid) throw new BadRequestException('Please enter correct Id')

        const foundMovie = await this.movieModel.findById(id)

        if (!foundMovie) throw new NotFoundException('There is no movie with this id')
        return foundMovie
    }

    async update(id: string, updateMovieDto: UpdateMovieDto): Promise<Movie> {
        const idValid = mongoose.isValidObjectId(id);
        if (!idValid) {
            throw new BadRequestException('Please enter a correct Id');
        }


        if (updateMovieDto.genre) {

            let genre = await this.genreService.findOrCreateGenre(updateMovieDto.genre)


            updateMovieDto.genre = genre._id.toString();

        }

        const updatedMovie = await this.movieModel.findByIdAndUpdate(id, updateMovieDto, {
            new: true,
            runValidators: true,
        })
            .populate(
                'genre', '-_id -__v'
            )

        if (!updatedMovie) {
            throw new NotFoundException('There is no movie with this id');
        }



        return updatedMovie;
    }



    async delete(id: string): Promise<Movie> {
        const idValid = mongoose.isValidObjectId(id)
        if (!idValid) throw new BadRequestException('Please enter correct Id')

        const deletedMovie = await this.movieModel.findByIdAndDelete(id)

        if (!deletedMovie) throw new NotFoundException('There is no movie with this id')
        return deletedMovie

    }




}