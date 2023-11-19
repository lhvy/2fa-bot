import { StringOption } from 'necord';

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
