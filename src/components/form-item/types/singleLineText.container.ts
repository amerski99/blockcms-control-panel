import { Dispatch } from 'redux';

import { registerComponent, ComponentGroups, IComponentSetup } from 'scripts/component-connect';
import { IPageProp, IPageState } from 'components/page';
import { IFormState } from 'components/form';
import { IFormItemProp, IFormItemState } from 'components/form-item';
import { IStandardInputProp, StandardInput } from '../views/standardInput.view';
import { FormItemActions } from 'components/form-item/formItem.actions';
import { FormItemReducers } from 'components/form-item/formItem.reducers';
import { registerFormItemComponent } from 'components/form-item/formItem.container';


const componentConfig: IComponentSetup<IStandardInputProp, FormItemActions.IDefinition> = {
	actions: FormItemActions.Defaults,
	group: ComponentGroups.FormItem,
	name: 'SingleLineText',
	reducer: FormItemReducers.defaultReducer,
	viewClass: StandardInput
}

registerFormItemComponent(
	componentConfig
)