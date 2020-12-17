/*
 * Example plugin template
 */

jsPsych.plugins["present-solution"] = (function() {

    var plugin = {};

    plugin.info = {
        name: "present-solution",
        description: '',
        parameters: {
            equation: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: "Equation",
                default: undefined,
                description: "Equation presented for participant to evaluate."
            },
            evaluation_time: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: "Evaluation time",
                default: undefined,
                description: "Time elapsed during prior, evaluation, event."
            },
            button_labels: {
              type: jsPsych.plugins.parameterType.STRING,
              pretty_name: "Button labels",
              array: true,
              default: ['yes', 'no'],
              description: "Buttons labels. For time being, must be in order of [yes, no]."
            },
            prompt: {
              type: jsPsych.plugins.parameterType.STRING,
              pretty_name: "Prompt",
              default: null,
              description: "Any content here will be displayed over presented solution."
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

    plugin.get_solution = function(equation, valid) {
        // Calculate real answer
        var solution_actual = math.evaluate(equation);

        if (valid) { // if valid solution requested, return solution unchanged.
            return solution_actual;
        }
        else { // Otherwise, apply random adjustment.
            adjustment = ranged_random(-9,9)
            let proposed = solution_actual + adjustment;
            // Ensure adjusted solution is non-negative and unique from actual
            while (proposed <= 0 || proposed === solution_actual) {
                adjustment += 2;
                proposed = solution_actual + adjustment;
            }
            return proposed;
        }
    }



    plugin.trial = function(display_element, trial) {

        let prompt = (trial.prompt !== null) ? trial.prompt : "Is this the correct answer?"

        var solution_valid = randomChoice([true, false]); // TODO: The plugin should not decide this.
        var proposed_solution = plugin.get_solution(trial.equation, solution_valid);

        event_display =
            `<div class = 'operation-span-content-wrapper'>` +
            `<div class = 'operation-span-content-layout'>` +
            `<div class = 'text-stimulus' style = 'grid-area: prompt'>${prompt}</div>` +
            `<div class = 'operation-span-single-stimulus text-stimulus'>${proposed_solution}</div>` +
            `<div class = 'operation-span-button-bank'>` +
            `<button class = 'operation-span-button'>${trial.button_labels[0]}</button>` +
            `<button class = 'operation-span-button'>${trial.button_labels[1]}</button>` +
            `</div></div></div>`



        display_element.innerHTML = event_display;

        // Start the clock
        var start_time = performance.now();

        // Add click listeners to buttons
        $('button').click(function() {
            var choice = $(this).text();
            after_response(choice);
        })

        // Response container
        var response = {
            rt: 'timeout',
            solve_time: 'NA',
            choice: 'NA',
            accuracy: 'NA'
        }

        // If response made, grab details & end trial
        var after_response = function(choice) {
            // measure rt
            var end_time = performance.now();
            var rt = end_time - start_time

            // disable all the buttons after a response
            $('button').attr('disabled', 'disabled');

            // log response accuracy
            var acc = 0;
            if (solution_valid) {
                if (choice == trial.button_labels[0]) { acc = 1; }
            }
            else {
                if (choice == trial.button_labels[1]) { acc = 1; }
            }

            // Store response details
            response.rt = rt;
            response.solve_time = rt + trial.evaluation_time;
            response.choice = choice;
            response.accuracy = acc;

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

            // Aggregate relevant trial data
            var trial_data = {
                "rt": response.rt,
                "solve_time": response.solve_time,
                "solution_presented": proposed_solution,
                "solution_correct": solution_valid,
                "response": response.choice,
                "accuracy": response.accuracy
            }

            pr(trial_data)

            // Remove event styles
            $('present-solution-styles').remove();

            // clear display
            display_element.innerHTML = "";

            // end & progress to next event
            jsPsych.finishTrial(trial_data);

        }
    };
    return plugin;
})();