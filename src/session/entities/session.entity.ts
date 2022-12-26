import { Clase } from 'src/class/entities/class.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'session' })
export class Session {
  @PrimaryGeneratedColumn('uuid')
  idSession: string;

  @Column({
    type: 'varchar',
    srid: 400,
  })
  titleSession: string;

  @Column({
    type: 'varchar',
  })
  description: string;

  @Column({
    type: 'int',
  })
  numberSession: number;

  @Column({ type: 'varchar' })
  video: string;

  @ManyToOne(() => Clase, (clase) => clase.session, { eager: true })
  idClass: Clase;
}
