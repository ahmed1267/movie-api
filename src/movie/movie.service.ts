import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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

    // Find movies with various filtering options
    async findAll(query: any): Promise<Object> {
        try {
            // Initialize pagination parameters
            const params = {
                _limit: 3,
                _offset: 0
            }

            // Extract current page from query
            const currentPage = +(query.page) || 1

            // Update limit and offset if provided in query
            if (query.limit) {
                params._limit = +query.limit;
            }

            if (currentPage > 1) {
                params._offset = ((currentPage - 1) * (params._limit)) || 0;
            }

            // Determine search type
            let type = query.type || null;

            // Validate search type
            if (type !== 'genre' && type !== 'title' && type !== null) {
                throw new BadRequestException('Search type not found!')
            }

            // Initialize searchObject, foundMovies, and totalCount
            let searchObject, foundMoviesPromise, totalCount = 0, foundMovies


            // Handle search by genre
            if (type === 'genre') {
                let genre = await this.findGenresIds([query.keyword]);
                searchObject = {
                    genre: {
                        $in: genre
                    }
                }
                foundMoviesPromise = this.movieModel.find(searchObject)

            }
            // Handle search by title
            else if (type === 'title') {
                searchObject = {
                    title: {
                        $regex: query.keyword,
                        $options: 'i'
                    }
                }
                foundMoviesPromise = this.movieModel.find(searchObject)

            }
            // Handle default case (no search filter)
            else {
                foundMoviesPromise = this.movieModel.find()

            }

            foundMovies = await foundMoviesPromise
                .populate('genre', 'name')
                .limit(params._limit)
                .skip(params._offset)
                .catch(err => {
                    throw new InternalServerErrorException('An unexpected error happened while finding the movies!')
                })

            // Get total count of matching documents
            totalCount = await this.movieModel.find(searchObject).countDocuments()
                .catch(err => {
                    throw new InternalServerErrorException('An unexpected error happened while finding the movie count!')
                })

            return { movies: foundMovies, totalCount: totalCount || 0 } || {};
        } catch (error) {
            if (error instanceof HttpException) throw error
            console.log(error);
            throw new InternalServerErrorException('An unexpected error happened!')

        }

    }

    // Find a movie by its ID
    async find(id: string): Promise<Movie> {
        try {
            const idValid = mongoose.isValidObjectId(id)
            if (!idValid) throw new BadRequestException('Please enter correct Id')

            const foundMovie = await this.movieModel.findById(id)
                .populate(
                    'genre', '-__v'
                )
                .catch(err => {
                    console.log(err);
                    throw new InternalServerErrorException('There is a problem happened while finding the movie!')
                })

            if (!foundMovie) throw new NotFoundException('There is no movie with this id')

            return foundMovie

        } catch (error) {
            if (error instanceof HttpException) throw error
            console.log(error);
            throw new InternalServerErrorException('An unexpected error happened!')
        }
    }

    // Create a new movie
    async create(movie: CreateMovieDto): Promise<HttpException> {
        try {



            let newMovie = await this.movieModel.create(movie)
                .catch(err => {
                    console.log(err);
                    if (err && err.code === 11000) throw new BadRequestException('The title of the movie is duplicate')

                    else throw new InternalServerErrorException('Unexpected error while creating the movie')
                })

            //Checking if the genres in the request already exists
            if (movie.genre && movie.genre.length) {
                let genres = await this.findGenresIds(movie.genre).catch(err => {
                    throw new NotFoundException('The genre you added does not exist')
                })
                movie.genre = genres
            }

            const response = new HttpException(
                {
                    message: 'Movie is added successfully',
                    statusCode: HttpStatus.CREATED,
                },
                HttpStatus.CREATED,
            );

            throw response;

        } catch (error) {
            if (error instanceof HttpException) throw error
            console.log(error);
            throw new InternalServerErrorException('An unexpected error happened!')
        }
    }

    // Update an existing movie
    async update(id: string, update: UpdateMovieDto): Promise<Movie> {
        try {
            const idValid = mongoose.isValidObjectId(id);
            if (!idValid) {
                throw new BadRequestException('Please enter a correct Id');
            }

            if (update.genre && update.genre.length) {
                let genres = await this.findGenresIds(update.genre).catch(err => {
                    console.log(err);
                    throw new NotFoundException('The genre you added does not exist')
                })
                update.genre = genres
            }

            const updatedMovie = await this.movieModel.findByIdAndUpdate(id, { $set: update }, {
                new: true,
                runValidators: true,
            })
                .populate(
                    'genre', '-__v'
                ).catch((err) => {
                    console.log(err)
                    throw new InternalServerErrorException('There is an unexpected error happened while updating the movie!')
                })

            if (!updatedMovie) {
                throw new NotFoundException('There is no movie with this id');
            }

            return updatedMovie;

        } catch (error) {
            if (error instanceof HttpException) throw error
            console.log(error);
            throw new InternalServerErrorException('An unexpected error happened!')
        }
    }

    // Delete a movie by its ID
    async delete(id: string): Promise<Movie> {
        try {
            const idValid = mongoose.isValidObjectId(id)
            if (!idValid) throw new BadRequestException('Please enter correct Id')

            const deletedMovie = await this.movieModel.findByIdAndDelete(id)
                .catch(err => {
                    console.log(err);
                    throw new InternalServerErrorException('An unexpected error happened while deleting the Movie!')
                })

            if (!deletedMovie) throw new NotFoundException('There is no movie with this id')

            return deletedMovie

        } catch (error) {
            if (error instanceof HttpException) throw error
            console.log(error);
            throw new InternalServerErrorException('An unexpected error happened!')
        }
    }

    // Find genre IDs by genre names
    async findGenresIds(names: string[]): Promise<string[]> {
        try {
            let genreNamesRegex = names.map((val) => {
                return new RegExp(val, 'i')
            })

            let genresIds = await this.genreModel.find({
                name: {
                    $in: genreNamesRegex
                }
            })
                .distinct('_id')
                .catch((err) => {
                    console.log(err);

                    throw new InternalServerErrorException('There one or multiple genres not found')
                })

            return genresIds

        } catch (error) {
            if (error instanceof HttpException) throw error
            console.log(error);
            throw new InternalServerErrorException('An unexpected error happened!')
        }
    }
}
