import {
	Collapse,
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
	NavLink,
	UncontrolledDropdown
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import React from 'react';

class Navigation extends React.Component {
	constructor(props) {
		super(props);

		this.toggleNavbar = this.toggleNavbar.bind(this);
		this.state = {
			collapsed: true
		};
	}

	toggleNavbar() {
		this.setState({
			collapsed: !this.state.collapsed
		});
	}
	render() {
		const { languages, onLogoutClick, onAddClick } = this.props;
		return (
			<nav className="navbar navbar-toggleable-md navbar-light bg-faded">
				<button
					className="navbar-toggler navbar-toggler-right"
					type="button"
					onClick={this.toggleNavbar}>
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
									<DropdownItem onClick={() => onAddClick('tag')}>
										Add Tag
									</DropdownItem>
								)}
								<DropdownItem onClick={() => onAddClick('lang')}>
									Add Lang
								</DropdownItem>
							</DropdownMenu>
						</UncontrolledDropdown>
						<NavLink onClick={onLogoutClick}>Logout</NavLink>
					</ul>
				</Collapse>
			</nav>
		);
	}
}

Navigation.propTypes = {
	onAddClick: PropTypes.func.isRequired,
	languages: PropTypes.arrayOf(PropTypes.string),
	onLogoutClick: PropTypes.func.isRequired
};

Navigation.defaultProps = {
	languages: []
};

export default Navigation;
