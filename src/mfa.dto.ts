import { Role, User } from 'discord.js';
import { RoleOption, StringOption } from 'necord';

export class NameDto {
  @StringOption({
    name: 'name',
    description: 'Name of the 2FA Code',
    required: true,
  })
  name: string;
}

export class KeyDto {
  @StringOption({
    name: 'name',
    description: 'Name of the 2FA Code',
    required: true,
  })
  name: string;
  @StringOption({
    name: 'key',
    description: 'Key of the 2FA Code',
    required: true,
  })
  key: string;
}

export class RoleDto {
  @StringOption({
    name: 'name',
    description: 'Name of the 2FA Code',
    required: true,
  })
  name: string;
  @RoleOption({
    name: 'role',
    description: 'Role to toggle 2FA Code access',
    required: true,
  })
  role: Role;
}

export class UserDto {
  @StringOption({
    name: 'name',
    description: 'Name of the 2FA Code',
    required: true,
  })
  name: string;
  @StringOption({
    name: 'user',
    description: 'User to transfer 2FA Code ownership to',
    required: true,
  })
  user: User;
}
