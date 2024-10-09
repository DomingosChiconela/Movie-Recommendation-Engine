
import  express from "express"

import { register} from "../controllers/userController"




export const  userRoute =  express.Router()


userRoute.post("/",register)


