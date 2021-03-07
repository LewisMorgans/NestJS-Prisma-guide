import { Body, Controller, Delete, Get, Param, Post, Req, Res } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import { throwError } from 'rxjs';

const prisma = new PrismaClient();

@Controller()
export class UsersController {
  @Get()
  async getUsers(): Promise<any> {
    return await prisma.users.findMany();
  }

  @Post('/findUser/:id')
  async getUser(@Param() param, @Res() response: Response): Promise<any> {
    return await prisma.users
      .findUnique({
        where: {
          id: param.id,
        },
      })
      .then(user => {
        if (user) {
          response.json(user);
        } else {
          response.send({ status: 500, message: 'USER NOT FOUND' });
        }
      })
      .catch(error => {
        throwError(new Error());
        response.send({
          status: 500,
          message: `INTERNAL SERVER ERROR ${error}`,
        });
      });
  }

  @Post('/createUser')
  async createUser(@Req() request: Request, @Res() response: Response): Promise<any> {
    let userFound: boolean;

    await prisma.users
      .findMany({
        where: {
          email: {
            equals: request.body.email,
          },
        },
      })
      .then(user => {
        if (user.length > 1) {
          userFound = true;
        }
      });

    if (userFound) {
      response.send({ status: 500, message: 'EMAIL ALREADY REGISTERED' });
    } else {
      const hashedPassword = await bcrypt.hash(request.body.password, 10);
      await prisma.users
        .create({
          data: {
            firstName: request.body.firstName,
            lastName: request.body.lastName,
            email: request.body.email,
            avatar: request.body.avatar,
            password: hashedPassword,
          },
        })
        .then(_ => {
          response.send({ status: 200, message: 'SUCCESS' });
        })
        .catch(error => {
          throwError(new Error());
          response.send({
            status: 500,
            message: `INTERNAL SERVER ERROR ${error}`,
          });
        });
    }
  }

  @Post('/updateUser/:id')
  async updateUser(@Param() param, @Req() request: Request, @Res() response: Response): Promise<any> {
    await prisma.users
      .update({
        where: { id: param.id },
        data: {
          firstName: 'John',
          lastName: 'Hancock',
          email: '.com',
          avatar: '21',
          password: 'xyz',
        },
      })
      .then(_ => {
        response.send({ status: 200, message: 'SUCCESS' });
      })
      .catch(error => {
        throwError(new Error());
        response.send({
          status: 500,
          message: `INTERNAL SERVER ERROR ${error}`,
        });
      });
  }

  @Delete('/deleteUser/:id')
  async deleteUser(@Param() param, @Res() response: Response): Promise<any> {
    await prisma.users
      .delete({
        where: {
          id: param.id,
        },
      })
      .then(_ => {
        response.send({ status: 200, message: 'SUCCESS' });
      })
      .catch(error => {
        throwError(new Error());
        response.send({
          status: 500,
          message: `INTERNAL SERVER ERROR ${error}`,
        });
      });
  }
}
