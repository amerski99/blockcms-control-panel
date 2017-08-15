import { handleActions } from 'redux-actions';

import { IListState } from './list.state';
import { ListActions } from './list.actions';
import { StandardPageActions } from "components/page/types/standard-page/standardPage.actions";
import { AppActions } from "components/app";

let listReducer = handleActions({
	[AppActions.ActionTypes.SelectPage]: makeStale,
	[StandardPageActions.ActionTypes.ClearEntity]: (state: IListState, action: any): IListState => {
		return {
			...state,
			selectedEntityId: undefined
		};
	},	
	[StandardPageActions.ActionTypes.RemoveEntity]: (state: IListState, action: any): IListState => {
		return {
			...state,
			items: state.items.filter(x => x.id != action.entityId)
		};
	},
	[StandardPageActions.ActionTypes.SelectEntity]: (state: IListState, action: any): IListState => {
		return {
			...state,
			selectedEntityId: action.entityId
		};
	},	
	[StandardPageActions.ActionTypes.UpdateEntity]: makeStale,
	[ListActions.ActionTypes.FetchStart]: (state: IListState, action: any): IListState => {
		return {
			...state,
			items: [],
			isLoading: true,
			isStale: false
		};
	},
	[ListActions.ActionTypes.FetchSuccess]: (state: IListState, action: any): IListState => {
		return {
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

function makeStale(state: IListState, action: any): IListState {
	return {
		...state,
		isStale: true
	};
}

export { listReducer }