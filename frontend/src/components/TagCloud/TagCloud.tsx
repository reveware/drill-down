import React from 'react';
import {PostCountByTag} from "@drill-down/interfaces";
import ReactWordcloud from 'react-wordcloud';

import './TagCloud.scss';


interface TagCloudProps {
    postsCountByTags: PostCountByTag[]
}

export const TagCloud: React.FC<TagCloudProps> = (props) => {
    const {postsCountByTags} = props;

    return (<div className="tag-cloud">
        <ReactWordcloud words={postsCountByTags}
                        maxWords={80}
                        callbacks={{
                            onWordClick: ({text})=> {alert('here we find posts tagged with: ' + text)},
                            getWordTooltip: ({text, value})=> value
                        }}
                        options={{
                            rotations: 0,
                            colors: [
                                '#000000',
                                '#ffd700',
                                '#90ee90',
                                '#00ff00',
                                '#800080'
                            ],
                            scale: 'sqrt',
                            fontSizes: [10, 50],
                        }}/>
    </div>)
}