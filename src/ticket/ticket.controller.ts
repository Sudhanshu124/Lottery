import { Put, Query } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import {ticketBody,GetTicket} from "../schema/ticket.schema";
import TicketService from './ticket.service';


@Controller('api/tickets')
export default class TicketController {
    
    constructor(private ticketService: TicketService){}

    //create a ticket-----------------
    @Post()
    async createTicket(@Body() body:ticketBody){
        return await this.ticketService.createTicket(body);
    }

    //Buy a ticket----------------------
    @Post('/:id/:ticketId')
    async buy(@Param('id') userId:string,@Param('ticketId') ticketId:string){
        return await this.ticketService.buyTicket(userId,ticketId);
    }
    
    //Delete a Ticket
    @Delete('/deleteticket')
    async deleteTicket(@Body() ticketId:string)
    {
        return await this.ticketService.deleteTicket(ticketId)
    }
   @Put("/:id")
    async updateTicket(@Param('id') id:string,@Body() body:ticketBody){
        return await this.ticketService.updateTicket(id,body);
    }
    // @Get("/:sort")
    // async getAllTicket(@Param('sort') sorttype:string)
    // {
    //     //return await this.ticketService.getAllTicket(id);
    //     console.log(sorttype)
    // }
    @Get()
    async getTickets(@Query() query:GetTicket){
        console.log(query)
       return await this.ticketService.getTickets(query);
    }
}
