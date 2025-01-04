import { ForbiddenException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

export class PasswordService {
  public async encryptPassword(pass: string) {
    const saltOrRounds = await bcrypt.genSaltSync(10);
    const password = pass;
    const hash = await bcrypt.hashSync(password, saltOrRounds);
    return hash;
  }

  public async verifyPassword(password: string, hash: string) {
    const isMatchedPassword = await bcrypt.compareSync(password, hash);
    if (!isMatchedPassword) {
      throw new ForbiddenException('Wrong credentials provided');
    }
    return isMatchedPassword;
  }
}
