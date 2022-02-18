import * as mongoose from "mongoose";
import {IsArray, IsDate, IsDivisibleBy, IsNotEmpty, Min} from "class-validator";

interface ticketInterface{
    winningSum:number,
    participants:[mongoose.Types.ObjectId],
    buyPrice?:number,
    startedOn:Date,
}


class ticketBody{
    
    @IsDivisibleBy(5)
    @Min(500)
    @IsNotEmpty()
    winningSum:number;

    @IsNotEmpty()
    @IsArray()
    participants:[mongoose.Schema.Types.ObjectId]

    @IsNotEmpty()
    startedOn:Date
}
class GetTicket{
    sort:string;
}

const sizeValidator=(val)=>{
    return val.length<=5;
}

const ticketSchema=new mongoose.Schema<ticketInterface>({
    winningSum:{type:Number, required:true},
    startedOn:{type:Date, required:true},
    participants:{type:[mongoose.Types.ObjectId],required:true,validate:[sizeValidator,"Ticket has been sold out"]},
    buyPrice:{type:Number, required:true}
},{timestamps:true});




export default ticketSchema;
export {ticketBody,ticketInterface,GetTicket};