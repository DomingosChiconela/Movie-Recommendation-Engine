
import  express from "express"

import { register,updateUser,login,getUser,deleteUser} from "../controllers/userController"
import { AuthMiddleware } from "../middlewares/authMiddleware"




export const  userRoute =  express.Router()


userRoute.post("/",register)
userRoute.post("/login",login)
userRoute.get("/",AuthMiddleware,getUser)
userRoute.put("/",AuthMiddleware,updateUser)
userRoute.delete("/",AuthMiddleware,deleteUser)


