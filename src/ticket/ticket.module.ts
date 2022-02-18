import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import TicketController from "./ticket.controller";
import  TicketService  from "./ticket.service";
import {MongooseModule} from "@nestjs/mongoose";
import ticketSchema from "src/schema/ticket.schema";
import transactionSchema from "src/schema/transaction.schema";
import {authorizeTokenOnlyUserAndAdmin,authorizeTokenOnlyAdmin,customRequest} from "src/middlewares";
import userSchema from "src/schema/user.schema";


@Module({
    imports:[
        MongooseModule.forFeature([{name:'Ticket',schema:ticketSchema},{name:"User",schema:userSchema},{name:"Transaction",schema:transactionSchema}])
    ],
    controllers:[TicketController],
    providers:[TicketService],
})
export default class TicketModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(authorizeTokenOnlyAdmin)
        .forRoutes({path:"/api/tickets",method:RequestMethod.POST});

        consumer.apply(authorizeTokenOnlyUserAndAdmin)
        .forRoutes({path:"/api/tickets/:id/:ticketId",method:RequestMethod.POST});

        consumer.apply(authorizeTokenOnlyAdmin).forRoutes({path:'/api/ticket/:id',method: RequestMethod.DELETE});
        consumer.apply(authorizeTokenOnlyAdmin).forRoutes({path:'/api/ticket/updateTicket',method: RequestMethod.PATCH});
    }
}