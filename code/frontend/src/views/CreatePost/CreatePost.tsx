import React, { useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Card from 'react-bootstrap/Card';
import { PostTypes } from '@drill-down/common';
import * as _ from 'lodash';
import { CreatePhotoPostForm } from './CreatePhotoPostForm';
import './CreatePost.scss';

export const CreatePost: React.FC = () => {

    const suggestions: any = []; // TODO: bring suggestions back   _.map(postsCountByTag, (count) => count.tag).slice(0, 30);

    const [tags, setTags] = useState<string[]>([]);
    const [tagSuggestions, setTagSuggestions] = useState<string[]>(suggestions);

    const handleTagAdded = (tag: string) => {
        setTags(_.uniq([...tags, tag]));
    };

    const handleTagDeleted = (tag: string, index: number) => {
        const updatedTags = [...tags];
        updatedTags.splice(index, 1);
        setTags(updatedTags);
    };

    const handleTagSuggestionClicked = (tag: string, index: number) => {
        const updatedSuggestions = [...tagSuggestions];
        updatedSuggestions.splice(index, 1);
        setTagSuggestions(updatedSuggestions);
        handleTagAdded(tag);
    };

    return (
        <React.Fragment>
            <Card className="neon-border w-50 mx-auto mt-5">
                <Card.Body>
                    <Card.Title>Create New Post</Card.Title>

                    <Tabs className="post-type-tabs" defaultActiveKey={PostTypes.PHOTO}>
                        <Tab eventKey={PostTypes.PHOTO} title="Photo">
                            <CreatePhotoPostForm
                                tagListProps={{
                                    tags: tags,
                                    editOptions: {
                                        onTagAdded: handleTagAdded,
                                        onTagDeleted: handleTagDeleted,
                                        suggestions: tagSuggestions,
                                        onSuggestionClicked: handleTagSuggestionClicked,
                                    },
                                }}
                            />
                        </Tab>
                        <Tab eventKey={PostTypes.QUOTE} title="Quote"></Tab>
                    </Tabs>
                </Card.Body>
            </Card>
        </React.Fragment>
    );
};
