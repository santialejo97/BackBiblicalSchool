import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'class' })
export class Clase {
  @PrimaryGeneratedColumn('uuid')
  idClass: string;

  @Column({
    type: 'varchar',
  })
  titleClass: string;

  @Column({
    type: 'int',
    default: 0,
  })
  numberSesion: number;

  @Column({
    type: 'varchar',
    unique: true,
  })
  slug: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  description: string;

  @ManyToOne(() => User, (user) => user.clase, { eager: true })
  userId: User;
}
