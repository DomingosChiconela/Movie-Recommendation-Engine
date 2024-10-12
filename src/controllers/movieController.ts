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





export  const createMovie = async(req:Request,res:Response)=>{
    const validation = movieSchema.safeParse(req.body);

    if(!validation.success){

       return res.status(400).json({message:fromZodError(validation.error).details})
    }

    try{


        const genres = await db.gender.findMany({
            where: {
                name: {
                    in: validation.data.genders, 
                },
            },
            select: {
                id: true, 
            },
        });

        //mapeado o genres pois a consulta no banco me retorna um array de objecto,sendo que preciso um array simples de ids
        const genreIds = genres.map(genre => genre.id);


        const movie =  await db.movie.create({

            data:{
                title: validation.data.title,
                description: validation.data.description,
                release_year: validation.data.release_year,
                genders: {
                    connect: genreIds.map(id => ({ id })), 
                },
                
            },
            include:{
                genders:true
            }
        })
    

        res.status(201).json({message:"Movie created",data:movie})

    }catch (error) {


        console.log(error)
        
        return res.status(500).json({ message: "Internal Server Error" });
    }



}