import { User } from 'src/auth/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 8, unique: true })
  accountId: string;

  @OneToOne(() => User, (user) => user.account)
  @JoinColumn()
  user: User;

  @Column({ default: 0 })
  balance: number;
}
