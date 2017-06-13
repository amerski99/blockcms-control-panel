import * as React from 'react';


import { wrapComponent, ComponentGroups } from 'scripts/component-connect';
import { IAutoLoadComponentProp } from 'scripts/autoloadComponent';
import { IPageState } from 'components/page';
import { IFormState } from 'components/form';
import { IFormItemConfig } from './formItem.config';
import { IFormItemState } from './formItem.state';


export interface IFormItemProp {
	name: string
	config: IFormItemConfig
}
 

export interface IFormItemComponentProp extends IAutoLoadComponentProp {
	label?: string
	value: any
	onUpdate?(newValue:any):void
}

const FormItem = wrapComponent(
	ComponentGroups.FormItem,
	(ownProps: IFormItemProp) => ownProps.config.type,
    (ownProps: IFormItemProp) => (state: IFormState): IFormItemState =>  {
		return state.formItems[ownProps.name]
	}
) as React.ComponentClass<IFormItemProp>

export { FormItem }

