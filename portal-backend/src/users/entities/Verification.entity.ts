import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('verification')
export class Verification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column('text', { name: 'identifier', nullable: false, unique: true })
  identifier: string;

  @Column('text', { name: 'value', nullable: false })
  value: string;

  @Column('timestamp', { name: 'expiresAt', nullable: false })
  expiresAt: Date;

  @Column('timestamp', { name: 'createdAt', nullable: false })
  createdAt: Date;

  @Column('timestamp', { name: 'updatedAt', nullable: false })
  updatedAt: Date;
}
