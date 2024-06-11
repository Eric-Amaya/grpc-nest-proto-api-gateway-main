import { Controller, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { AuthServiceClient, AUTH_SERVICE_NAME, RegisterRequest, LoginRequest, ValidateRequest } from './auth.pb';
import { Observable } from 'rxjs';
import { Body, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  private authService: AuthServiceClient;

  @Inject(AUTH_SERVICE_NAME)
  private readonly client: ClientGrpc;

  onModuleInit() {
    this.authService = this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
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
}
