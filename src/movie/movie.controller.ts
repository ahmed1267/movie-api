import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, ValidationPipe } from '@nestjs/common';
import { HttpException, NotFoundException } from '@nestjs/common';
import { post } from 'superagent';
import { MovieService } from './movie.service';
import { Movie } from './schemas/movie_schema';
import { CreateMovieDto } from './dto/create-movie.dto'
import { UpdateMovieDto } from './dto/update-movie.dto';
import { error } from 'console';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { Genre } from 'src/genre/schemas/genre_schema';

@Controller('movies')
export class MovieController {
    constructor(private readonly movieService: MovieService) { }

    @Get()
    async getAllMovies(@Query() query: ExpressQuery): Promise<Object> {
        return await this.movieService.findAll(query);
    }

    @Get(':id')
    async getMovie(@Param('id') id: string
    ): Promise<Movie> {
        return await this.movieService.find(id)
    }

    @Post()
    async createMovie(
        @Body() movie: CreateMovieDto
    ): Promise<Movie> {
        return await this.movieService.create(movie)
    }

    @Put(':id')
    async updateMovie(
        @Param('id') id: string,
        @Body() movie: UpdateMovieDto
    ): Promise<Movie> {
        return await this.movieService.update(id, movie)
    }

    @Delete(':id')
    async deleteMovie(
        @Param('id') id: string
    ): Promise<Movie> {
        return await this.movieService.delete(id)
    }

}
