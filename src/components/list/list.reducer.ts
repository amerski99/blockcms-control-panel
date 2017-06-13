import { handleActions } from 'redux-actions';

import { IListState } from './list.state';
import { ListActions } from './list.actions';

let listReducer = handleActions({
	[ListActions.ActionTypes.FetchStart]: (state: IListState, action: any): IListState => {
		return {
			...state,
			items: [],
			isLoading: true
		};
	},
	[ListActions.ActionTypes.FetchSuccess]: (state: IListState, action: any): IListState  => {
		return  {
			...state,
			items: action.result
		}
	},
	[ListActions.ActionTypes.FetchComplete]: (state: IListState, action: any): IListState => {
		return {
			...state,
			isLoading: false
		};
	}	
}, <IListState>{
	items: []
})


export { listReducer }