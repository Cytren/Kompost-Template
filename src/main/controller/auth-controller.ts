
import {
    Controller, inject, request, controller, post, put, expose
} from "kompost";

import {sign} from "jsonwebtoken";
import {compare} from "bcrypt";

import Environment from "../core/environment";
import Auth from "../entity/auth";
import AuthService from "../service/auth-service";
import RefreshToken from "../model/refresh-token";
import User from "../model/user";
import AuthRequest from "../request/auth-request";

import * as moment from "moment";

@controller("auth")
export default class AuthController extends Controller {
    @inject private environment: Environment;
    @inject private authService: AuthService;

    @post
    @expose
    @request(AuthRequest)
    public async create (auth: Auth) {
        const user = await User.findOne({ username: auth.username });

        if (!user) {
            this.invalidCredentials();
            return;
        }

        if (await compare(auth.password, user.password)) {
            const token = await this.authService.generateRememberToken();
            const existingTokenCount = await RefreshToken.count({
                where: { userId: user.id },
            });

            if (existingTokenCount >= this.environment.jwt.maxRefreshTokens) {
                const oldestToken = await RefreshToken.findOne({
                    where: { userId: user.id },
                    order: { updatedAt: "ASC" },
                });

                await oldestToken.remove();
            }

            const refreshToken = new RefreshToken();
            refreshToken.token = token;
            refreshToken.user = user;

            await RefreshToken.save(refreshToken);
            return {
                refreshToken: token,
                userId: user.id
            };
        } else {
            this.invalidCredentials();
        }
    }

    @put(":token")
    @expose
    public async update (token: string) {
        const refreshToken = await RefreshToken.findOne({
            where: { token },
            relations: ["user"],
        });

        if (refreshToken) {
            const payload = {
                sub: refreshToken.user.id,
                exp: moment().add(this.environment.jwt.tokenValidityHours, "hours").unix(),
            };

            refreshToken.refreshCount++;
            await RefreshToken.save(refreshToken);

            const accessToken = sign(payload, this.environment.jwt.privateKey);
            return { accessToken };
        } else {
            this.error(404, { error: "Invalid refresh token." });
        }
    }

    private invalidCredentials () {
        this.error(404, { error: "Invalid username and/or password." });
    }
}
