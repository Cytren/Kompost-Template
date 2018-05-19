
import { Model } from "kompost";
import { Entity, Column, ManyToOne } from "typeorm";
import User from "./user";

@Entity()
export default class RefreshToken extends Model {
    @Column()
    public token: string;

    @ManyToOne(type => User, user => user.refreshTokens)
    public user: User;

    @Column({ nullable: true })
    public userId: number;

    @Column({ default: 0 })
    refreshCount: number;
}
