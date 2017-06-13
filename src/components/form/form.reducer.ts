import { AppActions } from 'components/app';
import { PageActions } from 'components/page';
import { addComponentReducers, ComponentGroups } from 'scripts/component-connect';
import { handleActions } from 'redux-actions';

import { FormItemSharedActions } from 'components/form-item/actions/shared.action';
import { FormActions } from './form.actions';
import { IFormState } from './form.state';

let defaultState = <IFormState>{
	currentEntity: {
		readData: {},
		origWriteData: {},
		writeData: {}
	}
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
			currentEntity: {
				...state.currentEntity,
				writeData: Object.assign({}, state.currentEntity.origWriteData)
			},
			isModified: false,
			isLoading: true
		};
	},
	[FormActions.ActionTypes.FetchStart]: (state: IFormState, action: any): IFormState => {
		return {
			...state,
			currentEntity: {
				...state.currentEntity
			},
			isLoading: true
		};
	},
	[FormActions.ActionTypes.FetchSuccess]: (state: IFormState, action: any): IFormState => {
		return {
			...state,
			currentEntity: {
				id: action.result.id,
				isModified: {},
				readData: action.result && action.result.fields,
				origWriteData: {},
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
	[FormItemSharedActions.ActionTypes.Load]: (state: IFormState, action: any): IFormState => {
		let current = state.currentEntity;
		return {
			...state,
			currentEntity: {
				...current,
				origWriteData: {
					...current.origWriteData,
					[action.name]: action.value
				},
				writeData: {
					...current.writeData,
					[action.name]: action.value
				}
			},
		};
	},
	[FormItemSharedActions.ActionTypes.Update]: (state: IFormState, action: any): IFormState => {
		let current = state.currentEntity;
		return {
			...state,
			currentEntity: {
				...current,
				isModified: {
					 ...current.isModified,
					 [action.name]: action.isModified
				},
				writeData: {
					...current.writeData,
					[action.name]: action.value
				}
			},
		};
	}
}, defaultState)

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