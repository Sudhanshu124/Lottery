import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {Model} from "mongoose";
import {userInterface,registerBody,loginBody, UserBody} from "../schema/user.schema";
import {connection, Connection} from "mongoose";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { request } from 'http';
import * as mongoose from "mongoose";

@Injectable()
export default class AuthService {
  

    constructor(@InjectModel("User") private User:Model<userInterface>){}

    //Register Service--------------------------------
    async register(body:registerBody){
            const hash=await bcrypt.hash(body.password,10);
           
            if(!hash) throw new InternalServerErrorException("Not able to encrypt password");
            const user=new this.User({
                name:body.name,
                password:hash,
                email:body.email.toLowerCase(),
            });
            try{
                const savedUser=await user.save();
                const {_id,name,email,...others}=savedUser;
                return {_id,name,email};
            }catch(e:any){
                if( e.code===11000) throw new BadRequestException("User email ID already exists");
                throw new BadRequestException(e.message);
            }
    }

    //Login Service-----------------------------------
    async login(body:loginBody){
        try{
            const dbResult=await this.User.findOne({email:body.email.toLowerCase()});
            if(!dbResult) throw new BadRequestException("No user found with this email")
            const compareResult=await bcrypt.compare(body.password,dbResult.password);
            if(!compareResult) throw new BadRequestException("Invalid credentials")
            const token:string=jwt.sign({
                    id:dbResult?.id,
                    isAdmin:dbResult?.isAdmin
            },process.env.JWT_SECRET,{expiresIn:"1h"});     
            return {token:token};
        }catch(e){
            throw new InternalServerErrorException(e.message);
        }
    }

    //Delete Service
    async userDelete(data: { email: any})
    {   
        const userdetail=await this.User.find(data);
        if(userdetail.length==0 ||userdetail.length==null)
        {
           throw new NotFoundException("No such user found")
        }
        await this.User.deleteOne({email:data.email});
        console.log(userdetail) ;
        return "Successfully deleted";
        
        }
    //Service method of user updation
    async userUpdate(id:string,body:UserBody)
    {
        if(!mongoose.Types.ObjectId.isValid(id)) throw new BadRequestException("Invalid User Id")
        try{
             const user = await this.User.findByIdAndUpdate(id,
                {$set:{...body,walltAmount:body.wallet,userName:body.name}},
                {new:true})
                if(!user) throw new BadRequestException("Invalid User")
        }
          
        catch(err) {
            throw new InternalServerErrorException(err.message);
        }
    }
    
}
