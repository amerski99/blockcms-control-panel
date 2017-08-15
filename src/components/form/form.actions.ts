import 'redux-thunk';
import { Dispatch } from 'react-redux';
import { IFormConfig, IFormState } from 'components/form';
import * as Api from 'scripts/api';
import { DispatchAction } from "scripts/component-connect";

export namespace FormActions {
	export const ActionTypes = {
		Clear: 'FORM.CLEAR',
		Load: 'FORM.LOAD',
		Remove: 'FORM.REMOVE',
		Reset: 'FORM.RESET',
		Submit: 'FORM.SUBMIT',
		FetchStart: 'FORM.FETCH_START',
		FetchError: 'FORM.FETCH_ERROR',
		FetchSuccess: 'FORM.FETCH_SUCCESS',
		FetchComplete: 'FORM.FETCH_COMPLETE',
		SaveStart: 'FORM.SAVE_START',
		SaveError: 'FORM.SAVE_ERROR',
		SaveSuccess: 'FORM.SAVE_SUCCESS',
		SaveComplete: 'FORM.SAVE_COMPLETE',
		RemoveStart: 'FORM.REMOVE_START',
		RemoveError: 'FORM.REMOVE_ERROR',
		RemoveSuccess: 'FORM.REMOVE_SUCCESS',
		RemoveComplete: 'FORM.REMOVE_COMPLETE'
	};

	export interface IDefinition {
		clear: () => any
		load: DispatchAction<any, IFormState>
		remove: DispatchAction<any, IFormState>
		reset: () => any
		submit: DispatchAction<any, IFormState>
	}

	export const Default: IDefinition = {
		clear: () => {
			return {
				type: ActionTypes.Clear
			};
		},
		load: async (dispatch: Dispatch<any>, getState: () => IFormState) => {
			let formState = getState();
			let entityId = formState.loadEntityId;

			if (entityId && formState.isStale) {
				return await fetchActionAsync(dispatch, entityId, formState.config);
			}
			else if (!formState.currentEntity && formState.isStale) {
				dispatch(Default.clear());
			}
			return false;
		},
		remove: async (dispatch: Dispatch<any>, getState: () => IFormState) => {
			let formState = getState();
			let { id } = formState.currentEntity;

			dispatch({
				type: ActionTypes.Remove,
				entityId: id
			});

			return await removeActionAsync(dispatch, id);
		},
		reset: async () => {
			return {
				type: ActionTypes.Reset
			};
		},
		submit: async (dispatch: Dispatch<any>, getState: () => IFormState) => {
			let formState = getState();
			let { id, writeData } = formState.currentEntity;

			dispatch({
				type: ActionTypes.Submit,
				entityId: id,
				data: writeData
			});

			if (shouldSubmit(formState)) {
				return await saveActionAsync(dispatch, id, writeData)
			}
			return false;
		}
	}

	async function fetchActionAsync(dispatch: Dispatch<any>, entityId: string, formConfig: IFormConfig) {
		dispatch({
			type: ActionTypes.FetchStart,
			entityId: entityId
		});

		let query = buildQuery(entityId, formConfig);
		if (!query) return;

		let result;
		try {
			result = await Api.queryEntitiesAsync(query);
			dispatch(fetchSuccessAction(entityId, result));
		}
		catch (ex) {
			dispatch(fetchErrorAction(entityId, ex));
		}
		dispatch(fetchCompleteAction(entityId));
		return result;
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

	async function saveActionAsync(dispatch: Dispatch<any>, entityId: string, writeData: Object) {
		dispatch({
			type: ActionTypes.SaveStart,
			entityId: entityId
		});

		let saveData = {
			fields: writeData
		};

		let result;

		try {
			result = await (entityId ?
					Api.updateEntityAsync(entityId, saveData) : 
					Api.insertEntityAsync(saveData));
			dispatch(saveSuccessAction(entityId, result));
		}
		catch (ex) {
			dispatch(saveErrorAction(entityId, ex));
		}
		dispatch(saveCompleteAction(entityId));
		return result;
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

	async function removeActionAsync(dispatch: Dispatch<any>, entityId: string) {
			dispatch({
				type: ActionTypes.RemoveStart,
				entityId: entityId
			});
		let result;

		try {
			result = await Api.deleteEntityAsync(entityId);
			dispatch(removeSuccessAction(entityId));
		}
		catch (ex) {
			dispatch(removeErrorAction(entityId, ex));
		}
		dispatch(removeCompleteAction(entityId));
		return result;
	}

	function removeSuccessAction(entityId: string) {
		return {
			type: ActionTypes.RemoveSuccess,
			entityId: entityId
		};
	}

	function removeErrorAction(entityId: string, response: any) {
		return {
			type: ActionTypes.RemoveError,
			entityId: entityId,
			response: response
		};
	}

	function removeCompleteAction(entityId: string) {
		return {
			type: ActionTypes.RemoveComplete,
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


	function any(obj: { [name: string]: any }, value: any): boolean {
		return Object.keys(obj).some((key) => obj[key] == value);
	}
}
