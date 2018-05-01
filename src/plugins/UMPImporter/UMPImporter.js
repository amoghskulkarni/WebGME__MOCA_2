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
    'q',
    '../Library/equation_parser.js',
    '../Library/xml-js.js'
], function (
    PluginConfig,
    pluginMetadata,
    PluginBase,
    Q,
    equationParser,
    xmlParser) {
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
        this.equationParser = equationParser;
        this.xmlParser = xmlParser;
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

    UMPImporter.prototype.parseMathMLEquation = function(mathmlnode) {
        var mathmlEquationString = "";

        if (mathmlnode.name === 'math' || mathmlnode.name === 'mrow' || mathmlnode.name === 'msqrt') {
            for (var i = 0; i < mathmlnode.elements.length; i++) {
                var mathmlEquationElementObj = mathmlnode.elements[i.toString()];
                if (mathmlEquationElementObj.name === 'mi') {
                    if (mathmlEquationElementObj.elements !== undefined && mathmlEquationElementObj.elements.length > 0) {
                        var identifierChar = mathmlEquationElementObj.elements['0'].text;
                        if (identifierChar === 'π') {
                            identifierChar = 'pi';
                        }
                        mathmlEquationString += identifierChar;
                    }
                } else if (mathmlEquationElementObj.name === 'mo') {
                    if (mathmlEquationElementObj.elements !== undefined && mathmlEquationElementObj.elements.length > 0) {
                        var operatorChar = mathmlEquationElementObj.elements['0'].text;
                        if (operatorChar === '×') {
                            operatorChar = '*'
                        }
                        mathmlEquationString += operatorChar;
                    }
                } else if (mathmlEquationElementObj.name === 'mn') {
                    if (mathmlEquationElementObj.elements !== undefined && mathmlEquationElementObj.elements.length > 0) {
                        mathmlEquationString += mathmlEquationElementObj.elements['0'].text;
                        if (i < mathmlnode.elements.length - 1) {
                            var nextMathmlEquationElementObj = mathmlnode.elements[(i+1).toString()];
                            if (nextMathmlEquationElementObj.name !== 'mo') {
                                mathmlEquationString += '*';
                            }
                        }
                    }
                } else if (mathmlEquationElementObj.name === 'msub') {
                    // Process the stem first
                    var stem = this.parseMathMLEquation(mathmlEquationElementObj.elements['0']);

                    // Then the subscript
                    var subscript = this.parseMathMLEquation(mathmlEquationElementObj.elements['1']);

                    mathmlEquationString += (stem + '_' + subscript);
                } else if (mathmlEquationElementObj.name === 'mfrac') {
                    // Process the numerator first
                    var numerator = this.parseMathMLEquation(mathmlEquationElementObj.elements['0']);

                    // Then the denominator
                    var denominator = this.parseMathMLEquation(mathmlEquationElementObj.elements['1']);

                    mathmlEquationString += '(' + numerator + ')' + '/' + '(' + denominator + ')';
                } else if (mathmlEquationElementObj.name === 'msqrt') {
                    // Process the internal term first
                    var internal_term = this.parseMathMLEquation(mathmlEquationElementObj);

                    mathmlEquationString += 'sqrt(' + internal_term + ')';
                }
            }
        } else if (mathmlnode.name === 'mi') {
            if (mathmlnode.elements !== undefined && mathmlnode.elements.length > 0) {
                identifierChar = mathmlnode.elements['0'].text;
                if (identifierChar === 'π') {
                    identifierChar = 'pi';
                }
                mathmlEquationString += identifierChar;
            }
        } else if (mathmlnode.name === 'mo') {
            if (mathmlnode.elements !== undefined && mathmlnode.elements.length > 0) {
                operatorChar = mathmlnode.elements['0'].text;
                if (operatorChar === '×') {
                    operatorChar = '*'
                }
                mathmlEquationString += operatorChar;
            }
        } else if (mathmlnode.name === 'mn') {
            if (mathmlnode.elements !== undefined && mathmlnode.elements.length > 0) {
                mathmlEquationString += mathmlnode.elements['0'].text;
            }
        } else if (mathmlnode.name === 'msub') {
            // Process the stem first
            stem = this.parseMathMLEquation(mathmlnode.elements['0']);

            // Then the subscript
            subscript = this.parseMathMLEquation(mathmlnode.elements['1']);

            mathmlEquationString += (stem + '_' + subscript);
        } else if (mathmlnode.name === 'mfrac') {
            // Process the numerator first
            numerator = this.parseMathMLEquation(mathmlnode.elements['0']);

            // Then the denominator
            denominator = this.parseMathMLEquation(mathmlnode.elements['1']);

            mathmlEquationString += '(' + numerator + ')' + '/' + '(' + denominator + ')';
        }

        return mathmlEquationString;
    };

    UMPImporter.prototype.flattenTree = function (tree) {
        var ret = [];
        for (var i = 0; i < tree.length; i++) {
            if (tree[i] instanceof Array) {
                var r = this.flattenTree(tree[i]);
                for (var j = 0; j < r.length; j++) {
                    ret.push(r[j]);
                }
            } else {
                ret.push(tree[i]);
            }
        }
        return ret;
    };

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

        // Using the logger.
        // self.logger.debug('This is a debug message.');
        // self.logger.info('This is an info message.');
        // self.logger.warn('This is a warning message.');
        // self.logger.error('This is an error message.');

        // Using the coreAPI to make changes.
        var componentLibraryNode = self.activeNode;

        var xmlFile = self.core.getAttribute(componentLibraryNode, 'UMPSpec');

        var jsonString = this.xmlParser.xml2json(xmlFile, {compact: false, spaces: 4});
        var jsonObj = JSON.parse(jsonString);
        self.logger.info('UMPSpec converted into JSON');

        var umpObj = jsonObj.elements["0"];

        for (var e = 0; e < umpObj.elements.length; e++) {
            if (umpObj.elements[e.toString()].name === 'Transformation') {
                var transformationObj = umpObj.elements[e.toString()];
                for (var t = 0; t < transformationObj.elements.length; t++) {
                    if (transformationObj.elements[t.toString()].name === 'Equation') {
                        var equationObj = transformationObj.elements[t.toString()],
                            equationName = equationObj.attributes.name;

                        console.log(equationName);

                        var mathmlEquationObj = equationObj.elements["0"].elements["0"],
                            mathmlEquationString = this.parseMathMLEquation(mathmlEquationObj),
                            parsedEquationTree = [];

                        console.log(mathmlEquationString);

                        try {
                            parsedEquationTree = this.equationParser.parse(mathmlEquationString);
                        } catch (e) {
                            if (e === this.equationParser.SyntaxError) {
                                console.log('Parser error!');
                                continue;
                            }
                        }

                        if (parsedEquationTree.length !== 0) {
                            // Flatten out the tree
                            var flattenedParsedEquationTree = this.flattenTree(parsedEquationTree['inputs']),
                                MOCAComponent = {
                                    'name': equationObj.attributes.name,
                                    'interfaces': {
                                        'output': parsedEquationTree['output'],
                                        'inputs': []
                                    }
                                };
                            MOCAComponent.inputs = flattenedParsedEquationTree
                                .filter(function (value) {
                                    return (value !== null) && (value !== 'pi');
                                    });

                            console.log(MOCAComponent);
                        } else {
                            console.log('WARNING: Couldn\'t parse the mathematical equation for: ' + equationObj.attributes.name)
                        }
                    }
                }
            }
        }

        nodeObject = self.core.createNode({
            'parent': componentLibraryNode,
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
        };

    return UMPImporter;
});
