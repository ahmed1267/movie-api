import { PartialType } from '@nestjs/mapped-types';
import { CreateMovieDto } from './create-movie.dto';
import { Genre } from 'src/genre/schemas/genre_schema';
import { IsString, IsOptional, IsDate, IsEnum } from 'class-validator'

export class UpdateMovieDto extends PartialType(CreateMovieDto) {
    genre?: string;
}
