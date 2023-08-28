import { IsNotEmpty, IsString, IsArray, IsDateString, Validate, MinLength, MaxLength } from 'class-validator';


export class CreateMovieDto {
    // Movie title, must not be empty, and should be a string
    @IsNotEmpty({ message: 'A movie must have a title' })
    @IsString({ message: 'A movie must have a string title' })
    title: string;

    // Movie description, must not be empty, and should be a string
    @IsNotEmpty({ message: 'A movie must have a description' })
    @IsString({ message: 'A movie must have a string description' })
    @MinLength(10, { message: 'A movie description must be 10 chracters minimum' })
    @MaxLength(150, { message: 'A movie description must be 150 chracters maximum' })
    description: string;

    // Movie release date, must not be empty, and should be a valid date string
    @IsNotEmpty({ message: 'A movie must have a release date' })
    @IsDateString()
    releaseDate: Date;

    // Movie genres, must not be empty and should be an array of strings
    @IsNotEmpty({ message: 'A movie must have at least one genre' })
    @IsArray({ message: 'A movie must have a string array genre' })
    genre: string[];
}
