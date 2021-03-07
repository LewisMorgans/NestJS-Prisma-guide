import { Module } from '@nestjs/common';
import { UsersController } from './controllers/usersController';
import { AuthenticationController } from './controllers/authentication/authenticationController';

@Module({
  imports: [],
  controllers: [UsersController, AuthenticationController],
  providers: [],
})
export class AppModule {}
