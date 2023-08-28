import { IsNotEmpty, IsString } from 'class-validator'

// DTO class to create a new genre
export class CreateGenreDto {
    @IsNotEmpty({ message: 'A genre must have a name' }) // Name is required
    @IsString({ message: 'A genre must have a string name' }) // Name must be a string
    name: string // The name of the genre
}
