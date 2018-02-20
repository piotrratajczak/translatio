import {
	FETCH_EMPTY_FULFILLED,
	FETCH_EMPTY_PENDING,
	FETCH_EMPTY_REJECTED,
	LANG_ADDED,
	LANG_DELETED,
	LANG_UPDATED,
	TAG_ADDED,
	TAG_DELETED
} from '../actions/data';
import { FORM_SET_LOADING } from '../actions/form';
import Notifications from 'react-notification-system-redux';

function getTitle(action) {
	let title = null;
	switch (action) {
	case LANG_ADDED:
		title = 'Adding New Language';
		break;
	case LANG_DELETED:
		title = 'Deleting Language';
		break;
	case LANG_UPDATED:
		title = 'Updating Language Data';
		break;
	case TAG_ADDED:
		title = 'Adding New Tag';
		break;
	case TAG_DELETED:
		title = 'Deleting Tag';
		break;
	case FETCH_EMPTY_PENDING:
		title = 'Fetching data!';
		break;
	case FETCH_EMPTY_REJECTED:
		title = 'Fetchin data error!';
		break;
	case FETCH_EMPTY_FULFILLED:
		title = 'Fetching data success!';
		break;
	default:
		title = 'DB Event!';
	}
	return title;
}

class ActionHelper {
	static getNotification(data) {
		return Notifications[data.success ? 'success' : 'error']({
			title: getTitle(data.action),
			message: data.success ? 'Action was successful' : data.error,
			position: 'tr',
			autoDismiss: 5
		});
	}

	static getFormAction(data) {
		let action = null;
		if (data.action === LANG_ADDED || data.action === TAG_ADDED) {
			action = {
				type: FORM_SET_LOADING,
				payload: {
					loading: false,
					show: !data.success,
					error: data.error
				}
			};

			if (data.success) {
				action.value = '';
			}
		}
		return action;
	}
}

export default ActionHelper;
