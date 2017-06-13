import * as React from 'react';
import { ActionCreator, Dispatch } from 'redux';

import { registerComponent, ComponentGroups, IComponentConfig } from 'scripts/component-connect';
import { IContentEntity } from 'scripts/entity';
import { toArray } from 'scripts/util';
import { IPageState, PageActions } from 'components/page';
import { IPagePartProp } from 'components/page-part';

import { IListConfig, IListItemMapConfig } from './list.config';
import { IListState } from './list.state';
import { ListActions } from './list.actions';
import { listReducer } from './list.reducer';
import { IListProp, ListView } from './list.view';




const config: IComponentConfig<IListProp> = {
	group: ComponentGroups.PagePart,
	name: 'List',
	reducer: listReducer,
	viewClass: ListView
}

const mapStateDispatchToProps = (ownProps: IPagePartProp,
	localState: IListState,
	pageState: IPageState,
	localDispatch: Dispatch<any>,
	pageDispatch: Dispatch<any>): IListProp => {
	let config = localState.config as IListConfig;

	console.log('page state', pageState);
	
	return {
		name: ownProps.name,
		label: config.label,
		isLoading: localState.isLoading,
		items: localState.items,
		selectedEntityId: pageState.selectedEntityId,
		mapItem: (item: IContentEntity) => mapEntity(item, config.itemMap),
		onLoad: () => localDispatch(ListActions.load(localState)),
		onSelectItem: (entityId: string) => pageDispatch(PageActions.selectItemAction(entityId))
	};
}

registerComponent(
	config,
	mapStateDispatchToProps
);


function mapEntity(entity: IContentEntity, map: IListItemMapConfig): IListItemMapConfig {
	let result: any = {}

	Object.keys(map).forEach(key => {
		result[key] = mapField(entity, (map as any)[key]);
	});

	return result;
}

function mapField(entity: IContentEntity, fieldMap: string): any {
	let split = fieldMap.split('.');

	if (split.length > 1) {
		let parentItem = entity.fields[split[0]];
		// IMPROVE: send rest of the string instead of just next item to allow deeper nesting
		return mapField(entity, split[1]);
	}
	else {
		return entity.fields[fieldMap];
	}
}