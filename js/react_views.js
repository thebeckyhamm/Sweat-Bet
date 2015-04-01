(function(views){

    views.MainDash = React.createClass({displayName: "MainDash",

        render: function() {
            return (
                React.createElement("section", {className: "main"}, 
                    React.createElement("header", {className: "header-main"}, 
                        React.createElement("h2", {className: "team-name"}, "Eat My Dust"), 
                        React.createElement("button", {className: "button button-primary"}, "+ Entry")
                    ), 
                    React.createElement("div", {className: "results-toggle"}, 
                        React.createElement("button", {className: "button button-secondary"}, "To Date"), 
                        React.createElement("button", {className: "button"}, "Week 5")
                    ), 
                    React.createElement("article", {className: "all-goals"}, 
                        React.createElement("h3", null, "All Goals"), 
                        React.createElement("span", {className: "completion-rate completion-rate-lg"}, "45%"), 
                        React.createElement("div", {className: "progress-bar progress-bar-lg"}), 
                        React.createElement("hr", null), 
                        React.createElement("h4", null, "Run 15 mi per week"), 
                        React.createElement("span", {className: "completion-rate"}, "55%"), 
                        React.createElement("div", {className: "progress-bar"})
                    )
                )
            );
        }

    });



})(app.views);
(function(views){

    var Menu = React.createClass({displayName: "Menu",

        render: function() {
            return (
                React.createElement("div", {className: "main-menu"}, 
                    React.createElement("ul", null, 
                        React.createElement("li", {className: "first-to-last"}, 
                            React.createElement("a", {href: "#", className: "button"}, "+ Entry")
                        ), 
                        React.createElement("li", null, 
                            React.createElement("a", {href: "#"}, "Dashboard")
                        ), 
                        React.createElement("li", null, 
                            React.createElement("a", {href: "#"}, "My Goals")
                        ), 
                        React.createElement("li", null, 
                            React.createElement("a", {href: "#"}, "My Profile")
                        )
                    )
                )
            )
        }

    });

    views.Header = React.createClass({displayName: "Header", 
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
                React.createElement("div", {className: "header-wrapper"}, 
                    React.createElement("div", {className: "header-bar"}, 
                        React.createElement("div", {className: "button button-menu", onClick: this.setActiveMenu}, "Menu"), 
                        React.createElement("h1", {className: "logo"}, "Final Project"), 
                        React.createElement("div", {className: "header-admin"}, 
                            React.createElement("button", {className: "button button-secondary"}, "Sign In/Up")
                        )
                    ), 
                    React.createElement("div", {className: menuClass}, 
                        React.createElement(Menu, null)
                    )
                )

            )
        }

    });

})(app.views);