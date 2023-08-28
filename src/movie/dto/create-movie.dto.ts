import { IsNotEmpty, IsString, IsDate, IsEnum } from 'class-validator'
import { Genre } from 'src/genre/schemas/genre_schema'

export class CreateMovieDto {
    @IsNotEmpty()
    @IsString()
    title: string

    @IsNotEmpty()
    @IsString()
    description: string

    @IsNotEmpty()
    @IsDate()
    releaseDate: Date

    @IsNotEmpty()
    // @IsString()
    genre: string[]
}
