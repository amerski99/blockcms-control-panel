
import { AppActions } from 'components/app';
import {  IPageState } from 'components/page';
import { addComponentReducers, ComponentGroups } from 'scripts/component-connect';
import { handleActions } from 'redux-actions';

import { toArray } from 'scripts/util';
import { FormItemActions } from 'components/form-item/formItem.actions';
import { StandardPageActions } from 'components/page/types/standard-page/standardPage.actions';
import { IFormItemState } from 'components/form-item';
import { FormActions } from 'components/form';

let formItemReducer = handleActions({
	[FormActions.ActionTypes.Reset]: (state: IFormItemState, action: any) => {
		return {
			...state,
			value: state.origValue
		};
	},
	[StandardPageActions.ActionTypes.ClearEntity]: (state: IFormItemState, action: any) => {
		return {
			...state,
			value: undefined,
			origValue: undefined
		};
	},
	[FormActions.ActionTypes.FetchSuccess]: loadEntity,
	[FormActions.ActionTypes.SaveSuccess]: loadEntity,
	[FormItemActions.ActionTypes.Load]: (state: IFormItemState, action: any) => {
		return {
			...state,
			isLoaded: true
		}
	},
	[FormItemActions.ActionTypes.Update]: (state: IFormItemState, action: any) => {
		return {
			...state,
			value: action.value
		}
	}	
}, <IFormItemState>{})

function loadEntity(state: IFormItemState, action: any) {
	let value = action.result && action.result.fields[state.name];
	return {
		...state,
		value,
		origValue: value,
		isLoaded: false
	}
}

export { formItemReducer }