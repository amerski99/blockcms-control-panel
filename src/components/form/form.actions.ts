import 'redux-thunk';
import { Dispatch } from 'react-redux';
import { IFormConfig, IFormState } from 'components/form';
import * as Api from 'scripts/api';

export namespace FormActions {
	export const ActionTypes = {
		Load: 'FORM.LOAD',
		Submit: 'FORM.SUBMIT',
		Remove: 'FORM.REMOVE',
		Reset: 'FORM.RESET',
		FetchStart: 'FORM.FETCH_START',
		FetchError: 'FORM.FETCH_ERROR',
		FetchSuccess: 'FORM.FETCH_SUCCESS',
		FetchComplete: 'FORM.FETCH_COMPLETE',
		SaveStart: 'FORM.SAVE_START',
		SaveError: 'FORM.SAVE_ERROR',
		SaveSuccess: 'FORM.SAVE_SUCCESS',
		SaveComplete: 'FORM.SAVE_COMPLETE'
	};

	export function load(entityId: string, formState: IFormState) {
		return (dispatch: Dispatch<any>) => {

			dispatch({
				type: ActionTypes.Load,
				entityId: entityId
			});

			if (shouldReloadCurrentEntity(entityId, formState)) {
				dispatch(fetchAction(entityId, formState.config));
			}
		}
	}

	export function submit(formState: IFormState) {
		return (dispatch: Dispatch<any>) => {
			let { id, writeData } = formState.currentEntity;

			dispatch({
				type: ActionTypes.Submit,
				entityId: id,
				data: writeData
			});

			if (shouldSubmit(formState)) {
				dispatch(saveAction(id, writeData))
			}
		}
	}

	export function remove(entityId: string) {
		return {
			type: ActionTypes.Remove,
			entityId: entityId
		};
	}

	export function reset() {
		return {
			type: ActionTypes.Reset
		};
	}

	function fetchAction(entityId: string, formConfig: IFormConfig) {
		return (dispatch: Dispatch<any>) => {

			dispatch({
				type: ActionTypes.FetchStart,
				entityId: entityId
			});

			let query = buildQuery(entityId, formConfig);

			if (query) {
				Api.queryEntities(query)
					.then((result: any) => dispatch(fetchSuccessAction(entityId, result)),
					(response: any) => dispatch(fetchErrorAction(entityId, response)))
					.then(() => dispatch(fetchCompleteAction(entityId)));
			}
		}
	}

	function fetchSuccessAction(entityId: string, result: any) {
		return {
			type: ActionTypes.FetchSuccess,
			entityId: entityId,
			result: result
		};
	}

	function fetchErrorAction(entityId: string, response: any) {
		return {
			type: ActionTypes.FetchError,
			entityId: entityId,
			response: response
		};
	}

	function fetchCompleteAction(entityId: string) {
		return {
			type: ActionTypes.FetchComplete,
			entityId: entityId
		};
	}

	function saveAction(entityId: string, writeData: Object) {
		return (dispatch: Dispatch<any>) => {

			dispatch({
				type: ActionTypes.SaveStart,
				entityId: entityId
			});

			let saveData = {
				fields: writeData
			};

			let saveMethod = entityId ?
				Api.updateEntity(entityId, saveData)
				: Api.insertEntity(saveData);

			saveMethod.then((result: any) => dispatch(saveSuccessAction(entityId, result)),
				(response: any) => dispatch(saveErrorAction(entityId, response)))
				.then(() => dispatch(saveCompleteAction(entityId)));
		}
	}

	function saveSuccessAction(entityId: string, result: any) {
		return {
			type: ActionTypes.SaveSuccess,
			entityId: entityId,
			result: result
		};
	}

	function saveErrorAction(entityId: string, response: any) {
		return {
			type: ActionTypes.SaveError,
			entityId: entityId,
			response: response
		};
	}

	function saveCompleteAction(entityId: string) {
		return {
			type: ActionTypes.SaveComplete,
			entityId: entityId
		};
	}

	function buildQuery(entityId: string, formConfig: IFormConfig): Api.IQueryDefinition | null {
		if (entityId) {
			return { id: entityId };
		}

		return formConfig.singleQuery;
	}

	function shouldSubmit(formState: IFormState): boolean {
		return !formState.isSaving
			&& any(formState.currentEntity.isModified, true)
	}

	function shouldReloadCurrentEntity(entityId: string, formState: IFormState): boolean {
		let currentItem = formState.currentEntity;
		return !formState.isLoading
			&& ((!currentItem && !!entityId)
				|| (currentItem && currentItem.id != entityId))
		//	|| (currentItem && !currentItem.isFresh));
	}


	function any(obj: { [name: string]: any }, value: any): boolean {
		return Object.keys(obj).some((key) => obj[key] == value);
	}
}
