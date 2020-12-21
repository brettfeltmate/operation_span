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
                default: "Which images do you recall seeing?",
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


    plugin.generateHTML = function(image_array) {

        // Spawn recall array items for trial
        let trial_array = plugin.spawn_array(image_array)

        let prompt = $('<div />').addClass('text-stim').css('grid-area', 'prompt').text(`${plugin.prompt}`)

        let recall_bank = $('<div />').addClass('operation-span-recall-bank')
        let button_bank = $('<div />').addClass('operation-span-button-bank')

        // Spawn buttons
        let clear_choices = $('<button />').attr('id', 'clear_choices').addClass('operation-span-button').text('CLEAR ALL')
        let skip_choice = $('<button />').attr('id', 'skip_choice').addClass('operation-span-button').text('SKIP CHOICE')
        let submit_choices = $('<button />').attr('id', 'submit_choices').addClass('operation-span-button').text('SUBMIT')
        $(button_bank).append([clear_choices, skip_choice, submit_choices])

        // create container, append elements, return product
        let container = $('<div />').addClass('operation-span-layout').append([prompt, trial_array, recall_bank, button_bank])

        return container
    }


    plugin.spawn_array = function(image_array) {

        let array_items = [];

        // For each image in provided array, spawn element to contain
        for (let i=0; i<image_array.length; i++) {
            let cell = $('<div />').addClass('operation-span-array-item')
            let content = []


            content.push($('<div />').addClass('operation-span-array-item-index text-stim'))
            content.push($('<div />').addClass('operation-span-array-item-image image-stim').css('background-image', `url('${image_array[i]}')`).data("index", i))

            $(cell).append(content)
            array_items.push(cell)
        }
        // Create final array and return
        return $('<div />').addClass('operation-span-stim-array').append(array_shuffle(array_items))
    }

    // If item clicked, number item and add to recall bank
    plugin.click_handler = function(e) {
        e.stopPropagation();

        // If not already selected
        if (! $(this).hasClass('selected')) {

            // label as being selected
            $(this).addClass('selected')
            // Add selection number
            $(this).children('.text-stim').text(`${plugin.num}`);

            // grab image selected, append to recall bank
            img_index = $(this).children('.image-stim').data('index')
            img_choice = $('<div />').addClass('operation-span-recall-item').css('background-image', `url('${plugin.image_array[img_index]}')`)
            $('.operation-span-recall-bank').append(img_choice)

            plugin.selections.push(img_index+1)
            plugin.num += 1;
        }

    }

    // Reset choices
    plugin.clear_choices = function(e) {
        e.stopPropagation()

        $('.operation-span-array-item').removeClass('selected')
        $('.operation-span-array-item-index').empty()
        $('.operation-span-recall-bank').empty()

        plugin.num = 1;
        plugin.selections = []
        plugin.correct_choices = 0

    }

    // Increment selection number, add blank cell to recall bank.
    plugin.skip_choice = function(e) {
        e.stopPropagation()

        $('.operation-span-recall-bank').append($('<div />').addClass('operation-span-recall-item'))

        plugin.selections.push(-1)

    }

    // TODO: handle event where selection = -1
    plugin.submit_choices = function(e) {
        e.stopPropagation()

        pr(plugin.selections, 'selections')
        pr(plugin.index_array, 'index array')

        for (let i = 0; i < plugin.selections.length; i++) {
            if (plugin.index_array[i] == plugin.selections[i]) {
                plugin.correct_choices += 1
            }
        }

        pr(plugin.correct_choices)


    }


    plugin.trial = function(display_element, trial) {
        plugin.num = 1;
        plugin.selections = []
        plugin.index_array = trial.index_array
        plugin.correct_choices = 0;

        plugin.image_array = trial.image_array
        plugin.prompt = trial.prompt

        var display = plugin.generateHTML(trial.image_array)

        $(display).on('click', '.operation-span-array-item', plugin.click_handler)
        $(display).on('click', '#clear_choices', plugin.clear_choices)
        $(display).on('click', '#skip_choice', plugin.skip_choice)
        $(display).on('click', '#submit_choices', plugin.submit_choices)


        $(display_element).append(display)







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