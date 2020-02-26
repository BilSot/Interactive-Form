/******************************************
 Treehouse Techdegree:
 FSJS project 3 - Interactive Form
 ******************************************/
const punsRegExp = /puns/i,
    heartSymbol = '\u2665',
    checkMark = '\u2713',
    heartRegExp = new RegExp(heartSymbol, ''),
    onlyDigitsRegExp = /[a-zA-Z-!$%^&*()_+|~=`{}\[\]:\/;'<>?,.@#\s]*/,
    mailAddressRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

var punsColors = [],
    heartColors = [],
    paymentMethods = [],
    nameInput = document.getElementById('name'),
    emailInput = document.getElementById('mail'),
    selectedPaymentMethod = 'credit-card',
    jobPositionDropdown = document.getElementById('title'),
    designDropdown = document.getElementById('design'),
    colorDivSection = document.querySelector('div#colors-js-puns');
    colorDropdown = document.getElementById('color'),
    paymentDropdown = document.getElementById('payment'),
    otherTitleInput = document.querySelector('input#other-title');
    creditCardField = document.querySelector('input#cc-num'),
    zipCodeField = document.querySelector('input#zip'),
    cvvField = document.querySelector('input#cvv'),
    activitiesList = document.querySelector('fieldset.activities'),
    formElem = document.querySelector('form'),
    totalCostTextSpan = document.createElement('span'),
    nameErrorMessageBox = document.querySelector('span#js-name-error-box'),
    mailErrorMessageBox = document.querySelector('span#js-email-error-box'),
    activitiesErrorMessageBox = document.querySelector('span#js-activities-error-box'),
    ccErrorMessageBox = document.querySelector('span#js-cc-error-box'),
    numericInputMsg = {
        'message': 'Please insert only numeric characters[ 0-9]',
        'displayed': false
    },
    maxCharsMsg = {
        'message': 'Maximum characters allowed: ',
        'displayed': false
    },
    invalidNameMsg = {
        'message': 'Please insert your name',
        'displayed': false
    },
    mailFieldMsg = {
        'message': 'Please insert a valid e-mail address',
        'displayed': false
    },
    activitiesFieldMsg = {
        'message': 'Please select at least one activity',
        'displayed': false
    };

/***
 * Once the whole form is displayed, the essential functionalities are `fired`
 */
window.onload = function () {
    setInitialFormState();
    punsColors = jsPunsColorsList(colorDropdown.options);
    heartColors = jsHeartColorsList(colorDropdown.options);
    paymentMethods = getPaymentMethods(paymentDropdown.options);
    hideColorOptionsList();
    //setDefaultSelectedOption();
    eventHandlers();
};

/***
 * Sets the default state of the form (hiding and displaying elements)
 */
function setInitialFormState() {
    nameInput = document.getElementById('name');
    let paypalSection = document.getElementById('paypal');
    let bitcoinSection = document.getElementById('bitcoin');
    nameInput.focus();
    otherTitleInput.style.display = 'none';
    colorDivSection.style.display = 'none';
    paypalSection.style.display = 'none';
    bitcoinSection.style.display = 'none';
    paymentDropdown.options[1].innerHTML = checkMark + paymentDropdown.options[1].innerHTML;

    let colorSelectElem = document.getElementById('color');
    let defaultColorOption = document.createElement('option');
    defaultColorOption.innerHTML = "Please select a T-shirt theme";
    defaultColorOption.selected = true;
    colorSelectElem.insertBefore(defaultColorOption, colorSelectElem.firstChild);

    addSpanCostHolder();
}

/***
 * Creates the HTML element that will hold the total cost of the activities selected
 */
function addSpanCostHolder() {
    totalCostTextSpan.id = 'js-total-cost';
    totalCostTextSpan.innerHTML = "Total cost: $";
    let totalCostPriceSpan = document.createElement('span');
    totalCostPriceSpan.id = 'price';
    totalCostPriceSpan.innerHTML = '0';
    totalCostTextSpan.appendChild(totalCostPriceSpan);
    let activitiesElem = document.querySelector('fieldset.activities');
    activitiesElem.appendChild(totalCostTextSpan);
}

/***
 * Populates the punsColors array with the values of the Design dropdown list's options
 * @param {HTMLOptionsCollection} colorsOptions
 * @return {Array}
 */
function jsPunsColorsList(colorsOptions) {
    let punsList = [];
    for (let j = 1; j < colorsOptions.length; j++) {
        if (punsRegExp.test(colorsOptions[j].label.toLowerCase())) {
            punsList.push(colorsOptions[j].getAttribute('value'));
        }
    }

    return punsList;
}

/***
 * Populates the heartColors array with the values of the Color dropdown list's options
 * @param {HTMLOptionsCollection} colorsOptions
 * @return {Array}
 */
function jsHeartColorsList(colorsOptions) {
    let heartColorsList = [];
    for (let j = 1; j < colorsOptions.length; j++) {
        if (heartRegExp.test(colorsOptions[j].label.toLowerCase())) {
            heartColorsList.push(colorsOptions[j].getAttribute('value'));
        }
    }

    return heartColorsList;
}

/***
 * Populates the paymentMethods array with the values of the Payment Info dropdown list's options
 * @param {HTMLOptionsCollection} paymentMethodOptions
 * @return {Array}
 */
function getPaymentMethods(paymentMethodOptions) {
    let paymentMethods = [];
    for (let j = 1; j < paymentMethodOptions.length; j++) {
        paymentMethods.push(paymentMethodOptions[j].getAttribute('value'));
    }

    return paymentMethods;
}

/***
 * On load, the Design is set to default (`Select Theme`) and the colors are not accessible until another selection is being made
 */
function hideColorOptionsList() {
    let defaultOption = 'select theme';
    if (designDropdown.options[0].value.toLowerCase() === defaultOption) {
        let colorsList = colorDropdown.options;
        for (let i = 1; i < colorsList.length; i++) {
            colorsList[i].style.display = 'none';
        }
    }
}

/***
 * On form load, the checkmark sign is added in front of the selected option in the dropdown lists of the form
 */
function setDefaultSelectedOption() {
    addCheckmarkToSelectedOption(jobPositionDropdown, 0);
    addCheckmarkToSelectedOption(sizeDropdown, 0);
    addCheckmarkToSelectedOption(monthDropdown, 0);
    addCheckmarkToSelectedOption(yearDropdown, 0);
}

/***
 * Lists the events that can occur on the HTML elements
 */
function eventHandlers() {
    nameInput.addEventListener('blur', function(event){
        validateNameField(event.target);
    });

    emailInput.addEventListener('blur', function(event){
        validateMailField(event.target);
    });

    designDropdown.addEventListener('change', changeSelectedDesignHandler);
    //on the 1st change of the design, the default option is hidden. The color's default option is hidden too.
    // This needs to be run only once
    designDropdown.addEventListener('change', function () {
        this.options[0].style.display = 'none';
        colorDropdown.options[0].style.display = 'none';
    }, {once: true});

    jobPositionDropdown.addEventListener('change', function (event) {
        if (event.target.options[event.target.selectedIndex].value === 'other') {
            otherTitleInput.style.display = 'inline';
        } else {
            otherTitleInput.style.display = 'none';
        }
    });

    //on the 1st change of the payment method, the default option is hidden. This needs to be run only once
    paymentDropdown.addEventListener('change', function () {
        this.options[0].style.display = 'none';
    }, {once: true});
    paymentDropdown.addEventListener('change', changePaymentHandler);

    activitiesList.addEventListener('change', activitiesChangeHandler);

    creditCardField.addEventListener('input', checkForNumericInput(16));
    creditCardField.addEventListener('focus', checkForInputLength('block', 'Credit card number must be between 13 and 16 digits', 13));
    creditCardField.addEventListener('blur', checkForInputLength('none', '', 13));
    creditCardField.addEventListener('paste', checkForNumericInput(16));

    zipCodeField.addEventListener('input', checkForNumericInput(5));
    zipCodeField.addEventListener('focus', checkForInputLength('block', 'Zip code must be 5 digits', 5));
    zipCodeField.addEventListener('blur', checkForInputLength('none', '', 5));
    zipCodeField.addEventListener('paste', checkForNumericInput( 5));

    cvvField.addEventListener('input', checkForNumericInput(3));
    cvvField.addEventListener('focus', checkForInputLength('block', 'CVV must be 3 digits', 3));
    cvvField.addEventListener('blur', checkForInputLength('none', '', 3));
    cvvField.addEventListener('paste', checkForNumericInput( 3));

    formElem.addEventListener('submit', function (event) {
        clearErrorMessages();
        let activitiesSelected = activitiesList.getElementsByTagName('input');

        let isNameFieldValid = validateNameField(nameInput);
        let isMailFieldValid = validateMailField(emailInput);
        let isActivitiesValid = validateActivities(activitiesSelected);
        let isCreditCardValid = selectedPaymentMethod === 'credit-card' ? validateCreditCardInfo() : true;

        if (!isNameFieldValid || !isMailFieldValid || !isActivitiesValid || !isCreditCardValid) {
            event.preventDefault();
        }
    });
}

/***
 * Takes the selected option's label and passes it to the `validateSelectedOption` function.
 * Calls the `setSelectedColor` function for marking the 1st color option as `selected`
 */
function changeSelectedDesignHandler() {
    colorDivSection.style.display = 'block';
    let optionItem = this.options[this.selectedIndex].label;
    validateSelectedOption(optionItem.toLowerCase());
    defineSelectedColor(colorDropdown.options);
    //addCheckmarkToSelectedOption(event.target, 1);
}

/***
 * Validates the optionItemLabel with the punsRegExp and heartRegExp. according to which test passes, the according
 * color options are displayed and hidden
 * @param{String} optionItemLabel
 */
function validateSelectedOption(optionItemLabel) {
    if (punsRegExp.test(optionItemLabel)) {
        setColorOptionsVisibility(punsColors, 'block');
        setColorOptionsVisibility(heartColors, 'none');
    } else if (heartRegExp.test(optionItemLabel)) {
        setColorOptionsVisibility(heartColors, 'block');
        setColorOptionsVisibility(punsColors, 'none');
    }
}

/***
 * Sets the style, defined in the `style` parameter, to all the array's elements
 * @param{Array} array
 * @param{String} style
 */
function setColorOptionsVisibility(array, style) {
    let colors = colorDropdown.options;
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < colors.length; j++) {
            if (colors[j].getAttribute('value') === array[i]) {
                colors[j].style.display = style;
            }
        }
    }
}

/***
 * The 1st option that is visible from the `optionsList` of colors, is set as selected
 * @param{HTMLOptionsCollection} optionsList
 */
function defineSelectedColor(optionsList) {
    for (let j = 1; j < optionsList.length; j++) {
        if (optionsList[j].style.display === 'block') {
            optionsList[j].selected = true;
            break;
        }
    }
    //addCheckmarkToSelectedOption(colorDropdown, 1);
}

/***
 * Displays the respective section on the form, according to the selected option and adds the checkmark in front of it
 * @param {Event} event
 */
function changePaymentHandler(event) {
    setPaymentMethodVisibility(event.target);
    addCheckmarkToSelectedOption(event.target, 1);
}

/***
 * Displays the item's form section and hides the rest of the payment methods elements.
 * Sets the global `selectedPaymentMethod` to the selected option's value
 * @param{HTMLElement} item
 */
function setPaymentMethodVisibility(item) {
    let selectedPayment = item.options[item.selectedIndex].value;
    document.getElementById(selectedPayment).style.display = 'block';
    for (let i = 0; i < paymentMethods.length; i++) {
        if (paymentMethods[i] !== selectedPayment) {
            document.getElementById(paymentMethods[i]).style.display = 'none';
        }
    }
    selectedPaymentMethod = selectedPayment;
}

/***
 * Adds the checkmark symbol in front of the selected item's value
 * The position defines the start index of the options' array
 * @param{HTMLElement} item
 * @param{Number} position
 */
function addCheckmarkToSelectedOption(item, position) {
    let innerHtml = item.options[item.selectedIndex].innerHTML;

    for (let i = position; i < item.options.length; i++) {
        let temp = '';
        if (!item.options[i].selected) {
            temp = item.options[i].innerHTML.replace(checkMark, '');
            item.options[i].innerHTML = temp;
        } else {
            if (innerHtml.indexOf(checkMark) === -1) {
                temp = checkMark + innerHtml;
                item.options[item.selectedIndex].innerHTML = temp;
            }
        }
    }
}

/***
 * Retrieves the selected activity's info and passes it to the `getActivityDataObj` function
 * @param{Event} event
 */
function activitiesChangeHandler(event) {
    let item = event.target;
    let selectedActivity = {};
    if (item.tagName === 'INPUT') {
        let dataCost = item.getAttribute('data-cost');
        let dateAndTime = item.getAttribute('data-day-and-time');
        let selectedName = item.getAttribute('name');
        selectedActivity = getActivityDataObj(dateAndTime, selectedName, dataCost, item.checked);
    }
    administerOverlappingActivities(selectedActivity);
    updateTotalCost(selectedActivity);
}

/***
 * If the activity is checked and other activities have the same day and time as the selected activity's, they are disabled.
 * If the activity is UNchecked and other activities have the same day and time as the selected activity's, they are enabled.
 * @param{Object} selectedActivity
 */
function administerOverlappingActivities(selectedActivity) {
    let activitiesInputElem = document.querySelector('fieldset.activities').getElementsByTagName('input');
    for (let i = 0; i < activitiesInputElem.length; i++) {
        let activityName = activitiesInputElem[i].getAttribute('name');
        let activityDayTimeSlot = activitiesInputElem[i].getAttribute('data-day-and-time');
        let activityCost = activitiesInputElem[i].getAttribute('data-cost');

        //make sure that the selected activity is not included in the comparison
        if (activityName !== selectedActivity.name) {
            let activityInfo = getActivityDataObj(activityDayTimeSlot, activityName, activityCost);

            //if another activity with the same day and time is found
            if (activityInfo.date === selectedActivity.date && activityInfo.time === selectedActivity.time) {
                //if the selected activity is checked, disable the overlapping ones
                if (selectedActivity.checked) {
                    activitiesInputElem[i].setAttribute("disabled", "true");
                } //if the selected activity is unchecked, enable the overlapping ones
                else {
                    activitiesInputElem[i].removeAttribute("disabled");
                }
            }
        }
    }
}

/***
 * Transforms the activity's info into an Object
 * @param{String} dateAndTime
 * @param{String} name
 * @param{String} dataCost
 * @param{Boolean} itemChecked
 * @return {Object}
 */
function getActivityDataObj(dateAndTime, name, dataCost, itemChecked) {
    let timeSlot = {};
    if (dateAndTime !== undefined && dateAndTime !== null) {
        timeSlot = dateAndTime.split(" ");
    }
    let date = timeSlot[0] ? timeSlot[0] : '';
    let time = timeSlot[1] ? timeSlot[1] : '';
    let cost = parseInt(dataCost);
    return {
        'date': date,
        'time': time,
        'name': name,
        'cost': cost,
        'checked': itemChecked
    };
}

/***
 * Updates the total cost price on the form
 * @param{Object} selectedActivity
 */
function updateTotalCost(selectedActivity) {
    let itemCost = 0;
    itemCost = selectedActivity.cost;
    let totalCost = parseInt(totalCostTextSpan.getElementsByTagName('span')[0].innerHTML);

    if (selectedActivity.checked) {
        totalCost += itemCost;
    } else {
        totalCost -= itemCost;
    }
    totalCostTextSpan.getElementsByTagName('span')[0].innerHTML = `${totalCost}`;
    totalCostTextSpan.style.display = 'inline';
}

/***
 * Checks for each key pressed if it's a digit or not. If not, it doesn't allow it to be inserted in the input field and
 * displays an error message. It also checks for the maximum allowed length of the input. It displays an error message
 * if exceeded and no input is further allowed
 * @param{Number} maxCharsAllowed
 * @return {function}
 */
function checkForNumericInput(maxCharsAllowed) {
    return event => {
        let keyInserted = event.target.value;
        if (event.target.value.length === 0) {
            resetErrorBox(event);
            return;
        }
        if (event.shiftKey) {
            event.preventDefault();
        }
        let error1 = false;
        let error2 = false;
        if (onlyDigitsRegExp.test(keyInserted)) {
            error1 = true;
            event.target.value = event.target.value.replace(onlyDigitsRegExp, '');
        }
        if (event.target.value.length > maxCharsAllowed) {
            error2 = true;
        }

        if (error1 && !error2) {
            if (!numericInputMsg.displayed) {
                ccErrorMessageBox.style.display = 'block';
                ccErrorMessageBox.innerHTML = numericInputMsg.message;
                numericInputMsg.displayed = true;
                event.target.style.border = '2px solid rgb(226, 49, 9)';
            }
        }
        if (!error1 && error2) {
            event.target.value = event.target.value.substr(0, maxCharsAllowed);
            if (!maxCharsMsg.displayed) {
                ccErrorMessageBox.style.display = 'block';
                ccErrorMessageBox.innerHTML = maxCharsMsg.message + maxCharsAllowed;
                maxCharsMsg.displayed = true;
                event.target.style.border = '2px solid rgb(226, 49, 9)';
            }
        }
        if (!error1 && !error2) {
            resetErrorBox(event);
        }
    };
}

/***
 * It clears the content of the `ccErrorMessageBox` element and resets the error messages' display property
 */
function resetErrorBox(event) {
    numericInputMsg.displayed = false;
    maxCharsMsg.displayed = false;
    ccErrorMessageBox.innerHTML = '';
    ccErrorMessageBox.style.display = 'none';
    event.target.style.border = '2px solid rgb(111, 157, 220)';
}

/***
 * Checks whether the input length is in the range [0-minCharsAllowed]. If not, it displays the error `message` in the
 * `ccErrorMessageBox` element. If yes, it removes the error styling and message
 * @param{String} display - type of css display property
 * @param{String} message
 * @param{Number} minCharsAllowed
 * @return {function}
 */
function checkForInputLength(display, message, minCharsAllowed) {
    return event => {
        if (event.target.value.length === 0 || event.target.value.length < minCharsAllowed) {
            ccErrorMessageBox.style.display = display;
            ccErrorMessageBox.innerHTML = message;
            event.target.style.border = '2px solid rgb(226, 49, 9)';
        } else {
            resetErrorBox(event);
        }
    };
}

/***
 * On submit, the error messages are cleared out, ready for re-populating with new content
 */
function clearErrorMessages(){
    nameErrorMessageBox.innerHTML = '';
    mailErrorMessageBox.innerHTML = '';
    activitiesErrorMessageBox.innerHTML = '';
    ccErrorMessageBox.innerHTML = '';
}

/***
 *
 * @param{HTMLInputElement} nameInput
 * @return {Boolean}
 */
function validateNameField(nameInput) {
    if (nameInput.value.length === 0) {
        nameErrorMessageBox.style.display = 'block';
        nameErrorMessageBox.innerHTML = invalidNameMsg.message;
        nameInput.style.border = '2px solid rgb(226, 49, 9)';
        return false;
    }
    nameErrorMessageBox.style.display = 'none';
    nameErrorMessageBox.innerHTML = '';
    nameInput.style.border = '2px solid rgb(111, 157, 220)';
    return true;
}

/***
 * Validated the value length of the name input
 * @param{HTMLInputElement} emailInput
 * @return {boolean}
 */
function validateMailField(emailInput) {
    if (!mailAddressRegExp.test(emailInput.value)) {
        mailErrorMessageBox.style.display = 'block';
        mailErrorMessageBox.innerHTML = mailFieldMsg.message;
        mailFieldMsg.displayed = true;
        emailInput.style.border = '2px solid rgb(226, 49, 9)';
        return false;
    }
    mailErrorMessageBox.style.display = 'none';
    mailErrorMessageBox.innerHTML = '';
    mailFieldMsg.displayed = false;
    emailInput.style.border = '2px solid rgb(111, 157, 220)';
    return true;
}

/***
 * Validates the email address inserted into the input
 * @param{HTMLOptionsCollection} activitiesSelected
 * @return {boolean}
 */
function validateActivities(activitiesSelected) {
    let activitiesTitle = activitiesList.getElementsByTagName('legend')[0];
    let selected = 0;
    for (let i = 0; i < activitiesSelected.length; i++) {
        if (activitiesSelected[i].checked) {
            selected++;
        }
    }
    if (selected === 0) {
        activitiesTitle.style.color = 'rgb(226, 49, 9)';
        activitiesErrorMessageBox.style.display = 'block';
        activitiesErrorMessageBox.innerHTML = activitiesFieldMsg.message;
        activitiesFieldMsg.displayed = true;
        return false;
    }
    activitiesTitle.style.color = 'rgba(6, 49, 68, 0.9)';
    activitiesErrorMessageBox.style.display = 'none';
    activitiesErrorMessageBox.innerHTML = '';
    activitiesFieldMsg.displayed = false;
    return true;
}

/***
 * Validates the 3 fields mandatory for the credit card info: credit card number, zip code and cvv
 * In case of faulty input, it displays a summarized error message for all 3 fields
 * @return {Boolean}
 */
function validateCreditCardInfo() {
    let validCC = true, validZP = true, validCVV = true;
    if (creditCardField.value.length === 0 || creditCardField.value.length < 13) {
        validCC = displayErrMsgOnSubmit('Credit card number must be between 13 and 16 digits;');
        creditCardField.style.border = '2px solid rgb(226, 49, 9)';
    }
    if (zipCodeField.value.length === 0 || zipCodeField.value.length < 5) {
        validZP = displayErrMsgOnSubmit('\n\nZip code must be 5 digits;');
        zipCodeField.style.border = '2px solid rgb(226, 49, 9)';
    }
    if (cvvField.value.length === 0 || zipCodeField.value.length < 3) {
        validCVV = displayErrMsgOnSubmit('\n\nCVV code must be 3 digits');
        cvvField.style.border = '2px solid rgb(226, 49, 9)';
    }
    if (validCC && validZP && validCVV) {
        ccErrorMessageBox.style.display = 'none';
        ccErrorMessageBox.innerHTML = '';
        creditCardField.style.border = '2px solid rgb(111, 157, 220)';
        zipCodeField.style.border = '2px solid rgb(111, 157, 220)';
        cvvField.style.border = '2px solid rgb(111, 157, 220)';
    }

    return validCC && validZP && validCVV;
}

/***
 * Displays a summarized error message for the 3 fields of the credit card section: credit card number, zip code and cvv
 * @param{String} message
 * @return {Boolean}
 */
function displayErrMsgOnSubmit(message) {
    ccErrorMessageBox.style.display = 'block';
    ccErrorMessageBox.innerHTML += message;
    return false;
}
