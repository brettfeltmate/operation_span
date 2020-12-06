/*
 * Example plugin template
 */

jsPsych.plugins["present-unsolved-equation"] = (function() {

    var plugin = {};

    plugin.info = {
        name: "present-unsolved-equation",
        description: "",
        parameters: {
            expression: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: "Expression",
                default: undefined,
                description: "A mathematical expression to be evaluated."
            },
            add_term: {
                type: jsPsych.plugins.parameterType.BOOL,
                pretty_name: "Add term?",
                default: undefined,
                description: "Should an additional operation be added to the passed expression?"
            },
            button_label: {
              type: jsPsych.plugins.parameterType.STRING,
              pretty_name: 'Button label',
              default: "continue",
              description: "Button label to continue to next event."
            },
            prompt: {
              type: jsPsych.plugins.parameterType.STRING,
              pretty_name: "Prompt message",
              default: "What is the solution? Press 'continue' when you believe you know.",
              description: "Any content here will be displayed above the presented expression."
            },
            trial_duration: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Trial duration',
                default: null,
                description: 'How long to show the trial.'
            },
            response_ends_trial: {
                type: jsPsych.plugins.parameterType.BOOL,
                pretty_name: 'Response ends trial',
                default: true,
                description: 'If true, then trial will end when user responds.'
            }
        }
    }

    plugin.append_expression = function(expression) {
        let add_minus = ['+', '-'];
        let

        let oprtn = add_minus[Math.floor(add_minus.length * Math.random())];


    }


    plugin.trial = function(display_element, trial) {

        plugin.equation = trial.expression;


        // data saving
        var trial_data = {
            parameter_name: 'parameter value'
        };

        // end trial
        jsPsych.finishTrial(trial_data);
    };

    return plugin;
})();
