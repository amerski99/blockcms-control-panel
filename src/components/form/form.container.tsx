import * as React from 'react';
import { ActionCreator, Dispatch } from 'redux';

import { registerComponent, ComponentGroups, IComponentConfig } from 'scripts/component-connect';
import { IAppState } from 'components/app';
import { IPageState, PageActions } from 'components/page';
import { IPagePartProp } from 'components/page-part';

import { FormActions } from './form.actions';
import { IFormConfig } from './form.config';
import { formReducer } from './form.reducer';
import { IFormState } from './form.state';
import { Form, IFormProp } from './form.view';
import { FormButtonTypes, IFormButtonProp } from './formButton';

const config: IComponentConfig<IFormProp> = {
	group: ComponentGroups.PagePart,
	name: 'Form',
	reducer: formReducer,
	viewClass: Form
}

let mapStateDispatchToProps = (ownProps: IPagePartProp, formState: IFormState, pageState: IPageState, formDispatch: Dispatch<any>, pageDispatch: Dispatch<any>): IFormProp =>{	
	let config = ownProps.config as IFormConfig;
	let buttons: Array<IFormButtonProp> = [];

	buttons.push({
		label: 'Save',
		type: FormButtonTypes.Save,
		isDisabled: false
	});

	if (config.isRemoveEnabled) {
		buttons.push({
			label: 'Remove',
			type: FormButtonTypes.Remove,
			isDisabled: false,
			onClick: () => pageDispatch(FormActions.remove(pageState.selectedEntityId))
		});		
	}

	if (config.isResetEnabled) {
		buttons.push({
			label: 'Remove',
			type: FormButtonTypes.Remove,
			isDisabled: false,
			onClick: () => formDispatch(FormActions.reset())
		});		
	}

	if (config.isClearEnabled) {
		buttons.push({
			label: 'Clear',
			type: FormButtonTypes.Clear,
			isDisabled: false,
			onClick: () => pageDispatch(PageActions.clearItemAction(pageState.selectedEntityId))
		});
	}

	return {
		name: ownProps.name,
		label: config.type,
		formItems: config.formItems,
		buttons: buttons,
		isDisabled: formState.isSaving,
		onLoad: () => formDispatch(FormActions.load(pageState.selectedEntityId, formState)),
		onSubmit: () => pageDispatch(FormActions.submit(formState))
	};
}


registerComponent(
	config,
	mapStateDispatchToProps
)