import { BadRequestException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from "mongoose";
import { Model } from 'mongoose';
import { transactionInterface } from 'src/schema/transaction.schema';
@Injectable()
export class TransactionService {

    constructor(@InjectModel("Transaction") private transactionModel:Model<transactionInterface>){}

    async getTransaction(userId: string)
    {
       if(!mongoose.Types.ObjectId.isValid(userId))
         throw new BadRequestException("Invalid user Id"); 

       const transactions = await this.transactionModel.find({userId : userId})
       return transactions;
    }


    async getTransactionbyId(transactionId: string)
    {
        if(!mongoose.Types.ObjectId.isValid(transactionId))
         throw new BadRequestException("You are searching for invalid transaction");

        const transactionbyId= await this.transactionModel.findOne({_id:transactionId})
        return transactionbyId;
    }
    

    async deleteTransaction(transactionId: string)
    {
      
        const transactionbyId= await this.transactionModel.findOne({_id:transactionId});
        console.log(transactionbyId);
        if(transactionbyId==null)
        {
          return "there is no such transaction";
        }
        await this.transactionModel.deleteOne({_id:transactionId});
        return "Transaction is deleted";
    }
}
//id=given
//findAllTransaction of this userid
