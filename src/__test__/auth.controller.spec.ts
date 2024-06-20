import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth/auth.controller';
import { ClientGrpc } from '@nestjs/microservices';
import {
  AuthServiceClient,
  AUTH_SERVICE_NAME,
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  ValidateRequest,
  ValidateResponse,
  RecoveryRequest,
  RecoveryResponse,
  VerifyCodeRequest,
  VerifyCodeResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  GetUserRequest,
  GetUserResponse,
} from '../auth/auth.pb';
import { firstValueFrom, of } from 'rxjs';
import { AuthGuard } from '../guard/auth.guard';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

describe('AuthController (Gateway)', () => {
  let controller: AuthController;
  let client: ClientGrpc;
  let authService: AuthServiceClient;

  const mockAuthServiceClient = {
    register: jest.fn().mockReturnValue(of({ status: 201, error: [] })),
    login: jest
      .fn()
      .mockReturnValue(of({ status: 200, error: [], token: 'mockedToken' })),
    validate: jest
      .fn()
      .mockReturnValue(of({ status: 200, error: [], userId: 1, role: 'user' })),
    recovery: jest.fn().mockReturnValue(of({ status: 200, error: [] })),
    verifyCode: jest.fn().mockReturnValue(of({ status: 200, error: [] })),
    changePassword: jest.fn().mockReturnValue(of({ status: 200, error: [] })),
    getUser: jest.fn().mockReturnValue(
      of({
        status: 200,
        error: [],
        user: {
          id: 1,
          email: 'test@example.com',
          role: 'user',
          name: 'Test User',
        },
      }),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AUTH_SERVICE_NAME,
          useValue: {
            getService: jest.fn().mockReturnValue(mockAuthServiceClient),
          },
        },
        {
          provide: 'ClientGrpc',
          useValue: {
            getService: jest.fn().mockReturnValue(mockAuthServiceClient),
          },
        },
        Reflector,
        {
          provide: AuthGuard,
          useValue: {
            canActivate: jest.fn(() => true),
          },
        },
        {
          provide: JwtService,
          useValue: {
            verify: jest.fn().mockReturnValue({}),
            sign: jest.fn().mockReturnValue('mockedJwtToken'),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    client = module.get<ClientGrpc>('ClientGrpc');
    authService = client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);

    controller.onModuleInit();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call register method', async () => {
    const payload: RegisterRequest = {
      name: 'Test User',
      rut: '12345678-9',
      email: 'test@example.com',
      password: 'password',
    };
    const expectedResult: RegisterResponse = { status: 201, error: [] };

    jest.spyOn(authService, 'register').mockReturnValue(of(expectedResult));

    const result = await firstValueFrom(controller.register(payload));
    expect(result).toStrictEqual(expectedResult);
  });

  it('should call login method', async () => {
    const payload: LoginRequest = {
      email: 'test@example.com',
      password: 'password',
    };
    const expectedResult: LoginResponse = {
      status: 200,
      error: [],
      token: 'mockedToken',
    };

    jest.spyOn(authService, 'login').mockReturnValue(of(expectedResult));

    const result = await firstValueFrom(controller.login(payload));
    expect(result).toStrictEqual(expectedResult);
  });

  it('should call validate method', async () => {
    const payload: ValidateRequest = { token: 'mockedToken' };
    const expectedResult: ValidateResponse = {
      status: 200,
      error: [],
      userId: 1,
      role: 'user',
    };

    jest.spyOn(authService, 'validate').mockReturnValue(of(expectedResult));

    const result = await firstValueFrom(controller.validate(payload));
    expect(result).toStrictEqual(expectedResult);
  });

  it('should call recovery method', async () => {
    const payload: RecoveryRequest = { email: 'test@example.com' };
    const expectedResult: RecoveryResponse = { status: 200, error: [] };

    jest.spyOn(authService, 'recovery').mockReturnValue(of(expectedResult));

    const result = await firstValueFrom(controller.recovery(payload));
    expect(result).toStrictEqual(expectedResult);
  });

  it('should call verifyCode method', async () => {
    const payload: VerifyCodeRequest = {
      email: 'test@example.com',
      code: '123456',
    };
    const expectedResult: VerifyCodeResponse = { status: 200, error: [] };

    jest.spyOn(authService, 'verifyCode').mockReturnValue(of(expectedResult));

    const result = await firstValueFrom(controller.verifyCode(payload));
    expect(result).toStrictEqual(expectedResult);
  });

  it('should call changePassword method', async () => {
    const payload: ChangePasswordRequest = {
      email: 'test@example.com',
      code: '123456',
      newPassword: 'newPassword',
      confirmPassword: 'newPassword',
    };
    const expectedResult: ChangePasswordResponse = { status: 200, error: [] };

    jest
      .spyOn(authService, 'changePassword')
      .mockReturnValue(of(expectedResult));

    const result = await firstValueFrom(controller.changePassword(payload));
    expect(result).toStrictEqual(expectedResult);
  });

  it('should call getUser method', async () => {
    const payload: GetUserRequest = { userId: 1 };
    const expectedResult: GetUserResponse = {
      status: 200,
      error: [],
      user: {
        id: 1,
        email: 'test@example.com',
        role: 'user',
        name: 'Test User',
      },
    };

    jest.spyOn(authService, 'getUser').mockReturnValue(of(expectedResult));

    const result = await firstValueFrom(controller.getUser(payload.userId));
    expect(result).toStrictEqual(expectedResult);
  });
});
