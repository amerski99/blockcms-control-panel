import * as React from 'react';

export enum FormButtonTypes {
	Save,
	Reset,
	Clear,
	Remove
}
export interface IFormButtonProp {
	label: string
	type: FormButtonTypes
	isDisabled: boolean
	onClick?(): void
}

export class FormButton extends React.Component<IFormButtonProp, {}> {
	render() {
		let { label, type, isDisabled, onClick } = this.props;
		let buttonDomType = getButtonDomType(type);

		return (
			<button
				type={buttonDomType}
				onClick={onClick ? () => onClick() : undefined}
				disabled={isDisabled}>
				{label}
			</button>
		);
	}
}

function getButtonDomType(type: FormButtonTypes) {
	if (type == FormButtonTypes.Save) return 'submit';
	if (type == FormButtonTypes.Reset) return 'reset';
	return null;
}