import bcrypt from 'bcryptjs';
import { ErrorHandler, userAvatar } from "../helpers";
import { User } from "../models";
import { TokenService } from '.';
import { string } from 'joi';
import { JwtPayload } from 'jsonwebtoken';
import UserDto from '../dtos/userDto';
import { UserType } from '../models/userModel';

class UserService {
    async registration(username: string, email: string, password: string, salt: number) {
        const candidate = await User.findOne({ email });
        if (candidate) {
            throw ErrorHandler(401, 'User with same email already exist');
        }
        const hashedPassword = await bcrypt.hash(password, salt);
        const avatar = userAvatar(email);
        const user = await User.create({
          username: username,
          email: email,
          password: hashedPassword,
          token: "",
          birthday: "",
          location: "",
          phone: "",
          avatar: { url: avatar, id: "" },
        });
        const payload = {
            id: user?._id,
            email: user?.email,
            verify: user?.verify,
        };
        const tokens = TokenService.generateTokens(payload);
        await TokenService.saveToken(payload.id, tokens.refreshToken);
        return { ...tokens, user };
    }
    async login(email: string, password: string) {
        const user = await User.findOne({ email });
        if (!user) {
            throw ErrorHandler(401, "User does not exist")
        }

        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw ErrorHandler(401, "Password is wrong")
        }
        const userDto = new UserDto(user as UserType);
        const payload = {
            id: user?._id,
            username: user?.username,
            email: user?.email,
            verify: user?.verify,
            avatar: user?.avatar
        };
        const tokens = TokenService.generateTokens(payload);
        await TokenService.saveToken(payload.id, tokens.refreshToken);
        return {...tokens, user}
    }
    async logout(refreshToken: string) {
        const token = await TokenService.removeToken(refreshToken);
        return token;
    }


    async refresh(refreshToken: string) {
        if (!refreshToken) {
            throw ErrorHandler(401);
        }
        const userData = TokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await TokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ErrorHandler(401);
        }
        const user = await User.findById((userData as JwtPayload).id);
        const payload = {
          id: user?._id,
          username: user?.username,
          email: user?.email,
          verify: user?.verify,
          avatar: user?.avatar,
        };
        const tokens = TokenService.generateTokens(payload);
        return { ...tokens, user };
    }
}

export default new UserService();