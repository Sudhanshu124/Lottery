import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import AuthService  from './auth.service';
import {registerBody,loginBody, UserBody} from "../schema/user.schema";
import { Put } from '@nestjs/common';

@Controller('api/auth')
export default class AuthController {

    constructor(private authService: AuthService){}
  
    //Register Controller-----------------
    @Post('register')
    async register(@Body() body:registerBody){
        return await this.authService.register(body);
    }

    //Login Controller-------------------
    @Post('login')
    async login(@Body() body:loginBody){
        return await this.authService.login(body);
    }
    //Deletion of User
    @Delete('/deleteuser')
    async userDelete(@Body() data)
    {
        return await this.authService.userDelete(data);
    }

    //Update user
    @Put('/:id')
    async updateUser(@Param('id') id:string,@Body() body:UserBody)
    {
        return await this.authService.userUpdate(id,body);
    }
}

