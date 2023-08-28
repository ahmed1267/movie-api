import { Body, Controller, Delete, Get, Param, UsePipes, Post, Query, ValidationPipe } from '@nestjs/common';
import { GenreService } from './genre.service';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { Genre } from './schemas/genre_schema';
import { CreateGenreDto } from './dto/create-genre.dto';

@Controller('genres')
export class GenreController {
  constructor(private readonly genreService: GenreService) { } // Inject GenreService

  @Get()
  async getAllGenres(
    @Query() query: ExpressQuery
  ): Promise<Object> {
    return await this.genreService.findAll(query); // Call service to get all genres
  }

  @Get(':id')
  async getGenre(
    @Param('id') id: string,
    @Query() query: ExpressQuery
  ): Promise<Object> {
    return await this.genreService.findGenreById(id); // Call service to get a single genre by ID
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createGenre(
    @Body() genre: CreateGenreDto
  ): Promise<Genre> {
    const genreCreated = await this.genreService.create(genre); // Call service to create a genre
    return genreCreated;
  }

  @Delete(':id')
  async deleteGenreById(
    @Param('id') id: string
  ): Promise<Genre> {
    return await this.genreService.deleteGenre(id); // Call service to delete a genre by ID
  }
}
