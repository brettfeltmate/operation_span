/**
 * present-memory-image
 *
 * Plugin for presenting a provided image for some specified duration.
 * Allows for attaching some identifying tag, as well as image resizing.
 * Does not accept responses of any kind.
 * */


jsPsych.plugins['present-image'] = (function() {

    var plugin = {};

    jsPsych.pluginAPI.registerPreload('present-image', 'image', 'image');

    plugin.info = {
        name: 'present-image',
        description: '',
        parameters: {
            image: {
                type: jsPsych.plugins.parameterType.IMAGE,
                pretty_name: 'Image',
                default: null,
                description: 'The image object to be displayed'
            },
            index: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Index',
                default: null,
                description: 'An optional index value denoting images serial presentation position.'
            },
            // rescale_height: {
            //     type: jsPsych.plugins.parameterType.INT,
            //     pretty_name: 'Factor to rescale image height by',
            //     default: null,
            //     description: "Set the image height as proportion of display size"
            // },
            // rescale_width: {
            //     type: jsPsych.plugins.parameterType.INT,
            //     pretty_name: 'Factor to rescale image width by',
            //     default: null,
            //     description: "Set the image width as proportion of display size"
            // },
            // maintain_aspect_ratio: {
            //     type: jsPsych.plugins.parameterType.BOOL,
            //     pretty_name: "Maintain aspect ratio",
            //     default: true,
            //     description: "Should aspect ratio be preserved when only width or height provided?."
            // },
            image_duration: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: "image duration",
                default: null,
                description: "How long to show image before removal, in milliseconds."
            },
            trial_duration: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: "Trial duration",
                default: null,
                description: "How long to show the trial, in milliseconds. Defaults to image_duration."
            }
        }
    }

    plugin.trial = function(display_element, trial) {

        let scaled_width = '25';
        let scaled_height = '30';

        // if (trial.rescale_width !== null) { scaled_width = trial.rescale_width; }
        //
        // if (trial.rescale_height !== null) { scaled_height = trial.rescale_height; }

        $('#jspsych-loading-progress-bar-container').remove();

        $('head').append(
            $('<style />').attr('id', 'present-image-styles').html(
                `.grid {\n` +
                `\tdisplay: grid;\n` +
                `\tgrid-template-columns: ${scaled_width}vw;\n` +
                `\tgrid-template-rows: 2fr ${scaled_height}vh 2fr;\n` +
                `}\n\n` +
                `.row {\n` +
                `\tdisplay: flex;\n` +
                `\tjustify-content: center;\n` +
                `\talign-items: center;\n` +
                `}\n\n` +
                `.row > img {\n` +
                `\tobject-fit: cover;\n` +
                `\twidth: 100%;\n` +
                `\tmax-height: 100%;\n` +
                `}`
            )
        )

        event_html =
            `<div class = 'grid'>` +
            `<div class = 'row'></div>` +
            `<div class = 'row'><img src=${trial.image} alt = "image at ${trial.image} cannot be found"></div>` +
            `<div class = 'row'></div>` +
            `</div>`

        display_element.innerHTML = event_html;

        // function to end trial when it is time
        function end_trial() {

            // kill any remaining setTimeout handlers
            jsPsych.pluginAPI.clearAllTimeouts();

            // gather the data to store for the trial
            var trial_data = {
                // full path would be awful verbose, just return name of image.
                "image": trial.image.substring(trial.image.lastIndexOf('/') + 1),
                "index": trial.index
            };

            // clear styles
            $('#present-image-styles').remove()
            // clear the display
            display_element.innerHTML = '';

            // move on to the next trial
            jsPsych.finishTrial(trial_data);
        }

        // hide image if timing is set
        if (trial.image_duration !== null) {
            jsPsych.pluginAPI.setTimeout(function() {
                display_element.querySelector('img').style.visibility = 'hidden';
            }, trial.image_duration);
        }

        // end trial if time limit is set
        if (trial.trial_duration !== null) {
            jsPsych.pluginAPI.setTimeout(function() {
                end_trial();
            }, trial.trial_duration);
        } else {
            jsPsych.pluginAPI.setTimeout(function() {
                end_trial();
            }, trial.image_duration);
        }


    };
    return plugin;
})();