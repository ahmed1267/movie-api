import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

// DTO class to create a new genre
export class CreateGenreDto {
    @IsNotEmpty({ message: 'A genre must have a name' }) // Name is required
    @IsString({ message: 'A genre must have a string name' }) // Name must be a string
    @MaxLength(15, { message: 'The max length for the genre name is 15' })
    @MinLength(3, { message: 'The minimum length for the genre name is 3' })
    name: string // The name of the genre
}
