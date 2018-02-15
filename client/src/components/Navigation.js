import {
	Collapse,
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
	NavLink,
	UncontrolledDropdown
} from 'reactstrap';
import { FORM_OPEN } from '../actions/form';
import { Link } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { logoutUser } from '../actionCreators/app';

class Navigation extends React.Component {
	constructor(props) {
		super(props);

		Object.getOwnPropertyNames(Navigation.prototype)
			.filter(method => method.indexOf('handle') === 0)
			.forEach(method => {
				this[method] = this[method].bind(this);
			});

		this.state = {
			collapsed: true
		};
	}

	toggleNavbar() {
		this.setState({
			collapsed: !this.state.collapsed
		});
	}

	handleLogout() {
		this.props.dispatch(logoutUser());
	}

	handleAddClick(evt) {
		this.props.dispatch({ type: FORM_OPEN, payload: evt.target.name });
	}

	render() {
		const { languages } = this.props;
		return (
			<nav className="navbar navbar-toggleable-md navbar-light bg-faded">
				<button
					className="navbar-toggler navbar-toggler-right"
					type="button"
					onClick={this.handleNavbarSwitch}>
					<span className="navbar-toggler-icon" />
				</button>
				<Link className="navbar-brand" to="/">
					Translation Manager
				</Link>
				<Collapse isOpen={!this.state.collapsed} navbar>
					<ul className="nav navbar-nav ml-auto w-100 justify-content-end">
						{languages.length > 0 && (
							<UncontrolledDropdown nav="true">
								<DropdownToggle nav caret>
									Languages
								</DropdownToggle>
								<DropdownMenu>
									{languages.map(lang => (
										<DropdownItem key={lang}>
											<Link className="nav-link" to={`/lang/${lang}`}>
												{lang}
											</Link>
										</DropdownItem>
									))}
								</DropdownMenu>
							</UncontrolledDropdown>
						)}
						<UncontrolledDropdown nav="true">
							<DropdownToggle nav caret>
								Fast adding
							</DropdownToggle>
							<DropdownMenu>
								{languages.length > 0 && (
									<DropdownItem name="tag" onClick={this.handleAddClick}>
										Add Tag
									</DropdownItem>
								)}
								<DropdownItem name="lang" onClick={this.handleAddClick}>
									Add Lang
								</DropdownItem>
							</DropdownMenu>
						</UncontrolledDropdown>
						<NavLink onClick={this.handleLogout}>Logout</NavLink>
					</ul>
				</Collapse>
			</nav>
		);
	}
}

Navigation.propTypes = {
	dispatch: PropTypes.func.isRequired,
	languages: PropTypes.arrayOf(PropTypes.string)
};

Navigation.defaultProps = {
	languages: []
};

const mapStateToProps = state => ({
	languages: Object.keys(state.data.langData)
});

export default connect(mapStateToProps)(Navigation);
