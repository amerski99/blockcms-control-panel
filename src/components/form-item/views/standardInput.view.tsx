import * as React from 'react';
import { IFormItemComponentProp } from 'components/form-item/formItem.container';
import { AutoLoadComponent } from 'scripts/autoloadComponent';

// TODO: implement
export interface IStandardInputProp extends IFormItemComponentProp {
	inputType:string
}


export class StandardInput extends AutoLoadComponent<IStandardInputProp> {
	constructor(props: IStandardInputProp, ctx: any) {
		super(props, ctx);

		this.onChange = this.onChange.bind(this);
	}


	render() {
		const { inputType, value, label } = this.props;
		return (
			<div className="standard-input">
				<label>{label}</label>
				<input type={inputType} value={value||''} onChange={this.onChange} />
			</div>
		);
	}

	onChange(event:React.ChangeEvent<HTMLInputElement>) {
		this.props.onUpdate(event.target.value);
	}
}