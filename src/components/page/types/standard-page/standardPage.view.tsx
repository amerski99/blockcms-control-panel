import * as React from 'react';
import { IPageConfig } from 'components/page';
import { IPagePartConfig, PagePart } from 'components/page-part';

export interface IStandardPageProp {
	parts: { [name:string]: IPagePartConfig }
	onClearEntity(): void
	onSelectEntity(entityId:string): void
	onUpdateEntity(entity:any): void
}

export class StandardPage extends React.Component<IStandardPageProp, {}> {
	constructor(props: IStandardPageProp, ctx: any) {
		super(props, ctx)
	}
	render() {
		const pageParts = this.props.parts;

		return (
			<div className="page">
				{Object.keys(pageParts).map(name =>
					this.renderPart(name, pageParts[name]))}
			</div>
		);
	}

	renderPart(name: string, config: IPagePartConfig) {
		return <PagePart key={name} {...this.props} name={name} config={config} />
	}
}