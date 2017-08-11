import { AppActions } from 'components/app';
import {  IPageState } from 'components/page';
import { addComponentReducers, ComponentGroups } from 'scripts/component-connect';
import { handleActions } from 'redux-actions';

import { FormActions } from './form.actions';
import { IFormState } from './form.state';
import { toArray } from 'scripts/util';
import { FormItemActions } from 'components/form-item/formItem.actions';
import { StandardPageActions } from 'components/page/types/standard-page/standardPage.actions';

let defaultState = <IFormState>{
};

let formReducer = handleActions({
	[AppActions.ActionTypes.SelectPage]: (state: IFormState, action: any): IFormState => {
		return {
			...defaultState,
			...state
		};
	},
	[FormActions.ActionTypes.Reset]: (state: IFormState, action: any): IFormState => {
		return {
			...state,
			isModified: false
		};
	},
	[StandardPageActions.ActionTypes.ClearEntity]: (state: IFormState, action: any) => {
		return {
			...state,
			currentEntity: undefined,
			isModified: false
		};
	},
	[StandardPageActions.ActionTypes.SelectEntity]: (state: IFormState, action: any): IFormState => {
		return {
			...state,
			currentEntity: undefined,
			isModified: false,
			loadEntityId: action.entityId,
			isStale: true
		};
	},	
	[FormActions.ActionTypes.FetchStart]: (state: IFormState, action: any): IFormState => {
		return {
			...state,
			isStale: false,
			isLoading: true
		};
	},
	[FormActions.ActionTypes.FetchSuccess]: (state: IFormState, action: any): IFormState => {
		// incase multiple fetches happened before one complete,
		// make sure this is the "latest" results, if not, make no changes
		
		if (action.entityId != state.loadEntityId) return state;

		return {
			...state,
			currentEntity: {
				id: action.result.id,
				isModified: {},
				writeData: {}
			}
		}
	},
	[FormActions.ActionTypes.FetchComplete]: (state: IFormState, action: any): IFormState => {
		return {
			...state,
			isLoading: false
		};
	},
	[FormItemActions.ActionTypes.Load]: (state: IFormState, action: any): IFormState => {
		let current = state.currentEntity;
		if (!current) return state;
		let formItemName = last(action.meta.componentNames);

		let result = {
			...state,
			currentEntity: {
				...current,
				isModified: {
					...current.isModified,
					[formItemName]: false
				},
				writeData: {
					...current.writeData,
					[formItemName]: action.value
				}
			},
		};

		result.isModified = toArray(result.currentEntity.isModified)
			.every(x => x);
		return result;
	},	
	[FormItemActions.ActionTypes.Update]: (state: IFormState, action: any): IFormState => {
		let current = state.currentEntity;
		if (!current) return state;
		let formItemName = last(action.meta.componentNames);

		let result = {
			...state,
			currentEntity: {
				...current,
				isModified: {
					...current.isModified,
					[formItemName]: action.isModified
				},
				writeData: {
					...current.writeData,
					[formItemName]: action.value
				}
			},
		};
		result.isModified = toArray(result.currentEntity.isModified)
								.some(x => x);						
		return result;
	},
	[FormActions.ActionTypes.SaveStart]: saveStart,
	[FormActions.ActionTypes.RemoveStart]: saveStart,
	[FormActions.ActionTypes.SaveSuccess]: saveSuccess,
	[FormActions.ActionTypes.RemoveSuccess]: saveSuccess,
	[FormActions.ActionTypes.SaveComplete]: saveComplete,
	[FormActions.ActionTypes.RemoveComplete]: saveComplete
}, defaultState)

function saveStart(state: IFormState, action: any): IFormState {
	return {
		...state,
		isSaving: true
	};
}

function saveSuccess(state: IFormState, action: any): IFormState {
	return {
		...state,
		currentEntity: action.result ? {
			id: action.result.id,
			isModified: {},
			writeData: {}
		} : undefined
	}
}

function saveComplete(state: IFormState, action: any): IFormState {
	return {
		...state,
		isSaving: false
	};
}

function last(arr:Array<any>) {
	let a = arr||[];
	return a.length && a[a.length-1];
}

formReducer = addComponentReducers(
	ComponentGroups.FormItem,
	(state: IFormState) => state.formItems,
	(state: any) => {
		return { formItems: state }
	},
	(state: IFormState) => state.config.formItems,
	formReducer
)
export { formReducer }