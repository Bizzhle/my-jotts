export class InitialLoginResponseDTO {
  id: number;
  emailAddress: string;
  firstName: string;
  lastName: string;
}

export class LoginDto {
  emailAddress: string;
  password: string;
}
