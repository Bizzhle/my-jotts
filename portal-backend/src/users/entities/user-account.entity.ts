import { Exclude, Expose } from 'class-transformer';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Role } from '../../permissions/entities/role.entity';

@Entity({ name: 'user_account' })
@Unique(['email_address'])
export class UserAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  @Expose({ name: 'emailAddress' })
  email_address: string;

  @Column({ type: 'varchar', nullable: false })
  @Exclude()
  password: string;

  @Column({ type: 'varchar', nullable: true })
  @Expose({ name: 'firstName' })
  first_name: string;

  @Column({ type: 'varchar', nullable: true })
  @Expose({ name: 'lastName' })
  last_name: string;

  @Column({ type: 'boolean', nullable: true })
  @Expose()
  enabled: boolean;

  @Column({ type: 'timestamp', nullable: false })
  @Expose({ name: 'registrationDate' })
  registration_date: Date;

  @Column({ type: 'timestamp', nullable: false })
  @Expose({ name: 'lastLoggedIn' })
  last_logged_in: Date;

  @Column({ type: 'varchar', nullable: true })
  @Exclude()
  verification_token: string;

  @ManyToMany(() => Role, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'user_account_role',
    joinColumn: { name: 'user_account_id' },
    inverseJoinColumn: { name: 'role_id' },
  })
  roles: Role[];
}
