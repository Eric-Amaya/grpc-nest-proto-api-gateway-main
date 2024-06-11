import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs//core';
import { ROLES_KEY } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class RoleGuard implements CanActivate {

  constructor(private readonly reflector: Reflector) { }

  canActivate(
    context: ExecutionContext,
  ): boolean {

    const role = this.reflector.getAllAndOverride<Role>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if(!role) return true;

    const { user } = context.switchToHttp().getRequest();

    if(user.role === Role.ADMIN) {
      return true;
    }

    // Revisa si es necesario un try catch aqui para que de el error de Unauthorized
    // para ADMIN en product

    return role === user.role;
  }
}