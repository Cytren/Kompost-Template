
import { Model } from "kompost";
import { Entity, Column, OneToMany } from "typeorm";
import RefreshToken from "./refresh-token";

@Entity()
export default class User extends Model {
    @Column({ unique: true })
    public username: string;

    @Column()
    public password: string;

    @Column()
    public type: "user" | "admin";

    @Column({ nullable: true })
    public email: string;

    @OneToMany(type => RefreshToken, token => token.user)
    public refreshTokens: RefreshToken[];

    public isAdmin () {
        return this.type === "admin";
    }
}
