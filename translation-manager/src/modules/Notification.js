import { LANG_ADDED, LANG_UPDATED, TAG_ADDED } from '../actions/data';
import Notifications from 'react-notification-system-redux';

function getTitle(action) {
	let title = null;
	switch (action) {
	case LANG_ADDED:
		title = 'Adding New Language';
		break;
	case LANG_UPDATED:
		title = 'Updating Language Data';
		break;
	case TAG_ADDED:
		title = 'Adding New Tag';
		break;
	default:
		title = 'DB Event!';
	}
	return title;
}

class Notification {
	static getDbEventNotification(data) {
		return Notifications[data.success ? 'success' : 'error']({
			title: getTitle(data.action),
			message: data.success ? 'Action was successful' : data.error,
			position: 'tr',
			autoDismiss: 5
		});
	}
}

export default Notification;
