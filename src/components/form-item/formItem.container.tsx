import * as React from 'react';

import { wrapComponent, ComponentGroups, Dispatcher, IComponentSetup, registerComponent, IComponentWrapProps } from 'scripts/component-connect';
import { IPageState } from 'components/page';
import { IFormState } from 'components/form';
import { IFormItemConfig } from './formItem.config';
import { IFormItemState } from './formItem.state';
import { FormItemActions } from 'components/form-item/formItem.actions';


export interface IFormItemProp extends IComponentWrapProps {
	config: IFormItemConfig
}

export interface IFormItemComponentProp {
	label?: string
	value: any
	onUpdate?(newValue:any):any
	onLoad():any
}

export const FormItem = wrapComponent(
	ComponentGroups.FormItem,
    (ownProps: IFormItemProp) => (state: IFormState): IFormItemState =>  {
		return state.formItems[ownProps.name]
	}
) as React.ComponentClass<IFormItemProp>

export namespace FormItemDefaultContainer {
	export function mapStateToProps(state: IFormItemState, ownProps: IFormItemProp) {
		return {
			label: ownProps.config.label,
			value: state.value
		}
	}

	export function mapDispatchToProps(dispatch: Dispatcher<any>, ownProps: IFormItemProp, actions: FormItemActions.IDefinition) {
		return (topDispatch: Dispatcher<any>) => {
			return {
				onLoad: () => dispatch(actions.load),
				onUpdate: (value: string) => dispatch((d, s) => actions.update(d, s, value))
			};
		}
	}

	export function mergeProps(a: any, b: any, c: any): IFormItemComponentProp {
		return { ...a, ...b, ...c } as IFormItemComponentProp;
	}
}


export function registerFormItemComponent<TPropEnd extends IFormItemComponentProp>(
	component: IComponentSetup<TPropEnd, FormItemActions.IDefinition>
) {
	return registerComponent(component, 
		FormItemDefaultContainer.mapStateToProps,
		FormItemDefaultContainer.mapDispatchToProps,
		FormItemDefaultContainer.mergeProps);
}