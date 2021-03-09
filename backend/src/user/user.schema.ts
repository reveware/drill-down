import { Logger } from '@nestjs/common';
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '@drill-down/interfaces';

const logger = new Logger('UserSchema');

const UserDefinition: Record<keyof User, any> = {
    username: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    tagLine: String,
    role: { type: String, required: true },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    providers: { type: Array, required: true },
};

export interface UserDocument extends User, mongoose.Document {
    isValidPassword: (password: string) => boolean;
}

export const UserSchema = new mongoose.Schema(UserDefinition, { versionKey: false });

// Hash password with bcrypt before saving
UserSchema.pre<UserDocument>('save', async function(next) {
    const user = this;

    // Check if the password is being changed, so we don't re-hash
    if (!user.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(user.password, salt);
        return next();
    } catch (e) {
        logger.error(e);
        return next(e);
    }
});

UserSchema.methods.isValidPassword = async function(password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (e) {
        logger.error(e.message);
        throw e;
    }
};
