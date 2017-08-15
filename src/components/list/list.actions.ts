import 'redux-thunk';
import { Dispatch } from 'react-redux';
import * as Api from 'scripts/api';
import { IListConfig, IListState } from 'components/list';
import { DispatchAction } from "scripts/component-connect";


export namespace ListActions {
	export const ActionTypes = {
		Load: 'LIST.LOAD',
		SelectEntity: 'LIST.SELECT',
		FetchStart: 'LIST.FETCH_START',
		FetchError: 'LIST.FETCH_ERROR',
		FetchSuccess: 'LIST.FETCH_SUCCESS',
		FetchComplete: 'LIST.FETCH_COMPLETE'
	};

	export interface IDefinition {
		load:  DispatchAction<any, IListState>
		selectEntity: (entityId: string) => any
	}

	export const Defaults: IDefinition = {
		load: async function listLoad(dispatch: Dispatch<any>, getState: () => IListState){
			let listState = getState();

			if (shouldReloadList(listState)) {
				return await fetchActionAsync(dispatch, listState);
			}
		},
		selectEntity: function listSelectEntity(entityId: string) {
			return {
				type: ActionTypes.SelectEntity,
				entityId: entityId
			}
		}
	}

	async function fetchActionAsync(dispatch: Dispatch<any>, listState: IListState) {
		dispatch({
			type: ActionTypes.FetchStart
		});

		let query = buildQuery(listState.config);
		if (!query) return;

		let result;
		try {
			result = await Api.queryEntitiesAsync(query);
			dispatch(fetchSuccessAction(result));
		}
		catch (ex) {
			dispatch(fetchErrorAction(ex));
		}
		dispatch(fetchCompleteAction());
		return result;
	}

	function fetchSuccessAction(result: any) {
		return {
			type: ActionTypes.FetchSuccess,
			result: result
		};
	}

	function fetchErrorAction(response: any) {
		return {
			type: ActionTypes.FetchError,
			response: response
		};
	}

	function fetchCompleteAction() {
		return {
			type: ActionTypes.FetchComplete
		};
	}

	function buildQuery(listConfig: IListConfig): Api.IQueryDefinition | null {
		return listConfig.query;
	}


	function shouldReloadList(listState: IListState): boolean {
		return listState.isStale;
	}
}