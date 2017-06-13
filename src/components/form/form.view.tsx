import * as React from 'react';
import { IPagePartProp } from 'components/page-part';
import { IFormItemConfig, IFormItemProp, FormItem } from 'components/form-item';
import { IFormButtonProp, FormButton } from './formButton';
import { IFormItemConfigMap } from './form.config';

export interface IFormProp {
	name: string
	label: string
	formItems: IFormItemConfigMap
	buttons: Array<IFormButtonProp>
	isDisabled: boolean
	onLoad(): void
	onSubmit(): void
}

export class Form extends React.Component<IFormProp, {}> {
	componentWillMount() {
		this.props.onLoad();
	}

	componentWillReceiveProps(nextProps: Readonly<IFormProp>, nextContext: any) {
		nextProps.onLoad();
	}

	render() {
		let { label, formItems, buttons, isDisabled } = this.props;

		return (
			<form onSubmit={this.onSubmit}>
				<h2>{label}</h2>
				<fieldset disabled={isDisabled}>
					{Object.keys(formItems).map(k => this.renderFormItem(k, formItems[k]))}
				</fieldset>
				<div className="buttons">
					{buttons.map(x => this.renderButton(x))}
				</div>
			</form>
		);
	}

	renderButton(prop: IFormButtonProp) {
		return <FormButton key={prop.label} {...prop} />
	}

	renderFormItem(name: string, config: IFormItemConfig) {
		return <FormItem key={name} name={name} config={config} />
	}

	onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		this.props.onSubmit();
		e.preventDefault();
	}
}