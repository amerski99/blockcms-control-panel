import * as React from 'react';
import { IPagePartProp } from 'components/page-part';
import { IFormItemConfig, IFormItemProp, FormItem } from 'components/form-item';
import { IFormButtonProp, FormButton } from './formButton';
import { IFormItemConfigMap } from './form.config';
import { toArray } from 'scripts/util';
import { AutoLoadComponent } from "scripts/autoloadComponent";

export interface IFormProp {
	name: string
	label: string
	formItems: IFormItemConfigMap
	buttons: IFormButtons
	isDisabled: boolean
	onLoad(): void
	onSubmit(): void
}

export interface IFormButtons {
	[type: string]: IFormButtonProp 
}

export class Form extends AutoLoadComponent<IFormProp> {
	render() {
		let { label, formItems, buttons, isDisabled } = this.props;

		return (
			<form onSubmit={this.onSubmit}>
				<h2>{label}</h2>
				<fieldset disabled={isDisabled}>
					{Object.keys(formItems).map(k => this.renderFormItem(k, formItems[k]))}
				</fieldset>
				<div className="buttons">
					{toArray(buttons).map(x => this.renderButton(x))}
				</div>
			</form>
		);
	}

	renderButton(props: IFormButtonProp) {
		return <FormButton key={props.label} {...props} />
	}

	renderFormItem(name: string, config: IFormItemConfig) {
		return <FormItem key={name} name={name} config={config} />
	}

	onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		this.props.onSubmit();
		e.preventDefault();
	}
}