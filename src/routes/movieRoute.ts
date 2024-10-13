
import  express from "express"

import { createMovie,getAllMovies,getMovie,deleteMovie,likeMovie} from "../controllers/movieController"
import { AuthMiddleware } from "../middlewares/authMiddleware"




export const  movieRoute =  express.Router()


movieRoute.post("/",AuthMiddleware,createMovie)
movieRoute.get("/",AuthMiddleware,getAllMovies)
movieRoute.get("/:id",AuthMiddleware,getMovie)
movieRoute.delete("/:id",AuthMiddleware,deleteMovie)
movieRoute.post("/likemovie/:id",AuthMiddleware,likeMovie)

