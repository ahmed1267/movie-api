import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, ValidationPipe } from '@nestjs/common';
import { GenreService } from './genre.service';
import { Query as ExpressQuery } from 'express-serve-static-core'
import { Genre } from './schemas/genre_schema';


@Controller('genres')
export class GenreController {
  constructor(private readonly genreService: GenreService) { }

  @Get()
  async getAllGenres(@Query() query: ExpressQuery): Promise<Object> {
    return await this.genreService.findAll(query);
  }


  @Post()
  async createGenre(@Body('name') genreName: string): Promise<Genre> {
    const genre = await this.genreService.create(genreName);
    return genre;
  }

  @Delete(':id')
  async deleteGenreById(@Param('id') id: string): Promise<Genre> {

    return await this.deleteGenreById(id)
  }
}
