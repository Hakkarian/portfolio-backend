export default class UserDto {
    id;
    email;
    verify;
    constructor(model: {email: string, _id: string, verify: boolean}) {
        this.email = model.email;
        this.id = model._id;
        this.verify = model.verify;
    }
}