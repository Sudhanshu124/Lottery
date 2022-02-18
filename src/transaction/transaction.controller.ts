import { Body, Delete } from '@nestjs/common';
import { Controller, Get, Param, Post } from '@nestjs/common';
import { TransactionService } from './transaction.service';

@Controller('api/transaction')
export class TransactionController {

    constructor(private transactionService: TransactionService){}
   //Get all transactions
    @Get('/:id')
    getTransaction(@Param('id') userId:string)
    {
      return this.transactionService.getTransaction(userId)
    }
   
    //get Singletransaction
    @Get('/trans/:transactionId')
    getTransactionbyId(@Param('transactionId') transactionId:string)
    {
        
        return this.transactionService.getTransactionbyId(transactionId);
    }
    //Delete a transaction
    @Delete('/deleteTransaction')
    deleteTransactionById(@Body() transactionId:string)
    {
      return this.transactionService.deleteTransaction(transactionId);
    }

   
}