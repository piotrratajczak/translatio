import {
	Collapse,
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
	NavLink,
	UncontrolledDropdown,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import React from 'react';

class Navigation extends React.Component {
	constructor(props) {
		super(props);

		this.toggleNavbar = this.toggleNavbar.bind(this);
		this.state = {
			collapsed: true,
		};
	}

	toggleNavbar() {
		this.setState({
			collapsed: !this.state.collapsed,
		});
	}
	render() {
		return (
			<nav className="navbar navbar-toggleable-md navbar-light bg-faded">
				<button
					className="navbar-toggler navbar-toggler-right"
					type="button"
					onClick={this.toggleNavbar}
				>
					<span className="navbar-toggler-icon" />
				</button>
				<Link className="navbar-brand" to="/">
					Translation Manager
				</Link>
				<Collapse isOpen={!this.state.collapsed} navbar>
					<ul className="nav navbar-nav ml-auto w-100 justify-content-end">
						{this.props.languages.length && (
							<UncontrolledDropdown nav="true">
								<DropdownToggle nav caret>
									Languages
								</DropdownToggle>
								<DropdownMenu>
									{this.props.languages.map(lang => (
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
								<DropdownItem>
									<Link className="nav-link" to="/add/tag">
										Add tag
									</Link>
								</DropdownItem>
								<DropdownItem>
									<Link className="nav-link" to="/add/lang">
										Add lang
									</Link>
								</DropdownItem>
							</DropdownMenu>
						</UncontrolledDropdown>
						<NavLink onClick={this.props.onLogoutClick}>Logout</NavLink>
					</ul>
				</Collapse>
			</nav>
		);
	}
}

export default Navigation;
