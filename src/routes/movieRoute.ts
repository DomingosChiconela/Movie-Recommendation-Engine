
import  express from "express"

import { createMovie,getAllMovies,getMovie,deleteMovie} from "../controllers/movieController"
import { AuthMiddleware } from "../middlewares/authMiddleware"




export const  movieRoute =  express.Router()


movieRoute.post("/",AuthMiddleware,createMovie)
movieRoute.get("/",AuthMiddleware,getAllMovies)
movieRoute.get("/:id",AuthMiddleware,getMovie)
movieRoute.delete("/:id",AuthMiddleware,deleteMovie)

