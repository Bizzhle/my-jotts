import * as bcrypt from 'bcryptjs';

export class PasswordService {
  public async encryptPassword(pass: string) {
    const saltOrRounds = await bcrypt.genSaltSync(10);
    const password = pass;

    const hash = await bcrypt.hashSync(password, saltOrRounds);
    return hash;
  }

  public async comparePassword(pass: string, hash: string) {
    const isMactchedPassword = await bcrypt.compareSync(pass, hash);
    return isMactchedPassword;
  }
}
