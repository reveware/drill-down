import {Logger} from '@nestjs/common';
import * as mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import {UserRole, User} from '../../../types/User';


const logger = new Logger('UserSchema');

// Should be relational with User.d.ts
const UserDefinition = {
    firstName: {type: String, required: true},
    lastName: {Type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    avatar: {type: String, required: true},
    age: Number,
    dateOfBirth: Number,
    tagLine: String,
    role: UserRole,
    posts: {type: Array, required: true},
    friends: {type: Array, required: true},
    isOnParty: Boolean,
    providers: {type: Array, required: true}
};

export const UserSchema =  new mongoose.Schema(UserDefinition, {versionKey: false});

// Hash password with bcrypt before saving
UserSchema.pre<User>('save', async function(next) {
    // TODO: See if you can bind this function to avoid re-assigning 'this'
    // eslint-disable-next-line @typescript-eslint/no-this-alias
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
