/* Generated file based on ejs templates */
define([], function() {
    return {
    "moca.components.generated.py.ejs": "#!/usr/bin/python\r\nfrom openmdao.api import Component\r\nimport sys\r\n\r\n<%\r\n// Generate the code for all the components\r\nfor (var i = 0; i < comps.length; i++) {\r\n%>\r\nclass <%= comps[i].name %>(Component):\r\n    def __init__(self):\r\n        super(<%= comps[i].name %>, self).__init__()\r\n<%\r\n    // Generate \"add_param\" statements\r\n    for (var j = 0; j < comps[i].parameters.length; j++) {\r\n%>\r\n        self.add_param('<%= comps[i].parameters[j].name %>', val=<%= comps[i].parameters[j].value %>)\r\n<%\r\n    }\r\n%>\r\n<%\r\n    // Generate \"add_output\" and \"add_state\" statements\r\n    for (var j = 0; j < comps[i].unknowns.length; j++) {\r\n        var unknown_type;\r\n        if (comps[i].unknowns[j].type == 'Output') {\r\n            unknown_type = 'output';\r\n        } else {\r\n            unknown_type = 'state';\r\n        }\r\n%>\r\n        self.add_<%= unknown_type %>('<%= comps[i].unknowns[j].name %>', val=<%= comps[i].unknowns[j].value %>)\r\n<%\r\n    }\r\n%>\r\n<%\r\n    // Generate statement configuring force_fd\r\n    if (comps[i].force_fd === true) {\r\n%>\r\n        self.fd_options['force_fd'] = True\r\n<%\r\n    }\r\n%>\r\n    def solve_nonlinear(self, params, unknowns, resids):\r\n        # This is a dummy implementation of the method solve_nonlinear()\r\n        # This method should be implemented by the user as per the application\r\n\r\n        # Assigning shorthand(s) to the parameter(s)\r\n<%\r\n    // Generate statements for dummy implementation of the method\r\n    for (var j = 0; j < comps[i].parameters.length; j++) {\r\n%>\r\n        <%= comps[i].parameters[j].name %> = params['<%= comps[i].parameters[j].name %>']\r\n<%\r\n    }\r\n%>\r\n\r\n        # Assign value(s) to the unknown(s)\r\n<%\r\n    var dummyStatement = '';\r\n    for (var j = 0; j < comps[i].parameters.length; j++) {\r\n        dummyStatement += comps[i].parameters[j].name;\r\n        if (j != comps[i].parameters.length - 1)\r\n            dummyStatement += ' + ';\r\n    }\r\n    for (var j = 0; j < comps[i].unknowns.length; j++) {\r\n%>\r\n        unknowns['<%= comps[i].unknowns[j].name %>'] = <%= dummyStatement %>\r\n<%\r\n    }\r\n%>\r\n<%\r\n    // If the component is implicit, generate code for apply_nonlinear()\r\n    if (comps[i].type === 'Implicit') {\r\n%>\r\n    def apply_nonlinear(self, params, unknowns, resids):\r\n        print \"Provide the values of the residuals in apply_nonlinear() for <%= comps[i].name %>\"\r\n<%\r\n    }\r\n%>\r\n<%\r\n    // If the force_fd is set to false, generate code for linearize()\r\n    if (comps[i].force_fd === false) {\r\n%>\r\n    def linearize(self, params, unknowns, resids):\r\n        print \"Provide the Jacobian matrix in linearize() for <%= comps[i].name %>\"\r\n        # If you don't want to provide the Jacobian, set \"ForceFD\" option to True\r\n        # in MOCA model (the default setting)\r\n<%\r\n    }\r\n%>\r\n<%\r\n}\r\n%>\r\n",
    "moca.groups.generated.py.ejs": "#!/usr/bin/python\r\nfrom openmdao.api import Group\r\nimport sys\r\n\r\n<%\r\n// Generate the code for all the groups\r\nfor (var i = 0; i < groups.length; i++) {\r\n%>\r\nclass <%= groups[i].name %>(Group):\r\n    def __init__(self):\r\n        super(<%= groups[i].name %>, self).__init__()\r\n<%\r\n    // Generate the code for add() statements for components -\r\n    // add instances of components\r\n    for (var j = 0; j < groups[i].compInstances.length; j++) {\r\n        promotesString = '';\r\n        for (var k = 0; k < groups[i].compInstances[j].promotes.length; k++) {\r\n            promotesString += \"'\" + groups[i].compInstances[j].promotes[k] + \"'\";\r\n            if (k != groups[i].compInstances[j].promotes.length - 1)\r\n                promotesString += ', ';\r\n        }\r\n%>\r\n        self.add('<%= groups[i].compInstances[j].name %>', <%= groups[i].compInstances[j].base %>(), promotes=[<%- promotesString %>])\r\n<%\r\n    }\r\n%>\r\n<%\r\n    // Generate the code for add() statements for groups -\r\n    // add instances of groups\r\n    for (var j = 0; j < groups[i].groupInstances.length; j++) {\r\n        promotesString = '';\r\n        for (var k = 0; k < groups[i].groupInstances[j].promotes.length; k++) {\r\n            promotesString += \"'\" + groups[i].groupInstances[j].promotes[k] + \"'\";\r\n            if (k != groups[i].groupInstances[j].promotes.length - 1)\r\n                promotesString += ', ';\r\n        }\r\n%>\r\n        self.add('<%= groups[i].groupInstances[j].name %>', <%= groups[i].groupInstances[j].base %>(), promotes=[<%- promotesString %>])\r\n<%\r\n    }\r\n%>\r\n<%\r\n}\r\n%>\r\n",
    "python.bat.ejs": "echo off\r\npython <%= OpenMDAOProblem.name %>.py\r\n",
    "python.generated.py.ejs": "#!/usr/bin/python\r\nfrom openmdao.api import IndepVarComp, Component, Group, Problem, ScipyOptimizer\r\nimport sys\r\n\r\n<%\r\n// Generate the code for all the components\r\nfor (var i = 0; i < OpenMDAOProblem.comps.length; i++) {\r\n%>\r\nclass <%= OpenMDAOProblem.comps[i].name %>(Component):\r\n    def __init__(self):\r\n        super(<%= OpenMDAOProblem.comps[i].name %>, self).__init__()\r\n<%\r\n    // Generate \"add_param\" statements\r\n    for (var j = 0; j < OpenMDAOProblem.comps[i].parameters.length; j++) {\r\n%>\r\n        self.add_param('<%= OpenMDAOProblem.comps[i].parameters[j].name %>', val=<%= OpenMDAOProblem.comps[i].parameters[j].value %>)\r\n<%\r\n    }\r\n%>\r\n<%\r\n    // Generate \"add_output\" and \"add_state\" statements\r\n    for (var j = 0; j < OpenMDAOProblem.comps[i].unknowns.length; j++) {\r\n        var unknown_type;\r\n        if (OpenMDAOProblem.comps[i].unknowns[j].type == 'Output') {\r\n            unknown_type = 'output';\r\n        } else {\r\n            unknown_type = 'state';\r\n        }\r\n%>\r\n        self.add_<%= unknown_type %>('<%= OpenMDAOProblem.comps[i].unknowns[j].name %>', val=<%= OpenMDAOProblem.comps[i].unknowns[j].value %>)\r\n<%\r\n    }\r\n%>\r\n    def solve_nonlinear(self, params, unknowns, resids):\r\n        print \"Provide the code for solve_nonlinear() in <%= OpenMDAOProblem.comps[i].name %>\"\r\n\r\n    def linearize(self, params, unknowns, resids):\r\n        print \"Provide the Jacobian matrix in linearize() <%= OpenMDAOProblem.comps[i].name %>\"\r\n        # If you don't want to provide the Jacobian, comment this code and add follwing line to __init__() -\r\n        # self.fd_options['force_fd'] = True\r\n<%\r\n}\r\n%>\r\n\r\n\r\nclass RootGroup(Group):\r\n    def __init__(self):\r\n        super(RootGroup, self).__init__()\r\n<%\r\nfor (var i = 0; i < OpenMDAOProblem.desvars.length; i++) {\r\n%>\r\n        self.add('<%= OpenMDAOProblem.desvars[i].name %>', IndepVarComp('<%= OpenMDAOProblem.desvars[i].connections[0].targetName %>', 0.0))\r\n<%\r\n}\r\n%>\r\ndummy = raw_input(\"Press enter to exit..\")\r\n"
}});