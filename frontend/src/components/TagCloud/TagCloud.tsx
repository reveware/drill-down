import React from 'react';
import { CountByTag } from '@drill-down/interfaces';

import * as _ from 'lodash';
import { Card } from 'react-bootstrap';
import './TagCloud.scss';


interface TagCloudProps {
    postsCountByTags: CountByTag[];
    onTagClicked: (tag: string) => void;
    className?: string;
}

export const TagCloud: React.FC<TagCloudProps> = (props) => {
    const { postsCountByTags, onTagClicked, className } = props;

    const words = _.map(postsCountByTags, (postCount) => ({ text: `#${postCount.tag}`, value: postCount.count }));

    if (_.isEmpty(words)) {
        return null;
    }

    return (
        <Card className={className ?? ""}>
            {/* <ReactWordcloud
                words={words}
                maxWords={80}
                callbacks={{
                    onWordClick: (word) => {
                        onTagClicked(word.text.replace('#', ''));
                    },

                    getWordTooltip: ({ text, value }) => `${value} posts contain the tag: ${text}`,
                }}
                options={{
                    rotations: 0,
                    colors: ['#000000', '#ffd700', '#90ee90', '#00ff00', '#800080'],
                    scale: 'sqrt',
                    fontSizes: [10, 50],
                }}
            /> */}
        </Card>
    );
};
