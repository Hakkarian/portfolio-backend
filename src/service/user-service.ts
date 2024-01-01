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
        console.log('10')
        if (candidate) {
            throw ErrorHandler(401, 'User with same email already exist');
        }
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log('11')
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
        console.log('12')
        const payload = {
            id: user?._id,
            email: user?.email,
            verify: user?.verify,
        };
        const tokens = TokenService.generateTokens(payload);
        console.log('13')
        await TokenService.saveToken(payload.id, tokens.refreshToken);
        console.log('14')
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
        const userDto = new UserDto(user as UserType)
        console.log('dto', userDto);
        const payload = {
            id: user?._id,
            email: user?.email,
            verify: user?.verify,
        };
        const tokens = TokenService.generateTokens(payload);
        await TokenService.saveToken(payload.id, tokens.refreshToken);
        return {...tokens, user}
    }
    async logout(refreshToken: string) {
        console.log('userservice token', refreshToken)
        const token = await TokenService.removeToken(refreshToken);
        return token;
    }


    async refresh(refreshToken: string) {
        if (!refreshToken) {
            throw ErrorHandler(401);
        }
        const userData = TokenService.validateRefreshToken(refreshToken);
        console.log('refresh zzz', refreshToken);
        console.log('refresh userdata', userData);
        console.log('1')
        const tokenFromDb = await TokenService.findToken(refreshToken);
        console.log('2')
        if (!userData || !tokenFromDb) {
            console.log('3')
            throw ErrorHandler(401);
        }
        const user = await User.findById((userData as JwtPayload).id);
        console.log('refresh user', user)
        const tokens = TokenService.generateTokens({ ...user });
        console.log('6')
        return { ...tokens, user };
    }
}

export default new UserService();