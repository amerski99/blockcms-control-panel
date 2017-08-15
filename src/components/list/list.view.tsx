import * as React from 'react';
import { IPagePartProp } from 'components/page-part';
import { IEntity, IContentEntity } from 'scripts/entity';
import { IListItemMapConfig  as IMappedListItem } from 'components/list';
import { AutoLoadComponent } from 'scripts/autoloadComponent';

export interface IListProp {
	name: string,
	label: string
	isLoading: boolean
	selectedEntityId: string
	items: Array<IContentEntity>,
	mapItem(item: IContentEntity): IMappedListItem
	onLoad(): any
	onSelectEntity(entityId: string): any 
}

export class ListView extends AutoLoadComponent<IListProp> {
	render() {
		let { label, items } = this.props;

		return (
			<section>
				<h2>{label}</h2>
				{this.props.isLoading? this.renderLoading() : this.renderEntities(items)}
			</section>
		);
	}

	renderLoading() {
		return <div>Loading. Please wait...</div>;
	}

	renderEntities(items: Array<IContentEntity>) {
		if (!items || !items.length) return <div>Nothing was found</div>;

		return (
			<ul>{items.map((i) => this.renderEntity(i))}</ul>
		);
	}

	renderEntity(entity: IContentEntity) {
		let selected = this.props.selectedEntityId == entity.id;
		let { title, subtitle, imgUrl } = this.props.mapItem(entity);
		return (
			<li key={entity.id} 
				className={selected ? 'selected' : ''} 
				onClick={() => this.props.onSelectEntity(entity.id)}>
					{title && <span className="cp-li-title">{title}</span>}
					{subtitle && <span className="cp-li-subtitle">{subtitle}</span>}
			</li>
		);
	}
}