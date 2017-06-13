import * as React from 'react';
import { IAppConfig } from 'components/app';
import { Menu } from 'components/menu';
import { IPageConfig, Page } from 'components/page';



export interface IAppProp {
	config: IAppConfig,
	selectedPage: string;
	onPageSelect(pageName: string): any;
}

export class App extends React.Component<IAppProp, {}> {
	render() {
		const appConfig = this.props.config;
		const selectedPageName = this.props.selectedPage;
		const selectedPageConfig = selectedPageName && appConfig.pages[selectedPageName];

		return (
			<main id="cp-app">
				<Menu config={appConfig.menu} onPageSelect={this.props.onPageSelect} />
				{selectedPageConfig ?
					this.renderPage(selectedPageName, selectedPageConfig) : this.renderStartPage()}
			</main>
		)
	}

	renderPage(name: string, config: IPageConfig) {
		return <Page name={name} />
	}

	renderStartPage() {
		return <div className="page-start">Start page</div>
	}
}

