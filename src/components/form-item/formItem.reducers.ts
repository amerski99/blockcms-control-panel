
import { AppActions } from 'components/app';
import {  IPageState } from 'components/page';
import { addComponentReducers, ComponentGroups } from 'scripts/component-connect';
import { handleActions } from 'redux-actions';

import { toArray } from 'scripts/util';
import { FormItemActions } from 'components/form-item/formItem.actions';
import { StandardPageActions } from 'components/page/types/standard-page/standardPage.actions';
import { IFormItemState } from 'components/form-item';
import { FormActions } from 'components/form';

export namespace FormItemReducers {
	export const defaultMap ={
		[FormActions.ActionTypes.Reset]: (state: IFormItemState, action: any) => {
			return {
				...state,
				value: state.origValue
			};
		},
		[FormActions.ActionTypes.Clear]: (state: IFormItemState, action: any): IFormItemState => {
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
	};

	export const defaultReducer = handleActions(defaultMap, <IFormItemState>{});
}



function loadEntity(state: IFormItemState, action: any) {
	let value = action.result && action.result.fields[state.name];
	return {
		...state,
		value,
		origValue: value,
		isLoaded: false
	}
}