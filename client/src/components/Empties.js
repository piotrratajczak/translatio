import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import fetchEmpty from '../actionCreators/data';

class Empties extends Component {
	componentWillMount() {
		this.props.dispatch(fetchEmpty());
	}

	render() {
		const { data, error } = this.props;
		return (
			<div>
				{error}
				{!error &&
          <div className="text-center">
					<p>
              Empty tags list - to be developed if needed...
					</p>
					{Object.keys(data).map(langCode => (
						<div className="bg-faded p-3 my-2" key={langCode}>
							<h5><NavLink to={`/lang/${langCode}`}>{langCode}</NavLink></h5>
							{Object.keys(data[langCode]).map(tag => <div key={tag}>{tag}</div>)}
						</div>))}
				</div>}
			</div>
		);
	}
}

Empties.propTypes = {
	dispatch: PropTypes.func.isRequired,
	data: PropTypes.objectOf(PropTypes.objectOf(PropTypes.string)),
	error: PropTypes.bool
};

Empties.defaultProps = {
	error: false,
	data: {}
};

const mapStateToProps = state => ({
	data: state.data.extraData,
	error: state.data.fetchingError
});

export default connect(mapStateToProps)(Empties);
