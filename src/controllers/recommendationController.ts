import { Request,Response} from "express";
import { date, z } from "zod";
import { fromZodError } from "zod-validation-error"

import { db } from "../utils/db.server";
import {MovieGenreEnum} from"./userController"




const movieSchema  = z.object({
    title:z.string(),
    description:z.string(),
    release_year:z.string()
    .transform((str) => new Date(str)),
    genders: z.array(MovieGenreEnum).nonempty("At least one genre must be selected") 
   
})

interface MovieRecommendations {
    [movieId: string]: number;
  }



export const recommendation =  async(req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        //  Obtendo o usuário e seus gêneros favoritos
        const user = await db.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                genders: true,  
                movies: true    
            }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const favoriteGenres = user.genders.map((gender) => gender.id);

        //  buscando usuários com gêneros semelhantes 
        const similarUsers = await db.user.findMany({
            where: {
                AND: [
                    { id: { not: userId } },  
                    { genders: { some: { id: { in: favoriteGenres } } } },  
                ]
            },
            include: {
                movies: true,  
                genders: true, 
            }
        });

        if (similarUsers.length === 0) {
            return res.status(200).json({ message: "No similar users found", data: [] });
        }

       
       
        
        const movieRecommendations: MovieRecommendations = {};

        // calculando a similaridade com outro usuarios 
        similarUsers.forEach((similarUser) => {
            const sharedGenres = similarUser.genders.filter((g) => favoriteGenres.includes(g.id)).length;
            const similarityScore = sharedGenres / favoriteGenres.length;

            // Adicionando filmes favoritos dos usuários similares à recomendação
            similarUser.movies.forEach((movie) => {
                if (!user.movies.some((userMovie) => userMovie.id === movie.id)) {  // Excluindo filmes já assistidos nesse caso ja favoritados "like" pelo usuário
                    if (!movieRecommendations[movie.id]) {
                        movieRecommendations[movie.id] = 0;
                    }
                    // Aumenta a pontuação do filme com base na similaridade de generos de filme do corrente usuario similar tem com usuario que tem o seu id passado como parametro
                    movieRecommendations[movie.id] += similarityScore;  
                }
            });
        });

        // Classificando os filmes recomendados por pontuação (do maior para o menor)
        const rankedMovies = Object.entries(movieRecommendations)
            .sort((a, b) => b[1] - a[1]) 
            .map(([movieId]) => movieId);

        // Obtendo os  filmes recomendados
        const recommendedMovies = await db.movie.findMany({
            where: { id: { in: rankedMovies } },
        });

        return res.status(200).json({
            message: "Recommendations found",
            data: recommendedMovies,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
