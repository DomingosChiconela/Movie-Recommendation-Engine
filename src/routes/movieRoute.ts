
import  express from "express"

import { createMovie} from "../controllers/movieController"
import { AuthMiddleware } from "../middlewares/authMiddleware"




export const  movieRoute =  express.Router()


movieRoute.post("/",AuthMiddleware,createMovie)

