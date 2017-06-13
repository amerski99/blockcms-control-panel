import { Dispatch } from 'redux';

export const ActionTypes = {
	ClearItem: 'PAGE.CLEAR_ITEM',
    SelectItem: 'PAGE.SELECT_ITEM'
};

export function clearItemAction(selectedEntityId: string) {
    return {
        type: ActionTypes.ClearItem,
        entityId: selectedEntityId
    };
}

export function selectItemAction(entityId: string) {
    return  {
        type: ActionTypes.SelectItem,
        entityId: entityId
    };
}