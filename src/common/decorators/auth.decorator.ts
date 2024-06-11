import { applyDecorators, UseGuards } from "@nestjs/common";
import { Role } from "../enums/role.enum";  
import { AuthGuard } from "../../guard/auth.guard";
import { RoleGuard } from "../../guard/role.guard"
import { Roles } from "./roles.decorator";

export function Auth(role: Role) {
  return applyDecorators(Roles(role), UseGuards(AuthGuard, RoleGuard));
}