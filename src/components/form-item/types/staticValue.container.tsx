import { Dispatch } from 'redux';

import { registerComponent, ComponentGroups, IComponentSetup } from 'scripts/component-connect';
import { IPageProp, IPageState } from 'components/page';
import { IFormState } from 'components/form';
import { IFormItemComponentProp, IFormItemProp, IFormItemState, IFormItemConfig } from 'components/form-item';
import { EmptyView } from '../views/empty.view';
import { FormItemActions } from '../formItem.actions';
import { formItemReducer } from 'components/form-item/formItem.reducers';
import { registerFormItemComponent } from 'components/form-item/formItem.container';

interface IIFormItemStaticValueConfig extends IFormItemConfig {
	value: any
}

export type IFormItemStaticValueConfig = IIFormItemStaticValueConfig & { type: 'Static' };

const actions = {
	...FormItemActions.Defaults,
	load: function loadStaticFormItem(dispatch: Dispatch<any>, getState: () => IFormItemState) {
		let state = getState();
		let config = state.config as IFormItemStaticValueConfig;

		if (!state.isLoaded) {
			dispatch({
				type: FormItemActions.ActionTypes.Load,
				value: config.value 	// get value from config instead of from state
			});
		}
	}
}
const componentConfig: IComponentSetup<IFormItemComponentProp, FormItemActions.IDefinition> = {
	actions: actions,
	group: ComponentGroups.FormItem,
	name: 'Static',
	reducer: formItemReducer,
	viewClass: EmptyView
}


registerFormItemComponent(
	componentConfig
)