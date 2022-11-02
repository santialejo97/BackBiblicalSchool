import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  idUser: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  nameUser: string;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  password: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({
    type: 'varchar',
    default: 'USER',
  })
  roleUser: string;
}
