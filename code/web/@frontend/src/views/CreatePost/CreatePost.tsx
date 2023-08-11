import React from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Card from 'react-bootstrap/Card';
import { CreatePhotoPost, CreateQuotePost, PostTypes } from '@drill-down/interfaces';
import { CreatePhotoPostForm, Loading, CreateQuotePostForm } from 'src/components';
import { useCreatePhotoPostMutation, useCreateQuotePostMutation } from '../../hooks';
import './CreatePost.scss';
import { Prompts, ToastService } from 'src/services';
import { AppRoutes } from 'src/Routes';
import { useNavigate } from 'react-router-dom';

export const CreatePost: React.FC = () => {
    const [createPhotoPost, { isLoading: isCreatingPhotoPost }] = useCreatePhotoPostMutation();
    const [createQuotePost, {isLoading: isCreatingQuotePost}] = useCreateQuotePostMutation();
    const navigate = useNavigate();

    const handlePhotoPostSubmit = async (values: CreatePhotoPost.Request) => {
        try {
            console.log('onPhotoPostSubmit', { values });
            await createPhotoPost(values).unwrap();
            navigate(AppRoutes.HOME);
        } catch (error) {
            ToastService.prompt(Prompts.ErrorHandled, error);
        }
    };

    const handleQuotePostSubmit = async (values: CreateQuotePost.Request) => {
        try {
            console.log('onQuotePostSubmit', {values});
            await createQuotePost(values).unwrap();
            navigate(AppRoutes.HOME);
        } catch (error) {
            ToastService.prompt(Prompts.ErrorHandled, error);
        }
    }

    return (
        <Card className="neon-border w-50 mx-auto mt-5">
            <Card.Body>
                <Card.Title>Create New Post</Card.Title>

                <Tabs className="post-type-tabs" defaultActiveKey={PostTypes.PHOTO}>
                    <Tab eventKey={PostTypes.PHOTO} title="Photo">
                        {isCreatingPhotoPost && <Loading />}
                        {!isCreatingPhotoPost && <CreatePhotoPostForm onSubmit={handlePhotoPostSubmit} />}
                    </Tab>
                    <Tab eventKey={PostTypes.QUOTE} title="Quote">
                        {isCreatingQuotePost && <Loading/>}
                        {!isCreatingQuotePost && <CreateQuotePostForm onSubmit={handleQuotePostSubmit}/>}
                    </Tab>
                </Tabs>
            </Card.Body>
        </Card>
    );
};
