import mongoose, { Document, Schema } from 'mongoose';

interface IToken extends Document {
    refreshToken: String;
    user: any;
}

const TokenSchema = new Schema<IToken>({
  refreshToken: String,
  user: {type: Schema.Types.ObjectId, ref: "User"},
});

const Token = mongoose.model<IToken>('Token', TokenSchema)

export default Token;