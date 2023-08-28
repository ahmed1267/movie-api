import { BadRequestException, Injectable, InternalServerErrorException, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Movie } from './schemas/movie_schema';
import { Genre } from 'src/genre/schemas/genre_schema';
import * as mongoose from 'mongoose';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { CreateMovieDto } from './dto/create-movie.dto';

@Injectable()
export class MovieService {
    constructor(
        @InjectModel(Movie.name)
        private movieModel: mongoose.Model<Movie>,
        @InjectModel(Genre.name)
        private genreModel: mongoose.Model<Genre>,
    ) { }

    async findAll(query: any): Promise<Object> {

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



        let type = query.type || null;

        if (type !== 'genre' && type !== 'title' && type !== null) {
            throw new BadRequestException('Search type not found!')
        }

        let searchObject, foundMovies, totalCount = 0;

        if (type === 'genre') {
            let genre = await this.findGenresIds([query.keyword]);

            searchObject = {
                genre: {
                    $in: genre
                }
            }

            foundMovies = await this.movieModel.find(searchObject)
                .populate('genre', 'name')
                .limit(params._limit)
                .skip(params._offset);

            totalCount = await this.movieModel.find(searchObject).countDocuments();

        } else if (type === 'title') {

            searchObject = {
                title: {
                    $regex: query.keyword,
                    $options: 'i'
                }
            }

            foundMovies = await this.movieModel
                .find(searchObject)
                .populate('genre', 'name')
                .limit(params._limit)
                .skip(params._offset)

            totalCount = await this.movieModel.find(searchObject).countDocuments();


        } else {

            foundMovies = await this.movieModel
                .find()
                .populate('genre', 'name')
                .limit(params._limit)
                .skip(params._offset)

            totalCount = await this.movieModel.find().countDocuments();

        }

        return { movies: foundMovies, totalCount: totalCount || 0 } || {};
    }




    async create(movie: CreateMovieDto): Promise<Movie> {


        if (movie.genre && movie.genre.length) {


            let genres = await this.findGenresIds(movie.genre).catch(err => {
                throw new NotFoundException('The genre you added does not exisit')
            })

            movie.genre = genres

        }

        const newMovie = await new this.movieModel(movie).save()
            .catch((err) => {
                throw new InternalServerErrorException('Unexpected error while saving the movie')
            })


        return newMovie;

    }


    async find(id: string): Promise<Movie> {
        const idValid = mongoose.isValidObjectId(id)
        if (!idValid) throw new BadRequestException('Please enter correct Id')

        const foundMovie = await this.movieModel.findById(id).populate(
            'genre', '-_id -__v'
        )

        if (!foundMovie) throw new NotFoundException('There is no movie with this id')

        return foundMovie
    }

    async update(id: string, update: UpdateMovieDto): Promise<Movie> {
        const idValid = mongoose.isValidObjectId(id);
        if (!idValid) {
            throw new BadRequestException('Please enter a correct Id');
        }


        if (update.genre && update.genre.length) {

            let genres = await this.findGenresIds(update.genre).catch(err => {
                throw new NotFoundException('The genre you added does not exisit')
            })

            update.genre = genres

        }

        const updatedMovie = await this.movieModel.findByIdAndUpdate(id, { $set: update }, {
            new: true,
            runValidators: true,
        })
            .populate(
                'genre', 'name'
            ).catch((err) => {
                throw new InternalServerErrorException()
            })


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


    async findGenresIds(names: string[]): Promise<string[]> {

        let genreNamesRegex = names.map((val) => {
            return new RegExp(val, 'i')
        })

        let genresIds = await this.genreModel.find({
            name: {
                $in: genreNamesRegex
            }
        }).distinct('_id').catch((err) => {
            throw new InternalServerErrorException('There one or multiple genres not found')
        })

        return genresIds
    }

}