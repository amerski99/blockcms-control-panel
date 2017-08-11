import * as React from 'react';
import { ActionCreator } from 'redux';

import { registerComponent, ComponentGroups, IComponentSetup, Dispatcher } from 'scripts/component-connect';
import { IContentEntity } from 'scripts/entity';
import { toArray } from 'scripts/util';
import { IPageState } from 'components/page';
import { IPagePartProp } from 'components/page-part';

import { IListConfig, IListItemMapConfig } from './list.config';
import { IListState } from './list.state';
import { ListActions } from './list.actions';
import { listReducer } from './list.reducer';
import { IListProp, ListView } from './list.view';


const config: IComponentSetup<IListProp, ListActions.IDefinition> = {
	actions: ListActions.Defaults,
	group: ComponentGroups.PagePart,
	name: 'List',
	reducer: listReducer,
	viewClass: ListView
}

function mapStateToProps(
	state: IListState
) {
	let config = state.config as IListConfig;

	return {
		label: config.label,
		isLoading: state.isLoading,
		items: state.items,
		selectedEntityId: state.selectedEntityId,
		mapItem: (item: IContentEntity) => mapEntity(item, config.itemMap),
	};
}

function mapDispatchToProps(dispatch: Dispatcher<any>, ownProps: IPagePartProp, actions: ListActions.IDefinition) {
	return (topDispatch: Dispatcher<any>) => {
		return  {
			onLoad: () => dispatch(actions.load),
			onSelectEntity: (entityId: string) => ownProps.onSelectEntity(entityId)
		}
	}
}

function mergeProps(a: any, b: any, c: any): IListProp {
	return { ...a, ...b, ...c } as IListProp;
}

registerComponent(
	config,
	mapStateToProps,
	mapDispatchToProps,
	mergeProps
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