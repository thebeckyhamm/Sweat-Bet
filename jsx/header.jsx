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

        goToGoals: function() {
            app.trigger("fetch:goals:collection");
            this.setState({activeMenu: ""});
        },

        goToTeamDashboard: function() {
            app.trigger("fetch:users:collection");
            this.setState({activeMenu: ""});

        },

        goalButton: function(daysFromStart) {
            if (daysFromStart <= 0) {
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

        render: function() {
            var team = this.props.team;
            team = team.toJSON();

            var start_date = moment(team.start_date);
            var now = moment();

            var daysFromStart = now.diff(start_date, 'days');

            var menuClass = "menu-wrapper " + this.state.activeMenu;

            return (
                <div className={menuClass}>

                <div className="main-menu">
                    <ul>
                        <li>
                            <a href="#" onClick={this.props.goToTeamDashboard}>Team Dashboard</a>
                        </li>
                        <li>
                            <a href="#" onClick={this.props.goToGoals}>My Goals</a>
                        </li>
                        <li>
                            <a href="#">My Profile</a>
                        </li>
                        <li className="entry-lg">
                            {this.goalButton(this.props.daysFromStart)}
                            {this.entryButton(this.props.daysFromStart)}
                        </li>

                    </ul>
                </div>
                </div>

            )
        }

    });

    views.Header = React.createClass({ 







        render: function() {

            return (
                <div className="header-wrapper">
                    <div className="header-bar">
                        <div className="button button-menu" onClick={this.setActiveMenu}>Menu</div>
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