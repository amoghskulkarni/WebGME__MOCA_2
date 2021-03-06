/*globals define, _, $*/
/*jshint browser: true, camelcase: false*/

define([
    'js/RegistryKeys',
    'js/Constants',
    'js/Utils/GMEConcepts',
    './CodeEditorDialog',
    './GraphBrowserDialog',
    'decorators/ModelDecorator/DiagramDesigner/ModelDecorator.DiagramDesignerWidget'
  ], function (
    REGISTRY_KEYS,
    CONSTANTS,
    GMEConcepts,
    CodeEditorDialog,
    GraphBrowserDialog,
    ModelDecoratorDiagramDesignerWidget) {

    'use strict';

    var CodeEditorDecorator,
        DECORATOR_ID = 'CodeEditorDecorator',
        EQN_EDIT_BTN_BASE = $('<i class="glyphicon glyphicon-edit text-meta"/>'),
        JACOBIAN_EDIT_BTN_BASE = $('<i class="glyphicon glyphicon-unchecked text-meta"/>'),
        ONTOLOGY_BROWSE_BTN_BASE = $('<i class="glyphicon glyphicon-file text-meta"/>');

    CodeEditorDecorator = function (options) {
        var opts = _.extend({}, options);

        ModelDecoratorDiagramDesignerWidget.apply(this, [opts]);

        this._skinParts = {};

        this.graphBrowserDialog = null;
        this.graphBrowserDialogInitialized = false;

        this.logger.debug('CodeEditorDecorator ctor');
    };

    CodeEditorDecorator.prototype = Object.create(ModelDecoratorDiagramDesignerWidget.prototype);
    CodeEditorDecorator.prototype.constructor = CodeEditorDecorator;
    CodeEditorDecorator.prototype.DECORATORID = DECORATOR_ID;

    /*********************** OVERRIDE ModelDecoratorDiagramDesignerWidget MEMBERS **************************/

    CodeEditorDecorator.prototype.on_addTo = function () {
        var self = this,
            client = this._control._client,
            nodeObj = client.getNode(this._metaInfo[CONSTANTS.GME_ID]);
        try {
            var metaTypeNodeObj = client.getNode(nodeObj.getMetaTypeId());
        } catch (e) {
            self.logger.error("...");
        }

        var metaTypeName = metaTypeNodeObj.getAttribute('name');

        //let the parent decorator class do its job first
        try {
            ModelDecoratorDiagramDesignerWidget.prototype.on_addTo.apply(this, arguments);
        } catch (e) {
            self.logger.error("...");
        }

        if (metaTypeName === 'Component' || metaTypeName === 'DataPreprocessor' || metaTypeName === 'LearningAlgorithm') {
            //render text-editor based META editing UI piece
            this._skinParts.$EqnEditorBtn = EQN_EDIT_BTN_BASE.clone();
            this.$el.append('<br>');
            this.$el.append(this._skinParts.$EqnEditorBtn);
            this.$el.append('  Function');
        }

        if (metaTypeName === 'Component') {
            this._skinParts.$JacobianEditorBtn = JACOBIAN_EDIT_BTN_BASE.clone();
            this.$el.append('<br>');
            this.$el.append(this._skinParts.$JacobianEditorBtn);
            this.$el.append('  Jacobian');
        }

        // this._skinParts.$OntologyBrowserBtn = ONTOLOGY_BROWSE_BTN_BASE.clone();
        // this.$el.append('<br>');
        // this.$el.append(this._skinParts.$OntologyBrowserBtn);
        // this.$el.append('  Ontology');

        if (metaTypeName === 'Component' || metaTypeName === 'DataPreprocessor' || metaTypeName === 'LearningAlgorithm') {
            // onClick listener for the eqn button
            this._skinParts.$EqnEditorBtn.on('click', function () {
                if (self.hostDesignerItem.canvas.getIsReadOnlyMode() !== true &&
                    nodeObj.getAttribute('OutputFunction') !== undefined) {
                    self._showEditorDialog('OutputFunction');
                }
                event.stopPropagation();
                event.preventDefault();
            });
        }

        if (metaTypeName === 'Component') {
            // onClick listener for the jacobian button
            this._skinParts.$JacobianEditorBtn.on('click', function () {
                if (self.hostDesignerItem.canvas.getIsReadOnlyMode() !== true &&
                    nodeObj.getAttribute('Jacobian') !== undefined) {
                    self._showEditorDialog('Jacobian');
                }
                event.stopPropagation();
                event.preventDefault();
            });
        }

        // onClick listener for the ontology button
        // this._skinParts.$OntologyBrowserBtn.on('click', function () {
        //     if (self.hostDesignerItem.canvas.getIsReadOnlyMode() !== true &&
        //     nodeObj.getAttribute('OntologyElementID') !== undefined) {
        //         self._showOntologyBrowserDialog();
        //     }
        //     event.stopPropagation();
        //     event.preventDefault();
        // });
    };

    CodeEditorDecorator.prototype._showOntologyBrowserDialog = function () {
        var self = this,
            client = this._control._client,
            nodeObj = client.getNode(this._metaInfo[CONSTANTS.GME_ID]),
            attrText = nodeObj.getAttribute('OntologyElementID');

        // Create only once
        if (!this.graphBrowserDialogInitialized){
            this.graphBrowserDialog = new GraphBrowserDialog();
            this.graphBrowserDialogInitialized = true;
        }

        this.graphBrowserDialog.initialize(attrText, function(text){
            try {
                client.setAttributes(self._metaInfo[CONSTANTS.GME_ID], 'OntologyElementID', text);
            } catch (e) {
                self.logger.error('Saving META failed... Either not JSON object or something else went wrong...');
            }
        });

        this.graphBrowserDialog.show();
    };

    CodeEditorDecorator.prototype._showEditorDialog = function (attrName) {
        var self = this,
            client = this._control._client,
            nodeObj = client.getNode(this._metaInfo[CONSTANTS.GME_ID]),
            attrText = nodeObj.getAttribute(attrName),
            title = '<title>';

        var nodeName = nodeObj.getAttribute('name');

        var editorDialog = new CodeEditorDialog();

        if (attrName === 'OutputFunction') {
            title = 'Input-output relation (business logic) for ' + nodeName + ' component';
        } else if (attrName === 'Jacobian') {
            title = 'Jacobian matrix (analytical derivatives) for ' + nodeName + ' component';
        }

        // Initialize with OutputFunction attribute and save callback function
        editorDialog.initialize(title, attrText, function (text) {
            try {
                client.setAttribute(self._metaInfo[CONSTANTS.GME_ID], attrName, text);
            } catch (e) {
                self.logger.error('Saving META failed... Either not JSON object or something else went wrong...');
            }
        });

        editorDialog.show();
    };

    CodeEditorDecorator.prototype.destroy = function () {
        var self = this,
            client = this._control._client,
            nodeObj = client.getNode(this._metaInfo[CONSTANTS.GME_ID]);
        ModelDecoratorDiagramDesignerWidget.prototype.destroy.apply(this, arguments);
    };

    return CodeEditorDecorator;
});
