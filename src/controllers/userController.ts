import { Request,Response} from "express";



import { date, z } from "zod";
import { db } from "../utils/db.server";
import { fromZodError } from "zod-validation-error"



const MovieGenreEnum = z.enum([
    "ACTION",
    "ADVENTURE",
    "COMEDY",
    "DRAMA",
    "HORROR",
    "SCIFI",
    "ROMANCE",
    "DOCUMENTARY",
    "ANIMATION",
    "FANTASY",
    "THRILLER",
    "MYSTERY",
    "MUSICAL",
    "BIOGRAPHY",
    "HISTORICAL",
    "SPORT",
    "WAR",
    "WESTERN",
    "FAMILY",
    "CRIME",
    "NOIR",
    "SUPERHERO"
  ]);
  
  

 const registerSchema = z.object({

    username: z.string(),
    email: z.string().email("Email is required").toLowerCase(),
    favoriteGenres: z.array(MovieGenreEnum).nonempty("At least one genre must be selected") 
});
    
    







export const register = async(req:Request,res:Response)=>{

    try {
        
        const validation = registerSchema.safeParse(req.body);
        if(!validation.success){
            return  res.status(400).json({message:fromZodError(validation.error).details})
        }


        const existingUser = await db.user.findFirst({
            where: {
              OR: [
                { username: validation.data.username },
                { email: validation.data.email }
              ]
            }
          });
          
          if (existingUser) {
            
            if (existingUser.username === validation.data.username) {
              return res.status(400).json({ message: "The username already exists, please enter a new one" });
            }
          
           
            if (existingUser.email === validation.data.email) {
              return res.status(400).json({ message: "The email already exists, please enter a new one" });
            }
          }

        
        const genres = await db.gender.findMany({
            where: {
                name: {
                    in: validation.data.favoriteGenres, 
                },
            },
            select: {
                id: true, 
            },
        });

        //mapeado o genres pois a consulta no banco me retorna um array de objecto,sendo que preciso um array simples de ids
        const genreIds = genres.map(genre => genre.id);



        const user = await db.user.create({
            data: {
                username: validation.data.username,
                email: validation.data.email,
                genders: {
                    connect: genreIds.map(id => ({ id })), 
                },
            },
        });

  

        res.status(201).json({message:"user created",user})
       


    } catch (error) {
        console.log(error)
        
        return res.status(500).json({ message: "Internal Server Error" });
    }

}