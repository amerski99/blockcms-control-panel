import * as React from 'react';

import { IPagePartConfig } from './pagePart.config';
import { IPagePartState } from './pagePart.state';

import { wrapComponent, ComponentGroups } from 'scripts/component-connect';
import { IPageState } from 'components/page';

export interface IPagePartProp  {
	name: string
	config: IPagePartConfig	
}
 
const PagePart = wrapComponent(
	ComponentGroups.PagePart,
	(ownProps: IPagePartProp) => ownProps.config.type,
    (ownProps: IPagePartProp) => (state: IPageState): IPagePartState =>  {
		return state.parts[ownProps.name]
	}
) as React.ComponentClass<IPagePartProp>

export { PagePart }

