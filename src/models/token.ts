import mongoose, { Document, Schema } from 'mongoose';

interface IToken extends Document {
    tokenId: string;
    userId: string;
}

const TokenSchema = new Schema<IToken>({
  tokenId: String,
  userId: String,
});

const Token = mongoose.model<IToken>('Token', TokenSchema)

export default Token;