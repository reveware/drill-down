import * as mongoose from 'mongoose';
import { Comment } from '@drill-down/interfaces';

const CommentDefinition = {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: { type: String, required: true },
    postId: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'},
    replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: false },
};

export interface CommentDocument extends Comment, mongoose.Document {}

export const CommentSchema = new mongoose.Schema(CommentDefinition, { versionKey: false });
