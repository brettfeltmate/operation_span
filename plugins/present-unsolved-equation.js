/*
 * Example plugin template
 */

// TODO: stop button label overflow
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
              default: "",
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
        // Randomly select operand to be applied
        let operand = ranged_random(-9, 9);


        // If result <= 0, add 3 to operand.
        let result = math.evaluate(`${expression} + ${operand}`);

        while (result <= 0 || operand == 0) {
            operand += 3;
            result = math.evaluate(`${expression} + ${operand}`)
        }

        // minus if operand negative, plus if positive
        let operation = (operand < 0) ? '-' : '+';

        // Make operand absolute in value, return final expression
        return `${expression} {0} {1}`.format(operation, Math.abs(operand))
    }


    plugin.trial = function(display_element, trial) {

        // Grab expression, and extend if requested
        let expression = (trial.add_term) ? plugin.append_term(trial.expression) : trial.expression

        // Replace operands w/ conventional forms
        let to_present = expression.replace('*', 'x').replace('/', '÷') + ' = ?'

        let prompt = $('<div />').addClass('text-stim').css('grid-area', 'prompt').text(`${trial.prompt}`)
        let stim = $('<div />').addClass('operation-span-single-stim text-stim').text(`${to_present}`)
        let buttons =
            $('<div />').addClass('operation-span-button-bank').append(
                $('<button />').addClass('operation-span-button').text(`${trial.button_label}`)
            )

        $(display_element).append(
            $('<div />').addClass('operation-span-layout').append([prompt, stim, buttons])
        )

        // Start the clock
        var start_time = performance.now();

        // add click listener to button
        $('button').click(function() { after_response(); })

        // store response
        var response = { rt: 'timeout' };

        // If response made, grab rt
        var after_response = function() {
            // measure rt
            var end_time = performance.now();
            var rt = end_time - start_time;

            // disable all the buttons after a response
            $('button').attr('disabled', 'disabled');

            response.rt = rt;

            if (trial.response_ends_trial) {
                end_trial();
            }
        }

        // end event if provided timelimit is met
        if (trial.trial_duration !== null) {
            jsPsych.pluginAPI.setTimeout(function() {
                end_trial();
            }, trial.trial_duration);
        }

        var end_trial = function() {
            // ensure button has been disabled
            $('button').attr('disabled', 'disabled');

            // kill any remaining setTimeout handlers
            jsPsych.pluginAPI.clearAllTimeouts();

            var trial_data = {
                "rt": response.rt,
                "equation": expression
            }

            // Remove event styles
            $('present-unsolved-equation-styles').remove();

            // clear display
            display_element.innerHTML = "";

            // end & progress to next event
            jsPsych.finishTrial(trial_data);

        }
    };

    return plugin;
})();
