import 'redux-thunk';
import { Action, Dispatch } from 'redux';
import { IFormConfig, IFormState } from 'components/form';
import * as Api from 'scripts/api';
import { IFormItemState } from 'components/form-item';
import { DispatchAction } from 'scripts/component-connect';


export namespace FormItemActions {
	export const ActionTypes = {
		Load: 'FORM_ITEM.LOAD',
		Update: 'FORM_ITEM.UPDATE'
	};


	export interface IDefinition {
		load:  DispatchAction<any, IFormItemState>
		update(dispatch: Dispatch<any>, getState: () => IFormItemState, value: string): void		
	}

	export const Defaults: IDefinition = {
		load: function loadFormItem(dispatch: Dispatch<any>, getState: () => IFormItemState) {
			let state = getState();

			if (!state.isLoaded) {
				dispatch({
					type: ActionTypes.Load,
					value: state.value
				});
			}
		},
		update: function updateFormItemValue(dispatch: Dispatch<any>, getState: () => IFormItemState, value: string) {
			let state = getState();
			let origValue = state.origValue;
				
			dispatch({
				type: ActionTypes.Update,
				value: value,
				isModified: origValue !== value
			});
		}			
	};
}