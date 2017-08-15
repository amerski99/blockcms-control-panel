import * as React from 'react';

import { IPagePartConfig } from './pagePart.config';
import { IPagePartState } from './pagePart.state';

import { wrapComponent, ComponentGroups, IComponentWrapProps } from 'scripts/component-connect';
import { IPageState } from 'components/page';

export interface IPagePartProp extends IComponentWrapProps {
	config: IPagePartConfig	
	onClearEntity(): any
	onRemoveEntity(entityId:string): any
	onSelectEntity(entityId:string): any
	onUpdateEntity(entity:any): any
}
 
const PagePart = wrapComponent(
	ComponentGroups.PagePart,
    (ownProps: IPagePartProp) => (state: IPageState): IPagePartState =>  {
		return state.parts[ownProps.name]
	}
) as React.ComponentClass<IPagePartProp>

export { PagePart }

