import { CountByTag, CustomError } from '@drill-down/common';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTagCountByUsername, selectUserTagCount } from 'src/store';
import { AppState } from 'src/store/store.type';

export const useUserTagCount = (username: string): { isLoading: boolean; error: CustomError | null; tagCount: Array<CountByTag> } => {
    const dispatch = useDispatch()
    const {isLoadingTagCount, tagCountError} = useSelector((state: AppState)=> state.users) 
    const count = useSelector((state: AppState)=> selectUserTagCount(state, username));


    useEffect(() => {
       dispatch(fetchTagCountByUsername(username))
    }, [username]);

    return { isLoading: isLoadingTagCount, tagCount: count || [], error: tagCountError };
};
