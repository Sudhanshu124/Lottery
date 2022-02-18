import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { connection, Connection, Model } from 'mongoose';
import { ticketBody, ticketInterface ,GetTicket} from '../schema/ticket.schema';
import { userInterface } from '../schema/user.schema';
import { transactionInterface } from '../schema/transaction.schema';
import * as mongoose from 'mongoose';
import e from 'express';

@Injectable()
export default class TicketService {
  constructor(
    @InjectModel('Ticket') private ticketDB: Model<ticketInterface>,
    @InjectModel('User') private userDB: Model<userInterface>,
    @InjectModel('Transaction')
    private transactionDB: Model<transactionInterface>,
    @InjectConnection() private connection: mongoose.Connection,
  ) {}

  async createTicket(body: ticketBody) {
    const ticket = await this.ticketDB.create({
      ...body,
      buyPrice: body.winningSum / 5,
    });
    try {
      const savedTicket = await ticket.save();
      return { ticket: savedTicket };
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  async buyTicket(userId: string, ticketId: string) {
    //validating userId and ticketId---
    if (!mongoose.Types.ObjectId.isValid(userId))
      throw new BadRequestException('User Id is invalid');
    if (!mongoose.Types.ObjectId.isValid(ticketId))
      throw new BadRequestException('Ticket Id is invalid');

    const maxParticipantsLength: number = 5;

    //Starting transaction------
    const session = await this.connection.startSession();
    session.startTransaction();

    const user = await this.userDB.findById(userId).session(session);
    //if no such user--
    if (!user) {
      throw new NotFoundException('No such user found with ID: ' + userId);
    }
    const ticket = await this.ticketDB.findById(ticketId).session(session);
    //if no such ticket----
    if (!ticket) {
      throw new NotFoundException('No such ticket found with ID: ' + ticketId);
    }
    //if doesnt have sufficient amount in his wallet
    if (user.wallet < ticket.buyPrice) {
      throw new NotAcceptableException('You do not have sufficient balance');
    }
    //if all tickets sold----
    if (ticket.participants.length >= maxParticipantsLength) {
      throw new NotAcceptableException('No tickets left for this Lottery.');
    }

    //creating a transaction
    const transaction = new this.transactionDB({
      userId: user._id,
      ticketId: ticket._id,
      previousBalance: user.wallet,
      closingBalance: user.wallet - ticket.buyPrice,
    });
    //updating user balance
    user.wallet = user.wallet - ticket.buyPrice;
    //updating participants
    ticket.participants.push(user._id);
    try {
      await user.save();
      await ticket.save();
      const createdTransaction = await transaction.save();
      await session.commitTransaction();
      session.endSession();
      return {
        message: 'Ticket bought successfully',
        data: createdTransaction,
      };
    } catch (e) {
      await session.abortTransaction();
      throw new BadRequestException(e.message);
    }
  }
  //Delete tickets from db
  async deleteTicket(ticketId: string) {
    const ticketID = await this.ticketDB.findOne({ _id: ticketId });
    if (!ticketID) {
      throw new NotFoundException('No such ticket found');
    }
    await this.ticketDB.deleteOne({ _id: ticketId });
    return 'ticket has been deleted successfully';
  }

  //Service method of ticket updation
  async updateTicket(id: string, body: ticketBody) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid Ticket Id');
    try {
      const ticket = await this.ticketDB.findByIdAndUpdate(
        id,
        { $set: { ...body, buyPrice: body.winningSum / 5 } },
        { new: true },
      );
      if (!ticket)
        throw new NotFoundException('No ticket found with the provided ID');
      return ticket;
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
  async getTickets(query:GetTicket) {
    
    try {
      if(query.sort==='closed'){
           //get all tickets where participants.length=5
            return await this.ticketDB.find({participants:{$size:5}})

         }
         else if(query.sort==='open')
         { 
           // Get all tickets where participants.length <5  {participants :{$size:{$lt:5}}}
           return await this.ticketDB.find({participants:{$size:{$lt:5}}})

         }
         else{
           ////Get all tickets  {participants 
           return await this.ticketDB.find()
         }
        }

        // if (t) {
        //   return numberOfParticipants[i];
        // }
      

      //
     catch (e) {}
  }
}
