/*
 * Example plugin template
 */

jsPsych.plugins["present-recall-screen"] = (function() {

    var plugin = {};

    // we want to pre-load media; the arguments here are plug-in name, plug-in parameter, media-type
    jsPsych.pluginAPI.registerPreload('present-recall-screen', 'image_array', 'image');

    plugin.info = {
        name: "present-recall-screen",
        parameters: {
            image_array: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: "Image array",
                array: true,
                default: undefined,
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
                default: "",
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
                default: false,
                description: 'If true, then trial will end when user indicates having completed recall.'
            }

        }
    }


    plugin.spawn_array = function(image_array) {

        let array_items = [];

        for (let i=0; i<image_array.length; i++) {
            let cell = $('<div />').addClass('operation-span-array-item')
            let content = []


            content.push($('<div />').addClass('operation-span-array-item-index text-stim'))
            content.push($('<div />').addClass('operation-span-array-item-image image-stim').css('background-image', `url('${image_array[i]}')`))

            $(cell).append(content)
            array_items.push(cell)
        }

        return $('<div />').addClass('operation-span-stim-array').append(array_items)
    }

    plugin.click_handler = function(e) {
        e.stopPropagation();

        pr('clicked');
        // $(this).closest('operation-span-array-item-index').append(num);
        // num += 1;

    }



    plugin.trial = function(display_element, trial) {

        var prompt =
            `Which images do you recall seeing?<br>` +
            `Using your mouse, check the box beside each image you recall, in the order they were presented.<br>`

        var button_instrux =
            `Press <b>CLEAR</b> to clear your choices if you make a mistake.<br>` +
            `Press <b>SKIP</b> if you cannot recall which image was presented next.<br>` +
            `Press <b>FINISH</b> when you are done making your selections.`


        let trial_array = plugin.spawn_array(trial.image_array)

        $(display_element).append(
            $('<div />').addClass('operation-span-layout').append(trial_array)
        )


        var num = 1;
        //$(event_display).on('click', '.operation-span-array-item-image image-stim', plugin.click_handler);


        //pr(event_display.html());

        //display_element.innerHTML = event_display;
        die()






        // data saving
        var trial_data = {
            parameter_name: 'parameter value'
        };

        // end trial
        let never_true = false;

        if (never_true) {jsPsych.finishTrial(trial_data);}

    };

    return plugin;
})();