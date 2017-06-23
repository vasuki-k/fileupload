/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
'use strict';

/**
 * Example of Require.js boostrap javascript
 */

requirejs.config(
        {
            baseUrl: 'js',

            // Path mappings for the logical module names
            paths:
                    //injector:mainReleasePaths
                            {
                                'knockout': 'libs/knockout/knockout-3.4.0',
                                'jquery': 'libs/jquery/jquery-3.1.0.min',
                                'jqueryui-amd': 'libs/jquery/jqueryui-amd-1.12.0.min',
                                'promise': 'libs/es6-promise/es6-promise.min',
                                'hammerjs': 'libs/hammer/hammer-2.0.8.min',
                                'ojdnd': 'libs/dnd-polyfill/dnd-polyfill-1.0.0.min',
                                'ojs': 'libs/oj/v2.3.0/min',
                                'ojL10n': 'libs/oj/v2.3.0/ojL10n',
                                'ojtranslations': 'libs/oj/v2.3.0/resources',
                                'text': 'libs/require/text',
                                'signals': 'libs/js-signals/signals.min',
                                'customElements': 'libs/webcomponents/CustomElements',
                                'proj4': 'libs/proj4js/dist/proj4-src',
                                'css': 'libs/require-css/css',
                                'config': 'appConfig',
                                'bootstrap': 'libs/bootstrap/js/bootstrap.min',
                                'moment': 'libs/moment/moment.min',
                                'lte': 'libs/lte/js/app.min',
                                'basemaps': 'libs/oj/v2.3.0/resources/internal-deps/dvt/thematicMap/basemaps',
                                'slimscroll':'libs/jQuery-slimScroll-1.3.8/jquery.slimscroll.min'
                            }
                    //endinjector
                    ,
                    // Shim configurations for modules that do not expose AMD
                    shim:
                            {
                                'jquery':
                                        {
                                            exports: ['jQuery', '$']
                                        },
                                'bootstrap': {
                                    deps: ['jquery'],
                                    exports: 'bootstrap'

                                },
                                'lte': {
                                    deps: ['jquery'],
                                    exports: 'lte'

                                }
                            }
                }
        );

        /**
         * A top-level require call executed by the Application.
         * Although 'ojcore' and 'knockout' would be loaded in any case (they are specified as dependencies
         * by the modules themselves), we are listing them explicitly to get the references to the 'oj' and 'ko'
         * objects in the callback
         */
        require(['ojs/ojcore', 'knockout', 'appController', 'ojs/ojknockout',
            'ojs/ojmodule', 'ojs/ojrouter', 'ojs/ojnavigationlist', 'ojs/ojbutton', 'ojs/ojtoolbar', 'bootstrap', 'lte'],
                function (oj, ko, app) { // this callback gets executed when all required modules are loaded

                    $(function () {

                        function init() {
                            oj.Router.sync().then(
                                    function () {
                                        // Bind your ViewModel for the content of the whole page body.
                                        ko.applyBindings(app, document.getElementById('globalBody'));
                                    },
                                    function (error) {
                                        oj.Logger.error('Error in root start: ' + error.message);
                                    }
                            );
                        }

                        // If running in a hybrid (e.g. Cordova) environment, we need to wait for the deviceready 
                        // event before executing any code that might interact with Cordova APIs or plugins.
                        if ($(document.body).hasClass('oj-hybrid')) {
                            document.addEventListener("deviceready", init);
                        } else {
                            init();
                        }

                    });

                }
        );
