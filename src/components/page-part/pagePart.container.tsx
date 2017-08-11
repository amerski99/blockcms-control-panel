import * as React from 'react';

import { IPagePartConfig } from './pagePart.config';
import { IPagePartState } from './pagePart.state';

import { wrapComponent, ComponentGroups, IComponentWrapProps } from 'scripts/component-connect';
import { IPageState } from 'components/page';

export interface IPagePartProp extends IComponentWrapProps {
	config: IPagePartConfig	
	onClearEntity(): void
	onSelectEntity(entityId:string): void
	onUpdateEntity(entity:any): void
}
 
const PagePart = wrapComponent(
	ComponentGroups.PagePart,
    (ownProps: IPagePartProp) => (state: IPageState): IPagePartState =>  {
		return state.parts[ownProps.name]
	}
) as React.ComponentClass<IPagePartProp>

export { PagePart }

