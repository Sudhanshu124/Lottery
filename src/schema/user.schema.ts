import { IsEmail, IsNotEmpty, Max, Min, MinLength ,MaxLength} from "class-validator";
import * as mongoose from "mongoose";


interface userInterface{
    name?:string;
    password:string;
    email:string;
    wallet?:number;
    isAdmin?:boolean
}


class registerBody implements userInterface {
    @IsNotEmpty()
    name:string;

    @MinLength(8)
    @MaxLength(20)
    @IsNotEmpty()
    password:string;

    @IsEmail()
    @IsNotEmpty()
    email:string;
 
}
class UserBody{
    @IsNotEmpty()
    name:string;
    
    wallet:string;
}

class loginBody implements userInterface {
    @MinLength(8)
    @MaxLength(20)
    @IsNotEmpty()
    password:string;

    @IsEmail()
    @IsNotEmpty()
    email:string;
}

const userSchema=new mongoose.Schema<userInterface>({
    name:{type:String, required:true}, 
    password:{type:String, required:true},
    email:{type:String, required:true,unique:true},
    wallet:{type:Number,default:1000,min:0},
    isAdmin:{type:Boolean, default:false}
},{timestamps:true})

export default userSchema;
export {loginBody,registerBody,userInterface,UserBody};


