// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { NextFunction, Request, Response } from 'express';
// import { Model } from 'mongoose';
// import { Movie, MovieDocument } from 'src/movie/schemas/movie_schema';

// @Injectable()
// export class PopulateGenreMiddleware implements NestMiddleware {
//     constructor(
//         @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
//     ) { }

//     async use(req: Request, res: Response, next: NextFunction) {
//         // Intercept response and populate genre field
//         res.locals.data = await this.populateGenreField(res.locals.data);

//         next();
//     }

//     async populateGenreField(movies: MovieDocument[]): Promise<MovieDocument[]> {
//         const populatedMovies = [];

//         for (const movie of movies) {
//             const populatedMovie = await movie.populate('genre');
//             populatedMovies.push(populatedMovie);
//         }

//         return populatedMovies;
//     }
// }
