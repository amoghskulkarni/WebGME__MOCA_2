/*globals define*/
/*jshint node:true, browser:true*/

/**
 * Generated by PluginGenerator 2.16.0 from webgme on Thu Apr 26 2018 21:11:23 GMT-0500 (Central Daylight Time).
 * A plugin that inherits from the PluginBase. To see source code documentation about available
 * properties and methods visit %host%/docs/source/PluginBase.html.
 */

define([
    'plugin/PluginConfig',
    'text!./metadata.json',
    'plugin/PluginBase',
    'plugin/UMPImporter/UMPImporter/equation_parser'
], function (
    PluginConfig,
    pluginMetadata,
    PluginBase,
    equationParser) {
    'use strict';

    pluginMetadata = JSON.parse(pluginMetadata);

    /**
     * Initializes a new instance of UMPImporter.
     * @class
     * @augments {PluginBase}
     * @classdesc This class represents the plugin UMPImporter.
     * @constructor
     */
    var UMPImporter = function () {
        // Call base class' constructor.
        PluginBase.call(this);
        this.pluginMetadata = pluginMetadata;
    };

    /**
     * Metadata associated with the plugin. Contains id, name, version, description, icon, configStructue etc.
     * This is also available at the instance at this.pluginMetadata.
     * @type {object}
     */
    UMPImporter.metadata = pluginMetadata;

    // Prototypical inheritance from PluginBase.
    UMPImporter.prototype = Object.create(PluginBase.prototype);
    UMPImporter.prototype.constructor = UMPImporter;

    /**
     * Main function for the plugin to execute. This will perform the execution.
     * Notes:
     * - Always log with the provided logger.[error,warning,info,debug].
     * - Do NOT put any user interaction logic UI, etc. inside this method.
     * - callback always has to be called even if error happened.
     *
     * @param {function(string, plugin.PluginResult)} callback - the result callback
     */
    UMPImporter.prototype.main = function (callback) {
        // Use self to access core, project, result, logger etc from PluginBase.
        // These are all instantiated at this point.
        var self = this,
            nodeObject;

        // Check if the plugin is executed in the client (browser) or server context
        // (if the 'window' object is undefined, it's executed on the server-side)
        if (typeof window === 'undefined') {
            // Using the logger.
            self.logger.debug('This is a debug message.');
            self.logger.info('This is an info message.');
            self.logger.warn('This is a warning message.');
            self.logger.error('This is an error message.');

            // Using the coreAPI to make changes.

            nodeObject = self.core.createNode({
                'parent': self.activeNode,
                'base': self.META['Component']
            });

            self.core.setAttribute(nodeObject, 'name', 'My new component');
            self.core.setRegistry(nodeObject, 'position', {x: 70, y: 70});


            // This will save the changes. If you don't want to save;
            // exclude self.save and call callback directly from this scope.
            self.save('UMPImporter updated model.')
                .then(function () {
                    self.result.setSuccess(true);
                    callback(null, self.result);
                })
                .catch(function (err) {
                    // Result success is false at invocation.
                    callback(err, self.result);
                });
        }

    };

    return UMPImporter;
});
