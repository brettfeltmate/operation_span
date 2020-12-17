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
              default: `What is the solution?<br>Press 'continue' when you believe you know.`,
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
        while (result <= 0 && second != 0) {
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

        // Event styles
        $('head').append(
            $('<style />'). attr('id', 'present-unsolved-equation-styles').html(
                `.grid {\n` +
                `\tdisplay: grid;\n` +
                `\tgrid-template-columns: 50vw;\n` +
                `\tgrid-template-rows: 30vh 30vh 15vh 15vh;\n` +
                `}\n\n` +
                `.row {\n` +
                `\tdisplay: flex;\n` +
                `\tjustify-content: center;\n` +
                `\talign-items: center;\n` +
                `\ttext-align: center;\n` +
                `}\n\n` +
                `.button {\n` +
                `\tdisplay: inline-block;\n` +
                `\tpadding: 10px;\n` +
                `\ttop: 50%;\n` +
                `\tleft: 50%;\n` +
                `\tfont-size: 20pt;\n` +
                `}`
            )
        )

        // Grab expression, and extend if requested
        let full_form = trial.expression;

        if (trial.add_term) {
            full_form = plugin.append_term(full_form)
        }

        to_present = full_form;
        to_present = to_present.replace('*', 'x').replace('/', '÷') + ' = ?'

        // Generate event html
        var event_html =
            `<div class = 'grid dev-lines'>` +
            `<div class = "row dev-lines">${trial.prompt}</div>` +
            `<div class = 'row dev-lines' style = 'font-size: 30pt'>${to_present}</div>` +
            `<div class = 'row dev-lines'><button class = 'button'>${trial.button_label}</button></div>` +
            `<div class = 'row dev-lines'></div>` +
            `</div>`

        display_element.innerHTML = event_html;

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
                "equation": full_form
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
