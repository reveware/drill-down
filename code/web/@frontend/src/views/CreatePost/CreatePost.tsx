import React from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Card from 'react-bootstrap/Card';
import { PostTypes } from '@drill-down/interfaces';
import { CreatePhotoPostForm, Loading } from 'src/components';
import { useCreatePhotoPostMutation } from '../../hooks';
import './CreatePost.scss';
import { ToastService } from 'src/services';
import { history } from 'src/App';
import { AppRoutes } from 'src/Routes';

export const CreatePost: React.FC = () => {
    const [createPhotoPost, { isLoading }] = useCreatePhotoPostMutation();

    const handlePhotoPostSubmit = async (values: any) => {
        try {
            const { photos, description, tags } = values;
            console.log('onPhotoPostSubmit', { values });
            await createPhotoPost({ description, photos, tags }).unwrap();
            ToastService.success({ title: 'Post created!', message: '>:)' });
            history.push(AppRoutes.HOME);
        } catch (error) {
            ToastService.error(error);
        }
    };

    return (
        <Card className="neon-border w-50 mx-auto mt-5">
            <Card.Body>
                <Card.Title>Create New Post</Card.Title>

                <Tabs className="post-type-tabs" defaultActiveKey={PostTypes.PHOTO}>
                    <Tab eventKey={PostTypes.PHOTO} title="Photo">
                        {isLoading && <Loading />}
                        {!isLoading && <CreatePhotoPostForm onSubmit={handlePhotoPostSubmit} />}
                    </Tab>
                    <Tab eventKey={PostTypes.QUOTE} title="Quote"></Tab>
                </Tabs>
            </Card.Body>
        </Card>
    );
};
