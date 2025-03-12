import { Account } from "src/account/entity/account.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('user')
@Unique(['username'])
export class User{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;
    
    @Column()
    password: string;

    @OneToOne(() => Account, (account) => account.user )
    @JoinColumn()
    account: Account;
}