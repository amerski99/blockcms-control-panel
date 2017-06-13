import * as React from 'react';
import { IPagePartProp } from 'components/page-part';
import { IEntity, IContentEntity } from 'scripts/entity';
import { IListItemMapConfig  as IMappedListItem } from 'components/list';

export interface IListProp {
	name: string,
	label: string
	isLoading: boolean
	selectedEntityId: string
	items: Array<IContentEntity>,
	mapItem(item: IContentEntity): IMappedListItem
	onLoad(): any
	onSelectItem(entityId: string): any 
}

export class ListView extends React.Component<IListProp, {}> {
	componentWillMount() {
		this.props.onLoad();
	}
	
	render() {
		let { label, items } = this.props;

		return (
			<section>
				<h2>{label}</h2>
				{this.props.isLoading? this.renderLoading() : this.renderItems(items)}
			</section>
		);
	}

	renderLoading() {
		return <div>Loading. Please wait...</div>;
	}

	renderItems(items: Array<IContentEntity>) {
		if (!items || !items.length) return <div>Nothing was found</div>;

		return (
			<ul>{items.map((i) => this.renderItem(i))}</ul>
		);
	}

	renderItem(item: IContentEntity) {
		let selected = this.props.selectedEntityId == item.id;
		let { title, subtitle, imgUrl } = this.props.mapItem(item);
		return (
			<li key={item.id} 
				className={selected ? 'selected' : ''} 
				onClick={() => this.props.onSelectItem(item.id)}>
					{title && <span className="cp-li-title">{title}</span>}
					{subtitle && <span className="cp-li-subtitle">{subtitle}</span>}
			</li>
		);
	}
}