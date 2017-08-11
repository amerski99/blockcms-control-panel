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
		load: function load(dispatch: Dispatch<any>, getState: () => IListState) {
			let listState = getState();

			dispatch({
				type: ActionTypes.Load
			});

			if (shouldReloadList(listState)) {
				fetchAction(dispatch, listState);
			}
		},
		selectEntity: function listSelectEntity(entityId: string) {
			return {
				type: ActionTypes.SelectEntity,
				entityId: entityId
			}
		}
	}

	function fetchAction(dispatch: Dispatch<any>, listState: IListState) {
		let query = buildQuery(listState.config);

		if (query) {
			dispatch({
				type: ActionTypes.FetchStart
			});

			return Api.queryEntities(query)
				.then((result: any) => dispatch(fetchSuccessAction(result)))
				.catch((response: any) => dispatch(fetchErrorAction(response)))
				.then(() => dispatch(fetchCompleteAction()));
		}
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
		return !listState.isLoading && !listState.isFresh;
	}
}