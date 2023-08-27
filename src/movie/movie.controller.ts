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
    async getAllMovies(@Query() query: ExpressQuery): Promise<Movie[]> {
        return await this.movieService.findAll(query);
    }

    @Get(':id')
    async getMovie(@Param('id') id: string
    ): Promise<Movie> {
        return await this.movieService.find(id)
    }

    @Post()
    async createMovie(
        @Body('title') title: string,
        @Body('description') description: string,
        @Body('releaseDate') releaseDate: Date,
        @Body('genre') genre: string,
    ): Promise<Movie> {
        return await this.movieService.create(title, description, releaseDate, genre)
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
    // @Get()
    // getMovieByGenre(@Query('genre') genre: 'drama' | 'adventure') {
    //     return this.movieService.getMovieByGenre(genre);
    // }

    // @Get(':id')
    // getOneMovie(@Param('id', ParseIntPipe) id: number) {
    //     try {
    //         return this.movieService.getOneMovie(id);

    //     } catch (error) {
    //         throw new NotFoundException('Doesnot exist');
    //     }
    // }

    // @Get('genres')
    // getGenres() {
    //     return this.movieService.getGenres()
    // }

    // @Post()
    // createMovie(@Body(new ValidationPipe()) createMovieDto: CreateMovieDto) {
    //     return this.movieService.createMovie(createMovieDto)
    // }

    // @Put(':id')
    // updateMovie(@Param('id', ParseIntPipe) id: number, @Body() updateMovieDto: UpdateMovieDto) {
    //     return this.movieService.updateMovie(id, updateMovieDto)
    // }

    // @Delete(':id')
    // deleteMovie(@Param('id', ParseIntPipe) id: number) {
    //     return this.movieService.removeMovie(id)
    // }

}
