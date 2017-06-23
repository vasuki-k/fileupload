/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your application specific code will go here
 */
define(['ojs/ojcore', 'knockout', 'config', 'moment', 'ojs/ojrouter', 'ojs/ojknockout', 'ojs/ojarraytabledatasource',
    'ojs/ojoffcanvas'],
        function (oj, ko, config, moment) {
            function ControllerViewModel() {
                var self = this;

                // Media queries for repsonsive layouts
                var smQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
                self.smScreen = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);
                var mdQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.MD_UP);
                self.mdScreen = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(mdQuery);

                // Router setup
                self.router = oj.Router.rootInstance;
                self.router.configure({
                    'homeDB': {label: 'Home', isDefault: true}
                    
                });
                oj.Router.defaults['urlAdapter'] = new oj.Router.urlParamAdapter();

                // Navigation setup
                var navData = [
                    {name: 'Home', id: 'homeDB',
                        iconClass: 'fa fa-home fa-2x oj-navigationlist-item-icon', visible: true}
                  
                ];
                self.navDataSource = new oj.ArrayTableDataSource(navData, {idAttribute: 'id'});

                // Drawer
                // Called by nav drawer option change events so we can close drawer after selection
                self.navChangeHandler = function (event, data) {
                    if (data.option === 'selection' && data.value !== self.router.stateId()) {
                        self.toggleDrawer();
                    }
                }
                // Close offcanvas on medium and larger screens
                self.mdScreen.subscribe(function () {
                    oj.OffcanvasUtils.close(self.drawerParams);
                });
                self.drawerParams = {
                    displayMode: 'push',
                    selector: '#navDrawer',
                    content: '#pageContent'
                };
                // Called by navigation drawer toggle button and after selection of nav drawer item
                self.toggleDrawer = function () {
                    return oj.OffcanvasUtils.toggle(self.drawerParams);
                };

                // Header
                // Application Name used in Branding Area
                self.appName = ko.observable("");
                // User Info used in Global Navigation area

                self.asOfDate = ko.observable();
                self.asOfDate(config.date || moment().format('DD-MMM-YYYY'));
                self.prod = ko.observable(config.prod);

                /*Load User Data*/
                self.username = ko.observable("SPAR");
                self.displayName = ko.observable("Store Manager");
                self.role = ko.observable("Store Manager");
                self.token = ko.observable();
                self.domain = ko.observable('bosch');
                self.domain_css = ko.observable('bosch_css');
                self.currentLocationID = ko.observable('BGTTA');

                $.getJSON('user', function (user) {
                    self.token(user.user.token);
                    config.token = user.user.token;
                    self.username(user.user.username);
                    self.displayName(user.user.displayName);
                    self.role(user.user.role);
                    self.currentLocationID = ko.observable(user.user.location);
//                    self.domain(user.user.domain);
//                    self.domain_css(user.user.domain + '_title');
                });

                self.menuItemSelect = function (event, ui) {
                    switch (ui.item.attr("id")) {
                        case "about":
                            $("#aboutDialog").ojDialog("open");
                            break;
                        case "out":
                            window.location.href = 'logout';
                        default:
                    }
                };

                // Footer
                function footerLink(name, id, linkTarget) {
                    this.name = name;
                    this.linkId = id;
                    this.linkTarget = linkTarget;
                }
                self.footerLinks = ko.observableArray([
                    new footerLink('About Bosch', 'aboutBosch', '#'),
                    new footerLink('Contact Us', 'contactUs', '#'),
                    new footerLink('Legal Notices', 'legalNotices', '#'),
                    new footerLink('Terms Of Use', 'termsOfUse', '#')
                ]);
            }

            return new ControllerViewModel();
        }
);
