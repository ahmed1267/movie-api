import { Body, Controller, Delete, Get, Param, UsePipes, Post, Put, Query, ValidationPipe, HttpException } from '@nestjs/common';
import { MovieService } from './movie.service';
import { Movie } from './schemas/movie_schema';
import { CreateMovieDto } from './dto/create-movie.dto'
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Controller('movies')
export class MovieController {
    constructor(private readonly movieService: MovieService) { }

    // Get all movies with optional query parameters
    @Get()
    async getAllMovies(@Query() query: ExpressQuery): Promise<Object> {
        return await this.movieService.findAll(query);
    }

    // Get a single movie by its ID
    @Get(':id')
    async getMovie(
        @Param('id') id: string
    ): Promise<Movie> {
        return await this.movieService.find(id)
    }

    // Create a new movie
    @Post()
    @UsePipes(ValidationPipe)
    async createMovie(
        @Body() movie: CreateMovieDto
    ): Promise<HttpException> {
        return await this.movieService.create(movie)
    }

    // Update an existing movie by its ID
    @Put(':id')
    @UsePipes(ValidationPipe)
    async updateMovie(
        @Param('id') id: string,
        @Body() movie: UpdateMovieDto
    ): Promise<Movie> {
        return await this.movieService.update(id, movie)
    }

    // Delete a movie by its ID
    @Delete(':id')
    async deleteMovie(
        @Param('id') id: string
    ): Promise<Movie> {
        return await this.movieService.delete(id)
    }
}
