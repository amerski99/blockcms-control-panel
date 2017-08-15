import { Dispatch } from 'redux';

import { registerComponent, ComponentGroups, IComponentSetup } from 'scripts/component-connect';
import { IPageProp, IPageState } from 'components/page';
import { IFormState, FormActions } from 'components/form';
import { IFormItemComponentProp, IFormItemProp, IFormItemState, IFormItemConfig } from 'components/form-item';
import { EmptyView } from '../views/empty.view';
import { FormItemActions } from '../formItem.actions';
import { FormItemReducers } from 'components/form-item/formItem.reducers';
import { registerFormItemComponent } from 'components/form-item/formItem.container';
import { handleActions } from "redux-actions";

interface IIFormItemStaticValueConfig extends IFormItemConfig {
	value: any
}

export type IFormItemStaticValueConfig = IIFormItemStaticValueConfig & { type: 'Static' };

const reducerMap = {
	...FormItemReducers.defaultMap,
	[FormActions.ActionTypes.Clear]: setState
}


function setState(state: IFormItemState, action: any):IFormItemState {
		const value = (<IFormItemStaticValueConfig>state.config).value;
		return {
			...state,
			value,
			origValue: value
		}
	}

const componentConfig: IComponentSetup<IFormItemComponentProp, FormItemActions.IDefinition> = {
	actions: FormItemActions.Defaults,
	group: ComponentGroups.FormItem,
	name: 'Static',
	reducer: handleActions(reducerMap, <IFormItemState>{}),
	viewClass: EmptyView
}


registerFormItemComponent(
	componentConfig
)