import Notifications from 'react-notification-system-redux';
import { PropTypes } from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

const NotificationComponent = props => {
	const translatedNotifications = props.notifications.map(notification => ({
		...notification,
		message: notification.message,
		title: notification.title
	}));

	return <Notifications notifications={translatedNotifications} />;
};

NotificationComponent.contextTypes = {
	store: PropTypes.object
};

NotificationComponent.propTypes = {
	notifications: PropTypes.arrayOf(PropTypes.shape({}))
};

NotificationComponent.defaultProps = { notifications: [] };

export default connect(state => ({ notifications: state.notifications }))(NotificationComponent);
