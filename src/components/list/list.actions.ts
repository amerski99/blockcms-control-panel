import 'redux-thunk';
import { Dispatch } from 'react-redux';
import * as Api from 'scripts/api';
import { IListConfig, IListState } from 'components/list';


export namespace ListActions {
	export const ActionTypes = {
		Load: 'LIST.LOAD',
		FetchStart: 'LIST.FETCH_START',
		FetchError: 'LIST.FETCH_ERROR',
		FetchSuccess: 'LIST.FETCH_SUCCESS',
		FetchComplete: 'LIST.FETCH_COMPLETE'
	};

	export function load(listState: IListState) {
		return (dispatch: Dispatch<any>) => {

			dispatch({
				type: ActionTypes.Load
			});

			if (shouldReloadList(listState)) {
				dispatch(fetchAction(listState));
			}
		}
	}

	function fetchAction(listState: IListState) {
		return (dispatch: Dispatch<any>) => {

			dispatch({
				type: ActionTypes.FetchStart
			});

			let query = buildQuery(listState.config);

			if (query) {
				dispatch((dispatch:Dispatch<any>) => Api.queryEntities(query))
					.then((result: any) => dispatch(fetchSuccessAction(result)))
					.catch((response: any) => dispatch(fetchErrorAction(response)))
					.then(() => dispatch(fetchCompleteAction()));
			}
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