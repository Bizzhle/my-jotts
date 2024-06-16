import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'signing_secret' })
export class SigningSecret {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @Column()
  start_date: Date;

  @Column()
  expiry_date: Date;
}
