import { Controller, Param, Post, Req, Res } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { throwError } from 'rxjs';
import * as bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

@Controller()
export class AuthenticationController {
  @Post('/signIn')
  async signIn(@Param() param, @Req() request: Request, @Res() response: Response): Promise<any> {
    await prisma.users
      .findMany({
        where: {
          email: {
            equals: request.body.email,
          },
        },
      })
      .then(async user => {
        await bcrypt.compare(request.body.password, user[0].password).then(isMatch => {
          if (isMatch) {
            response.json(user);
          } else {
            response.send({ status: 404, message: 'UNSUCCESSFUL LOGIN' });
          }
        });
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
