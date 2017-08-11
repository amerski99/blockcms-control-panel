import { DispatchAction } from 'scripts/component-connect';

export namespace StandardPageActions {
	export const ActionTypes = {
		ClearEntity: 'PAGE.ENTITY_CLEAR',
		SelectEntity: 'PAGE.ENTITY_SELECT',
		UpdateEntity: 'PAGE.ENTITY_UPDATE'
	};

	export interface IDefinition {
		clearEntity: () => any
		selectEntity: (entityId:string) => any
		updateEntity: (entity:any) => any
	}
	
	export const Default: IDefinition = {
		clearEntity: function clearEntity(){
			return {
				type: ActionTypes.ClearEntity
			};
		},
	 	selectEntity: function selectEntity(entityId:string) {
			return {
				type: ActionTypes.SelectEntity,
				entityId: entityId
			};
		},
		updateEntity: function updateEntity(entity:any) {
			return {
				type: ActionTypes.UpdateEntity,
				entity: entity
			};
		}
	}
}
