export namespace AppActions {
	export const ActionTypes = {
		SelectPage: 'APP.SELECT_PAGE'
	};

	export function selectPage(pageName: string) {
		return {
			type: ActionTypes.SelectPage,
			pageName: pageName
		};
	}
}