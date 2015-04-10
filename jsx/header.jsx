(function(views){

    views.Menu = React.createClass({
        getInitialState: function() {
           return {
                activeMenu: ''
           };
         },

         setActiveMenu: function(e) {
             e.preventDefault();
             if (this.state.activeMenu !== "active") {
                 this.setState({activeMenu: "active"});
             }
             else {
                 this.setState({activeMenu: ""});
             }
         },

        goToGoals: function(e) {
            e.preventDefault();
            app.trigger("fetch:goals:collection");
            this.setState({activeMenu: ""});
        },

        goToTeamDashboard: function(e) {
            e.preventDefault();
            app.trigger("fetch:users:collection");
            this.setState({activeMenu: ""});
        },

        goToProfile: function(e) {
            e.preventDefault();
            app.trigger("show:profile");
            this.setState({activeMenu: ""});
        },

        goalButton: function(daysFromStart) {
            if (daysFromStart < 0) {
                return (
                    <button 
                        className="button"
                        onClick={this.props.addGoal}>+ Goal
                    </button>
                )
            }
            else {
                return;
            }
        },

        entryButton: function(daysFromStart) {
            if (daysFromStart >= 0) {
                return (
                    <button className="button"
                        onClick={this.props.addEntry}>+ Entry
                    </button>
                )
            }
        },

        componentDidMount: function() {

        },

        render: function() {
            var team = this.props.team;
            team = team.toJSON();

            var start_date = moment(team.datepicker);
            var now = moment();

            var daysFromStart = now.diff(start_date, 'days');

            var menuClass = "menu-wrapper " + this.state.activeMenu;

            return (
                <div className={menuClass}>

                <div className="main-menu">
                    <ul>
                        <li>
                            <a href="#" onClick={this.goToTeamDashboard}>Team Dashboard</a>
                        </li>
                        <li>
                            <a href="#" onClick={this.goToGoals}>My Goals</a>
                        </li>
                        <li>
                            <a href="#" onClick={this.goToProfile}>My Profile</a>
                        </li>
                        <li className="entry-lg">
                            {this.goalButton(daysFromStart)}
                            {this.entryButton(daysFromStart)}
                        </li>

                    </ul>
                </div>
                </div>

            )
        }

    });

    views.Header = React.createClass({ 
        // setActiveMenu: function() {
        //     alert("yup");
        // },

        showMenuButton: function() {
            if (!_.isEmpty( app.currentUser.attributes )) {
              return <div className="button button-menu" onClick={this.setActiveMenu}>Menu</div>
            }
            else {
                return;
            }
        },

        render: function() {

            return (
                <div className="header-wrapper">
                    <div className="header-bar">
                        {this.showMenuButton()}
                        <h1 className="logo">SweatBet</h1>
                        <div className="header-admin">
                            <views.LogInOut model={this.props.model} />
                        </div>  
                    </div>
                </div>

            )
        }

    });

})(app.views);