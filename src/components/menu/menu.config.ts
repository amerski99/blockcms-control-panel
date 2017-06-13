export interface IMenuConfig {
	items: Array<IMenuItemConfig>
}

export interface IMenuItemConfig {
	label: string,
	pageName?: string,
	items?: Array<IMenuItemConfig>
}

export interface IMenuGroupConfig {
	label: string,
	items: Array<IMenuItemConfig>
}

export interface IMenuLinkConfig {
	label: string
	pageName: string
}
