/*
 * Example plugin template
 */

jsPsych.plugins["present-recall-screen"] = (function() {

    var plugin = {};

    plugin.info = {
        name: "present-recall-screen",
        parameters: {
            image_array: {
                type: jsPsych.plugins.parameterType.IMAGE,
                pretty_name: "Image array",
                array: true,
                default: [],
                description: "An array of images to be presented on screen."
            },
            index_array: {
                type: jsPsych.plugins.parameterType.OBJECT,
                pretty_name: "Index array",
                array: true,
                default: [],
                description: "An array of image indices. Used to check recall performance"
            },
            prompt: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: "Prompt message",
                default: undefined,
                description: "Any content here will be displayed above the image array."
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
                description: 'If true, then trial will end when user indicates having completed recall.'
            }

        }
    }


    plugin.generateHTML = function(image_array) {
        let grid_dims = best_grid(image_array.length);



    }


    plugin.trial = function(display_element, trial) {

        var prompt =
            `Which images do you recall seeing?<br>` +
            `Using your mouse, check the box beside each image you recall, in the order they were presented.<br>`

        var button_instrux =
            `Press <b>CLEAR</b> to clear your choices if you make a mistake.<br>` +
            `Press <b>SKIP</b> if you cannot recall which image was presented next.<br>` +
            `Press <b>FINISH</b> when you are done making your selections.`

        if (trial.prompt !== undefined) { prompt = trial.prompt; }

        $('head').append(
            $('<style />').attr('id', 'present-recall-screen-styles').html(
                `body {\n` +
                `\tbackground-color: rgb(45,45,48);\n` +
                `\tfont-family: sans-serif;\n` +
                `\tcolor: white;\n` +
                `\tfont-size: 20pt;\n`+
                `}\n\n` +
                `.wrapper {\n` +
                `\tposition: fixed;\n` +
                `\ttop: 50%;\n` +
                `\tleft: 50%;\n` +
                `\ttransform: translate(-50%, -50%);\n` +
                `}\n\n` +
                `.recall-item {\m` +
                `\twidth: 0.5vw;\n` +
                `\theight: 0.5vh;\n` +
                `\tbackground-repeat: no-repeat;\n` +
                `\tbackground-position: center;\n` +
                `\tbackground-size: 0.5vh 0.5vw;\n` +
                `\tdisplay: inline-block;\n` +
                `\tbox-sizing: border-box;\n` +
                `}\n\n` +
                `.recall-item:last-of-type {\n` +
                `\tmargin-right: 0;\n` +
                `}\n\n` +
                `.recall-item.selected {\n` +
                `\tborder: 5px solid red;\n` +

            )
        )



        // data saving
        var trial_data = {
            parameter_name: 'parameter value'
        };

        // end trial
        jsPsych.finishTrial(trial_data);
    };

    return plugin;
})();