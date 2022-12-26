import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'total_class' })
export class Total {
  @PrimaryGeneratedColumn('uuid')
  totalID: string;

  @Column({ type: 'varchar' })
  clase: string;

  @Column({ type: 'int', default: 1 })
  intento: number;

  @Column({ type: 'int' })
  nota: number;

  @ManyToOne(() => User, (user) => user.totalClass)
  userId: User;
}
