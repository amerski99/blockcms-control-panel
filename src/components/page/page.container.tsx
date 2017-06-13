import * as React from 'react';
import { createStore } from 'redux';
import { connect, Dispatch } from 'react-redux';

import { ComponentGroups, wrapComponent } from 'scripts/component-connect';
import { IAppState } from 'components/app';
import { IPageConfig } from './page.config';
import { IPageState } from './page.state';

export interface IPageProp {
	name: string
}

const Page = wrapComponent(
	ComponentGroups.Page,
	(ownProps: IPageProp) => 'StandardPage',
    (ownProps: IPageProp) => (state: IAppState): IPageState =>  {
		return state.pages[ownProps.name];
	}
) as React.ComponentClass<IPageProp>

export { Page }