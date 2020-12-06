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

    plugin.append_term = function(expression) {
        // Randomly select second value
        let second = ranged_random(-9,9);
        // Append to expression
        let to_eval = `${expression} + {0}`.format(second);

        // If result <= 0, add 3 to second value.
        let result = math.evaluate(to_eval);
        while (result <= 0) {
            second += 3;
            to_eval = `${expression} + {0}`.format(second);
            result = math.evaluate(to_eval);
        }

        // If final value of second negative, rephrase as subtracting a postive val
        let add_minus = '+'
        if (second < 0) { add_minus = '-' }

        // return full-form expression
        return `${expression} {0} {1}`.format(add_minus, Math.abs(second))
    }


    plugin.trial = function(display_element, trial) {

        plugin.expression = trial.expression;

        let full_form = plugin.expression;

        if (trial.add_term) {
            full_form = plugin.append_term(full_form)
        };

        plugin.full_form = full_form;
        plugin.true_answer = math.evaluate(plugin.full_form);


        // data saving
        var trial_data = {
            parameter_name: 'parameter value'
        };

        // end trial
        jsPsych.finishTrial(trial_data);
    };

    return plugin;
})();
