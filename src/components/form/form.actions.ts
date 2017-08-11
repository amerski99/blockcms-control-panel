import 'redux-thunk';
import { Dispatch } from 'react-redux';
import { IFormConfig, IFormState } from 'components/form';
import * as Api from 'scripts/api';
import { DispatchAction } from "scripts/component-connect";

export namespace FormActions {
	export const ActionTypes = {
		Clear: 'FORM.RESET',
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
		clear: function formClear(){
			return {
				type: ActionTypes.Clear
			};
		},
	 	load: function formLoad(dispatch: Dispatch<any>, getState: () => IFormState) {
			let formState = getState();
			let entityId = formState.loadEntityId;

			if (shouldReloadCurrentEntity(entityId, formState)) {
				fetchAction(dispatch, entityId, formState.config);
			}
		},
		remove: function formRemove(dispatch: Dispatch<any>, getState: () => IFormState) {
			let formState = getState();
			let { id } = formState.currentEntity;

			dispatch({
				type: ActionTypes.Remove,
				entityId: id
			});

			//if (shouldSubmit(formState)) {
			dispatch(removeAction(id))
			//}
		},
		reset: function formReset() {
			return {
				type: ActionTypes.Reset
			};
		},
		submit: function formSubmit(dispatch: Dispatch<any>, getState: () => IFormState) {
			let formState = getState();
			let { id, writeData } = formState.currentEntity;

			dispatch({
				type: ActionTypes.Submit,
				entityId: id,
				data: writeData
			});

			if (shouldSubmit(formState)) {
				return saveAction(dispatch, id, writeData)
			}
		}
	}

	function fetchAction(dispatch: Dispatch<any>, entityId: string, formConfig: IFormConfig) {
		dispatch({
			type: ActionTypes.FetchStart,
			entityId: entityId
		});

		let query = buildQuery(entityId, formConfig);

		if (query) {
			return Api.queryEntities(query)
				.then((result: any) => dispatch(fetchSuccessAction(entityId, result)))
				.catch((response: any) => dispatch(fetchErrorAction(entityId, response)))
				.then(() => dispatch(fetchCompleteAction(entityId)));
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

	function saveAction(dispatch: Dispatch<any>, entityId: string, writeData: Object) {
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

		return saveMethod
			.then((result: any) => dispatch(saveSuccessAction(entityId, result)))
			.catch((response: any) => dispatch(saveErrorAction(entityId, response)))
			.then(() => dispatch(saveCompleteAction(entityId)));
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

	function removeAction(entityId: string) {
		return (dispatch: Dispatch<any>) => {

			dispatch({
				type: ActionTypes.RemoveStart,
				entityId: entityId
			});

			return Api.deleteEntity(entityId)
				.then((result: any) => dispatch(removeSuccessAction(entityId)),
				(response: any) => dispatch(removeErrorAction(entityId, response)))
				.then(() => dispatch(removeCompleteAction(entityId)));
		}
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

	function shouldReloadCurrentEntity(entityId: string, formState: IFormState): boolean {
		return formState.isStale;
	}


	function any(obj: { [name: string]: any }, value: any): boolean {
		return Object.keys(obj).some((key) => obj[key] == value);
	}
}
