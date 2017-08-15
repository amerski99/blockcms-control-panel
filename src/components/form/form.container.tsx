import * as React from 'react';
import { ActionCreator } from 'redux';


import { registerComponent, ComponentGroups, IComponentSetup, Dispatcher } from 'scripts/component-connect';
import { IAppState } from 'components/app';
import { IPageState } from 'components/page';
import { IPagePartProp } from 'components/page-part';

import { FormActions } from './form.actions';
import { IFormConfig } from './form.config';
import { formReducer } from './form.reducer';
import { IFormState } from './form.state';
import { Form, IFormProp, IFormButtons } from './form.view';
import { FormButtonTypes, IFormButtonProp } from './formButton';

const config: IComponentSetup<IFormProp, FormActions.IDefinition> = {
	group: ComponentGroups.PagePart,
	actions: FormActions.Default,
	name: 'Form',
	reducer: formReducer,
	viewClass: Form
}

function mapStateToProps(formState: IFormState) {
	let config = formState.config as IFormConfig;

	let buttons: IFormButtons = {};
	let isWorking = formState.isSaving || formState.isLoading;

	buttons[FormButtonTypes.Save] = {
		label: 'Save',
		type: FormButtonTypes.Save,
		isDisabled: !formState.isModified || isWorking
	} as IFormButtonProp;

	if (config.isRemoveEnabled && !!formState.currentEntity) {
		buttons[FormButtonTypes.Remove] = {
			label: 'Remove',
			isDisabled: isWorking
		} as IFormButtonProp;
	}

	if (config.isResetEnabled) {
		buttons[FormButtonTypes.Reset] = {
			label: 'Reset',
			isDisabled: !formState.isModified || isWorking,
		} as IFormButtonProp;
	}

	if (config.isClearEnabled && !!formState.currentEntity) {
		buttons[FormButtonTypes.Clear] = {
			label: 'Clear',
			isDisabled: isWorking
		} as IFormButtonProp;
	}

	Object.keys(buttons).forEach((k:any) => {
		buttons[k].type = k as FormButtonTypes;
	});
	return {
		label: config.type,
		formItems: config.formItems,
		buttons: buttons,
		isDisabled: formState.isSaving
	}
}

function mapDispatchToProps(dispatch: Dispatcher<any>, ownProps: IPagePartProp, actions: FormActions.IDefinition) {
	return (topDispatch: Dispatcher<any>) => {
		return {
			onClear: async () => {
				await actions.clear();
				return await ownProps.onClearEntity();
			},
			onLoad: () => dispatch(actions.load),
			onRemove: async () =>{
				const result = await dispatch(actions.remove);
				if (result) {
					return await ownProps.onRemoveEntity(result);
				}
			},
			onReset: () => dispatch(actions.reset),
			onSubmit: async () => {
				const result = await dispatch(actions.submit);
				if (result) {
					return await ownProps.onUpdateEntity(result);
				}
			}
		}
	}
};

function mergeProps(stateProps: any, dispatchProps: any, ownProps: IPagePartProp): IFormProp {
	setButtonAction(stateProps, FormButtonTypes.Clear, dispatchProps.onClear);
	setButtonAction(stateProps, FormButtonTypes.Remove, dispatchProps.onRemove);
	setButtonAction(stateProps, FormButtonTypes.Reset, dispatchProps.onReset);

	return {
		...stateProps,
		onLoad: dispatchProps.onLoad,
		onSubmit: dispatchProps.onSubmit
	}
}

function setButtonAction(stateProps: any, buttonType: FormButtonTypes, action: any) {
	if (stateProps.buttons[buttonType]) {
		stateProps.buttons[buttonType].onClick = action;
	}
	return stateProps;
}

registerComponent(
	config,
	mapStateToProps,
	mapDispatchToProps,
	mergeProps
)