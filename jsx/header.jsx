(function(views){

    var Menu = React.createClass({

        render: function() {
            return (
                <div className="main-menu">
                    <ul>
                        <li className="first-to-last">
                            <a href="#" className="button">+ Entry</a>
                        </li>
                        <li>
                            <a href="#">Dashboard</a>
                        </li>
                        <li>
                            <a href="#">My Goals</a>
                        </li>
                        <li>
                            <a href="#">My Profile</a>
                        </li>
                    </ul>
                </div>
            )
        }

    });

    views.Header = React.createClass({ 
        getInitialState: function() {
           return {
                activeMenu: ''
           };
         },

        setActiveMenu: function(e) {
            e.preventDefault();
            console.log(this.state.activeMenu);
            if (this.state.activeMenu !== "active") {
                this.setState({activeMenu: "active"});
            }
            else {
                this.setState({activeMenu: ""});
            }
        },

        render: function() {
                var menuClass = "menu-wrapper " + this.state.activeMenu;
            return (
                <div className="header-wrapper">
                    <div className="header-bar">
                        <div className="button button-menu" onClick={this.setActiveMenu}>Menu</div>
                        <h1 className="logo">Final Project</h1>
                        <div className="header-admin">
                            <views.LogInOut model={this.props.model} />
                        </div>
                    </div>
                    <div className={menuClass}>
                        <Menu />
                    </div>
                </div>

            )
        }

    });

})(app.views);