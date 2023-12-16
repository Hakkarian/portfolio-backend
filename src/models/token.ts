import mongoose, { Document, Schema } from 'mongoose';

interface IToken extends Document {
    refreshToken: String;
    userId: {type: String, ref: String};
}

const TokenSchema = new Schema<IToken>({
  refreshToken: String,
  userId: {type: Schema.Types.ObjectId, ref: "User"},
});

const Token = mongoose.model<IToken>('Token', TokenSchema)

export default Token;