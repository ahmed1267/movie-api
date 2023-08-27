import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, ValidationPipe } from '@nestjs/common';
import { GenreService } from './genre.service';
import { Query as ExpressQuery } from 'express-serve-static-core'
import { Genre } from './schemas/genre_schema';


@Controller('genres')
export class GenreController {
  constructor(private readonly genreService: GenreService) { }

  @Get()
  async getAllGenres(@Query() query: ExpressQuery): Promise<Genre[]> {
    return await this.genreService.findAll(query);
  }


  @Post()
  async createOrFindGenre(@Body('name') name: string): Promise<Genre> {
    const genre = await this.genreService.findOrCreateGenre(name);
    return genre;
  }

  @Delete(':id')
  async deleteGenreById(@Param('id') id: string): Promise<Genre> {

    return await this.deleteGenreById(id)
  }
}
