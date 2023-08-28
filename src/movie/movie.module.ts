import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Movie, MovieSchema } from './schemas/movie_schema';
import { GenreModule } from 'src/genre/genre.module';
import { Genre, GenreSchema } from 'src/genre/schemas/genre_schema';
import { NextFunction } from 'express';


@Module({
  imports: [MongooseModule.forFeature([{
    name: Movie.name, schema: MovieSchema
  }]),
    GenreModule,
  MongooseModule.forFeature([{ name: Genre.name, schema: GenreSchema }])
  ],
  controllers: [MovieController],
  providers: [MovieService]
})
export class MovieModule { }
