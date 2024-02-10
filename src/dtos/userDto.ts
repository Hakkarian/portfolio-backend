export default class UserDto {
    userId;
    email;
    verify;
    constructor(model: {email: string, _id: string, verify: boolean}) {
        this.email = model.email;
        this.userId = model._id;
        this.verify = model.verify;
    }
}