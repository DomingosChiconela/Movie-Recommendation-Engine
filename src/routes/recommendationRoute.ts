
import  express from "express"

import {recommendation} from "../controllers/recommendationController"
import { AuthMiddleware } from "../middlewares/authMiddleware"




export const  recommendationRoute =  express.Router()


recommendationRoute.get("/:userId",recommendation)

