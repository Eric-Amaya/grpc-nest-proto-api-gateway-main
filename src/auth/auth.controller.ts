import { Controller, Inject, Param } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { AuthServiceClient, AUTH_SERVICE_NAME, RegisterRequest, LoginRequest, ValidateRequest, RecoveryRequest, VerifyCodeRequest, ChangePasswordRequest, GetUserRequest } from './auth.pb';
import { Observable } from 'rxjs';
import { Body, Post, Get } from '@nestjs/common';
import { Role } from '../common/enums/role.enum';
import { Auth } from '../common/decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  private authService: AuthServiceClient;

  @Inject(AUTH_SERVICE_NAME)
  private readonly client: ClientGrpc;

  onModuleInit() {
    this.authService = this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  @Get('user/:id')
  @Auth(Role.USER)
  getUser(@Param('id') id:number): Observable<any> {
    const request: GetUserRequest = {userId: id};
    return this.authService.getUser(request);
  }

  @Post('register')
  register(@Body() request: RegisterRequest): Observable<any> {
    return this.authService.register(request);
  }

  @Post('login')
  login(@Body() request: LoginRequest): Observable<any> {
    return this.authService.login(request);
  }

  @Post('validate')
  validate(@Body() request: ValidateRequest): Observable<any> {
    return this.authService.validate(request);
  }

  @Post('recovery')
  recovery(@Body() request: RecoveryRequest): Observable <any> {
    return this.authService.recovery(request);
  } 

  @Post('verifycode')
  verifyCode(@Body() request: VerifyCodeRequest): Observable <any> {
    return this.authService.verifyCode(request);
  }

  @Post('changepassword')
  changePassword(@Body() request: ChangePasswordRequest): Observable <any> {
    return this.authService.changePassword(request);
  }
}
