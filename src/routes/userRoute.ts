
import  express from "express"

import { register,updateUser,login,getUser} from "../controllers/userController"
import { AuthMiddleware } from "../middlewares/authMiddleware"




export const  userRoute =  express.Router()


userRoute.post("/",register)
userRoute.post("/login",login)
userRoute.put("/",AuthMiddleware,updateUser)
userRoute.get("/",AuthMiddleware,getUser)


