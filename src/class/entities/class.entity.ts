import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'class' })
export class Class {
  @PrimaryGeneratedColumn('uuid')
  idClass: string;

  // TODO: Finalizar entida de la tabla de clases
}
