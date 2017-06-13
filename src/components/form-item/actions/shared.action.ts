import 'redux-thunk';
import { Dispatch } from 'react-redux';
import { IFormConfig, IFormState } from 'components/form';
import * as Api from 'scripts/api';

export namespace FormItemSharedActions {
	export const ActionTypes = {
		Load: 'FORM_ITEM.LOAD',
		Update: 'FORM_ITEM.UPDATE'
	};

	/**
	 * Call when a form item is loading.  Should return action with readValue parsed into a writeValue
	 * @param readValue the original value read from server
	 * @param formItemState the current state of the form item
	 */
	export function load(name: string, readValue: any, origWriteValue: any, formItemState: any) {
		return (dispatch: Dispatch<any>) => {

			// TODO: allow custom function to extract write value from read value
			let writeValue = readValue;

			// make sure value isn't already loaded
			if (origWriteValue !== writeValue) {
				dispatch({
					type: ActionTypes.Load,
					name: name,
					value: readValue
				});
			}
		}
	}

	export function update(name: string, writeValue: any, origWriteValue: any, formItemState: any) {
		return {
			type: ActionTypes.Update,
			name: name,
			value: writeValue,
			isModified: origWriteValue !== writeValue
		};
	}
}