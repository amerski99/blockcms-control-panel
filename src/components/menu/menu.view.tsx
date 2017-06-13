import * as React from 'react';
import { MenuLink } from './menuLink.view';
import { IMenuConfig, IMenuItemConfig, IMenuGroupConfig, IMenuLinkConfig } from './menu.config';

export interface IMenuProp {
	config: IMenuConfig;
	onPageSelect(pageName: string): void;
}

export class Menu extends React.Component<IMenuProp, {}> {
	render() {
		return (
			<nav className="top-menu">
				{this.renderItems(this.props.config.items)}
			</nav>
		);
	}

	renderItems(items: Array<IMenuItemConfig>) {
		return items && items.length ? 
			<ul>{items.map((item, key) => this.renderItem(key, item))}</ul> :
			<span className="group-empty"></span>

	}

	renderItem(key: number, item: IMenuItemConfig): JSX.Element {
		let onPageSelect = this.props.onPageSelect;
		return (
			<li key={key}>{item.items ?
				this.renderGroup(item as IMenuGroupConfig) :
				<MenuLink config={item as IMenuLinkConfig} onPageSelect={onPageSelect} />}
			</li>
		)
	}

	renderGroup(group: IMenuGroupConfig) {
		return (
			<div className="menu-group">
				<span className="group-name">{group.label}</span>
				{this.renderItems(group.items)}
			</div>

		);
	}
}