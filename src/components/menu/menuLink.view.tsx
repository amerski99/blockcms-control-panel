import * as React from 'react';
import { IMenuLinkConfig } from './menu.config';

export interface IMenuLinkProp {
	config: IMenuLinkConfig
	onPageSelect(name: string): void
}

export class MenuLink extends React.Component<IMenuLinkProp, {}> {
	render() {
		const { pageName, label } = this.props.config;

		return (
			<a onClick={() => this.props.onPageSelect(pageName)}>{label}</a>
		);
	}
}