import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import AuthService from "./auth.service";
import AuthController from "./auth.controller";
import {MongooseModule} from "@nestjs/mongoose";
import userSchema from "../schema/user.schema"
import { connection } from "mongoose";
import { authorizeTokenOnlyAdmin } from "src/middlewares";


@Module({
    imports:[MongooseModule.forFeature([{name:'User',schema:userSchema}])],
    controllers:[AuthController],
    providers:[AuthService],
})
export default class AuthModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(authorizeTokenOnlyAdmin).forRoutes({path:'/api/auth/deleteuser',method: RequestMethod.DELETE})
        consumer.apply(authorizeTokenOnlyAdmin).forRoutes({path:'api/auth/:id',method: RequestMethod.PUT})
        
    }
}