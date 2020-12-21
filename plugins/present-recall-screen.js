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
            content.push($('<div />').addClass('operation-span-array-item-image image-stim').css('background-image', `url('${image_array[i]}')`).data("index", i))

            $(cell).append(content)
            array_items.push(cell)
        }

        return $('<div />').addClass('operation-span-stim-array').append(array_items)
    }

    plugin.click_handler = function(e) {
        e.stopPropagation();

        $(this).children('.text-stim').text(`${plugin.num}`);

        img_index = $(this).children('.image-stim').data('index')

        img_choice = $('<div />').addClass('operation-span-recall-item').css('background-image', `url('${plugin.image_array[img_index]}')`)

        $('.operation-span-recall-bank').append(img_choice)
        plugin.num += 1;

    }

    plugin.clear_choices = function(e) {
        e.stopPropagation()
        plugin.num = 1;
        $('.operation-span-array-item-index').empty()
        $('.operation-span-recall-bank').empty()
    }

    plugin.skip_choice = function(e) {
        e.stopPropagation()
        plugin.num += 1;
        blank_cell = $('<div />').addClass('operation-span-recall-item')

        $('.operation-span-recall-bank').append(blank_cell)

    }


    plugin.trial = function(display_element, trial) {
        plugin.num = 1;
        plugin.image_array = array_shuffle(trial.image_array)


        var button_instrux =
            `Press <b>CLEAR</b> to clear your choices if you make a mistake.<br>` +
            `Press <b>SKIP</b> if you cannot recall which image was presented next.<br>` +
            `Press <b>FINISH</b> when you are done making your selections.`


        //let prompt = $('<div />').addClass('text-stim').css('grid-area', 'prompt').text(`${trial.prompt}`);

        let prompt = $('<div />').addClass('text-stim').css('grid-area', 'prompt').text(
            `Which images do you recall seeing?`
            )

        let trial_array = plugin.spawn_array(trial.image_array)
        let recall_bank = $('<div />').addClass('operation-span-recall-bank')
        let button_bank = $('<div />').addClass('operation-span-button-bank')

        let clear_choices = $('<button />').attr('id', 'clear_choices').addClass('operation-span-button').text('CLEAR ALL')
        let skip_choice = $('<button />').attr('id', 'skip_choice').addClass('operation-span-button').text('SKIP NEXT')
        let submit_choices = $('<button />').attr('id', 'submit_choices').addClass('operation-span-button').text('SUBMIT')

        $(button_bank).append([clear_choices, skip_choice, submit_choices])


        let container = $('<div />').addClass('operation-span-layout').append([prompt, trial_array, recall_bank, button_bank])



        $(container).on('click', '.operation-span-array-item', plugin.click_handler)
        $(container).on('click', '#clear_choices', plugin.clear_choices)
        $(container).on('click', '#skip_choice', plugin.skip_choice)

        $(display_element).append(container)



        //$(event_display).on('click', '.operation-span-array-item-image image-stim', plugin.click_handler);


        //pr(event_display.html());

        //display_element.innerHTML = event_display;






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