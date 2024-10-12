import { Request,Response} from "express";
import { date, z } from "zod";
import { fromZodError } from "zod-validation-error"

import { db } from "../utils/db.server";
import {MovieGenreEnum} from"./userController"
import { json } from "stream/consumers";



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



export const    getAllMovies =  async (req:Request, res:Response)=>{


    try{

        const movies = await db.movie.findMany({
            include:{
                genders:true
            }
        });

        if (movies.length === 0) {
            return res.status(200).json({ message: "No movies found" });
        }
      const data = movies.map((movie)=>{

            return { 
            id:movie.id,
            title:movie.title,
            description:movie.description,
            like_count: movie.like_count,
            genders:movie.genders.map((gender)=>gender.name)

            }
            
        })
        
       return res.status(200).json({ message: "Movies found", data});
        

    }catch (error) {


        console.log(error)
        
        return res.status(500).json({ message: "Internal Server Error" });
    }


}


export const getMovie =  async (req:Request, res:Response)=>{

            const {id} =  req.params
    try{

        const movie = await db.movie.findUnique({
            where:{
                id
            },
            include:{
                genders:true
            }
        });

        if (!movie) {
            return res.status(404).json({ message: "movie not found" });
        }
        
        const  {genders,createdAt,updatedAt,...rest} = movie
        const Genders =  genders.map((gender)=>gender.name)

       return res.status(200).json({ message: "Movie found", data: {...rest,genders:Genders,createdAt,updatedAt}});
        

    }catch (error) {


        console.log(error)
        
        return res.status(500).json({ message: "Internal Server Error" });
    }


}



export const deleteMovie = async(req:Request,res:Response)=>{
    const {id}= req.params

    try{
        const  user = await  db.movie.delete({
            where:{
                id
            }
        })

        if(!user){
            return  res.status(404).json({message:"movie not found"})

        }
        
       

        res.status(200).json({message:"movie deleted"})
     

    }
    catch (error) {
        console.log(error)
        
        return res.status(500).json({ message: "Internal Server Error" });
    }
  
}