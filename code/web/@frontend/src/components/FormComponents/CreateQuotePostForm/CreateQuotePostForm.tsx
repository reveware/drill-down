import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { CreateQuotePost } from '@drill-down/interfaces';

interface CreateQuotePostFormProps {
    onSubmit: (post: CreateQuotePost.Request) => void;
}
export const CreateQuotePostForm: React.FC<CreateQuotePostFormProps> = (props) => {
    const { onSubmit } = props;

    const validations: { [key in keyof CreateQuotePost.Request]: any } = {
        author: Yup.string().required(),
        quote: Yup.string().required(),
        date: Yup.date().optional(),
        location: Yup.string().optional(),
        description: Yup.string().optional(),
        tags: Yup.array().min(1, 'At least 1 tag is required'),
    };

    const QuotePostSchema = Yup.object().shape(validations);

    const initialValues = {
        tags: [],
        description: undefined,
        author: undefined,
        quote: undefined,
        date: undefined,
        location: undefined,
    };

    return <Formik validationSchema={QuotePostSchema} initialValues={initialValues} onSubmit={onSubmit}>
        {()=> (
            <div>
                git 
            </div>
        )}
    </Formik>;
};
