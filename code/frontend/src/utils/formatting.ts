import moment from 'moment';

export const formatUnixTimestamp = (timestamp: number): string => {
    return moment.unix(timestamp).fromNow()
};
