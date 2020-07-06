import * as mongoose from 'mongoose';
import { Post } from '../../../interfaces';

const PostDefinition = {
    // https://stackoverflow.com/questions/18001478/referencing-another-schema-in-mongoose
    type: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    body: { type: Object, required: true },
    stars: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tags: { type: Array /*mongoose.Schema.Types.ObjectId, ref: 'Tag'*/, required: true },
    description: { type: String },
};

export interface PostDocument extends Post, mongoose.Document {}

export const PostSchema = new mongoose.Schema(PostDefinition, { versionKey: false });
