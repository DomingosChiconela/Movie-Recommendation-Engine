import { Request,Response} from "express";



import { date, z } from "zod";
import { db } from "../utils/db.server";
import { fromZodError } from "zod-validation-error"
import * as jwt from "jsonwebtoken"
;
import { encryptPassword,checkPassword } from "../utils/cryptPassword";


const secret  =  process.env.SECRET as string



export const MovieGenreEnum = z.enum([
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
    password: z.string().min(8, "The password must not be less than 8 characters"),
    confirmPassword: z.string().min(8, "The password must not be less than 8 characters"),
    favoriteGenres: z.array(MovieGenreEnum).nonempty("At least one genre must be selected") 
});


const loginSchema = registerSchema.pick({
    username: true,
    password: true
  });
    

const updateSchema =  registerSchema.partial()
    







export const register = async(req:Request,res:Response)=>{

    try {
        
        const validation = registerSchema.safeParse(req.body);
       
        if(!validation.success){
            return  res.status(400).json({message:fromZodError(validation.error).details})
        }

        if(validation.data.password !== validation.data.confirmPassword){
            return res.status(400).json({message:"The passwords do not match"})
         }
         const passwordHash  =  await encryptPassword(validation.data.password)


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

        console.log("gene")
        console.log(genreIds)

        const user = await db.user.create({
            data: {
                username: validation.data.username,
                email: validation.data.email,
                password:passwordHash,
                genders: {
                    connect: genreIds.map(id => ({ id })), 
                },
            },
            include: {
                genders: true, 
              },
              
        });

            const{password,...rest} =  user
        

        res.status(201).json({message:"user created",data:rest})
       


    } catch (error) {
        console.log(error)
        
        return res.status(500).json({ message: "Internal Server Error" });
    }

}




export const login =  async (req: Request, res: Response) => {
    const validation = loginSchema.safeParse(req.body);

    if(!validation.success){
        return  res.status(400).json({message:fromZodError(validation.error).details})
    }
    try{
        const user = await db.user.findUnique({
            where:{
                username:validation.data.username
            },
    
          
        
        })

        if(!user){
            return  res.status(404).json({message:"user not found"})

        }
       
        if(! await checkPassword(validation.data.password,user.password)){
            return  res.status(400).json({message:"invalid password"})
        }


        const token  =   jwt.sign({id:user.id},secret,{expiresIn:"30d"})

        res.status(200).json({message:"authenticated user",token})

    }catch (error) {


        console.log(error)
        
        return res.status(500).json({ message: "Internal Server Error" });
    }
    
   

}


export const getUser = async(req:Request,res:Response)=>{
    const {userId}= req

    try{
        const  user = await db.user.findUnique({
            where:{
                id:userId
            },
            include:{
                genders:true
            }
        })

        if(!user){
            return  res.status(404).json({message:"user not found"})

        }
        
        const {password,genders,...rest} = user 
        const favoriteGenres = genders.map((gender)=> gender.name)

        res.status(200).json({message:"User found",data:{...rest,favoriteGenres}})
     

    }
    catch (error) {
        console.log(error)
        
        return res.status(500).json({ message: "Internal Server Error" });
    }
  
}

export const  updateUser = async(req:Request,res:Response)=>{

    const {userId}= req

    try {
        
        const validation = updateSchema.safeParse(req.body);
        console.log(req.body)
        if(!validation.success){
            return  res.status(400).json({message:fromZodError(validation.error).details})
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

        const user = await db.user.update({

            where:{
            id:userId
            },
            data: {
                username: validation.data.username,
                email: validation.data.email,
                genders: {
                    set: genreIds.map(id => ({ id })), 
                },
            },
            include: {
                genders: true, 
              },
        });


        const{password,...rest} = user


        res.status(200).json({message:"user updated",data:rest})
       


    } catch (error) {
        console.log(error)
        
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


export const deleteUser = async(req:Request,res:Response)=>{
    const {userId}= req

    try{
        const  user = await  db.user.delete({
            where:{
                id:userId
            }
        })

        if(!user){
            return  res.status(404).json({message:"user not found"})

        }
        
       

        res.status(200).json({message:"user deleted"})
     

    }
    catch (error) {
        console.log(error)
        
        return res.status(500).json({ message: "Internal Server Error" });
    }
  
}