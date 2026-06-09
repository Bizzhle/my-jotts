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

  @Column('timestamptz', { name: 'expiresAt', nullable: false })
  expiresAt: Date;

  @Column('timestamptz', { name: 'createdAt', nullable: false })
  createdAt: Date;

  @Column('timestamptz', { name: 'updatedAt', nullable: false })
  updatedAt: Date;
}
