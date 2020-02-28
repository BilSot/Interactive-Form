/******************************************
 Treehouse Techdegree:
 FSJS project 3 - Interactive Form
 ******************************************/
const punsRegExp = /puns/i,
    heartSymbol = '\u2665',
    heartRegExp = new RegExp(heartSymbol, ''),
    nonDigitsRegExp = /\D+/,
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
 * Once the whole form is displayed, the default state of the form is set (hiding and displaying elements),
 * the colors of the two designs and the payment methods are stored in arrays; the colors are hidden until a design is chosen
 * and the event listeners are attached to the elements
 */
window.onload = function () {
    setInitialFormState();
    punsColors = jsPunsColorsList(colorDropdown.options);
    heartColors = jsHeartColorsList(colorDropdown.options);
    paymentMethods = getPaymentMethods(paymentDropdown.options);
    //hideColorOptionsList();
    attachEventListeners();
};

/***
 * Sets the default state of the form (hiding and displaying elements and setting placeholders for the Color and Payment dropdown lists)
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

    designDropdown.options[0].disabled = true;
    designDropdown.options[0].selected = true;
    designDropdown.options[0].hidden = true;

    paymentDropdown.options[0].disabled = true;
    paymentDropdown.options[0].selected = true;
    paymentDropdown.options[0].hidden = true;

    let colorSelectElem = document.getElementById('color');
    let defaultColorOption = document.createElement('option');
    defaultColorOption.innerHTML = "Please select a T-shirt theme";
    defaultColorOption.selected = true;
    defaultColorOption.disabled = true;
    defaultColorOption.hidden = true;
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
 * If the Design's selected option is the default (`Select Theme`), the colors are not accessible until another selection is being made
 */
function hideColorOptionsList() {
    let defaultOption = designDropdown.options[designDropdown.selectedIndex].value;
    if (defaultOption.toLowerCase() === 'select theme') {
        let colorsList = colorDropdown.options;
        for (let i = 1; i < colorsList.length; i++) {
            colorsList[i].style.display = 'none';
        }
    }
}

/***
 * Attaches the events that occur on the HTML elements
 */
function attachEventListeners() {
    nameInput.addEventListener('blur', function(event){
        validateNameField(event.target);
    });

    emailInput.addEventListener('blur', function(event){
        validateMailField(event.target);
    });

    designDropdown.addEventListener('change', changeSelectedDesignHandler);

    jobPositionDropdown.addEventListener('change', function (event) {
        if (event.target.options[event.target.selectedIndex].value === 'other') {
            otherTitleInput.style.display = 'inline';
        } else {
            otherTitleInput.style.display = 'none';
        }
    });

    paymentDropdown.addEventListener('change', changePaymentHandler);

    activitiesList.addEventListener('change', activitiesChangeHandler);

    creditCardField.addEventListener('input', checkForNumericInput(16));
    creditCardField.addEventListener('paste', checkForNumericInput(16));
    creditCardField.addEventListener('focus', checkForValidInputOnFocus('block', 'Credit card number must be between 13 and 16 digits', 13));
    creditCardField.addEventListener('blur', checkForValidInputOnBlur( 13));

    zipCodeField.addEventListener('input', checkForNumericInput(5));
    zipCodeField.addEventListener('paste', checkForNumericInput(5));
    zipCodeField.addEventListener('focus', checkForValidInputOnFocus('block', 'Zip code must be 5 digits', 5));
    zipCodeField.addEventListener('blur', checkForValidInputOnBlur( 5));

    cvvField.addEventListener('input', checkForNumericInput(3));
    cvvField.addEventListener('paste', checkForNumericInput(3));
    cvvField.addEventListener('focus', checkForValidInputOnFocus('block', 'CVV must be 3 digits', 3));
    cvvField.addEventListener('blur', checkForValidInputOnBlur( 3));

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
 * It displays the Color dropdown list.
 * It checks if the selected option's value contains either the word `puns` or `heart`.
 * The 1st color option displayed, from each category (puns or hearts) is set as `selected`
 */
function changeSelectedDesignHandler() {
    colorDivSection.style.display = 'block';
    let optionItem = this.options[this.selectedIndex].label;
    matchSelectedOption(optionItem.toLowerCase());
    defineSelectedColor(colorDropdown.options);
}

/***
 * Checks whether the `optionItemLabel` contains either the word `puns` or `heart`. In case of `puns` matched, the `puns` colors
 * are shown and the `heart` colors are hidden and vice-versa.
 * @param{String} optionItemLabel
 */
function matchSelectedOption(optionItemLabel) {
    if (punsRegExp.test(optionItemLabel)) {
        setColorOptionsVisibility(punsColors, 'block');
        setColorOptionsVisibility(heartColors, 'none');
    } else if (heartRegExp.test(optionItemLabel)) {
        setColorOptionsVisibility(heartColors, 'block');
        setColorOptionsVisibility(punsColors, 'none');
    }
}

/***
 * Sets the visibility of the color options, stored in the `array`, based on the `style`
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
}

/***
 * Displays the selected payment section on the form and hides the rest of the payment methods
 * Sets the global `selectedPaymentMethod` to the selected option's value
 * @param {Event} event
 */
function changePaymentHandler(event) {
    let selectedPayment = event.target.options[event.target.selectedIndex].value;
    document.getElementById(selectedPayment).style.display = 'block';
    for (let i = 0; i < paymentMethods.length; i++) {
        if (paymentMethods[i] !== selectedPayment) {
            document.getElementById(paymentMethods[i]).style.display = 'none';
        }
    }
    selectedPaymentMethod = selectedPayment;
}

/***
 * Retrieves the selected activity's info (cost, day, time), checks for other activities happening at the same day and time
 * and updates the total cost
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
 * Checks for the content of the input element if it contains only digits. If not, it displays an error message.
 * It also checks for the maximum allowed length of the input. It displays an error message if exceeded
 * In case the input is correct, it clears out the error messages and styling
 * @param{Number} maxCharsAllowed
 * @return {function}
 */
function checkForNumericInput(maxCharsAllowed) {
    return event => {
        let isNonNumericInput = false;
        let exceedsMaxLength = false;
        let contentInserted = event.target.value;

        if (event.target.value.length === 0) {
            resetErrorBox(event);
            return;
        }

        if (nonDigitsRegExp.test(contentInserted)) {
            ccErrorMessageBox.style.display = 'block';
            event.target.style.border = '2px solid rgb(226, 49, 9)';
            ccErrorMessageBox.innerHTML = numericInputMsg.message;
            numericInputMsg.displayed = true;
            isNonNumericInput = true;

        }

        if (event.target.value.length > maxCharsAllowed) {
            ccErrorMessageBox.style.display = 'block';
            event.target.style.border = '2px solid rgb(226, 49, 9)';
            if(numericInputMsg.displayed) {
                ccErrorMessageBox.innerHTML += '; ' + maxCharsMsg.message + maxCharsAllowed;
            }else{
                ccErrorMessageBox.innerHTML = maxCharsMsg.message + maxCharsAllowed;
            }
            maxCharsMsg.displayed = true;
            exceedsMaxLength = true;
        }

        if (!isNonNumericInput && !exceedsMaxLength) {
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
 * Checks the validity of the input content whenever the user selects the field.
 * When the content has less than the minimum required characters AND if there are any NON digit characters inserted, an error message and styling are shown.
 * If the content is in the correct format, it clears out the error messages and styling
 * @param{String} display - type of css display property
 * @param{String} message
 * @param{Number} minCharsAllowed
 * @return {function}
 */
function checkForValidInputOnFocus(display, message, minCharsAllowed) {
    return event => {
        if (nonDigitsRegExp.test(event.target.value) || event.target.value.length === 0 || event.target.value.length < minCharsAllowed) {
            ccErrorMessageBox.style.display = display;
            ccErrorMessageBox.innerHTML = message;
            event.target.style.border = '2px solid rgb(226, 49, 9)';
        } else {
            resetErrorBox(event);
        }
    };
}

/***
 * Checks the validity of the input content whenever the user leaves the field.
 * When the content has less than the required characters OR there are any NON digit characters inserted, an error styling is applied.
 * If the content has more than the required characters, the content is truncated to the length of `charsRequired`
 * If the content is in the correct format, it clears out the error messages and styling
 * @param charsRequired
 * @return {function}
 */
function checkForValidInputOnBlur(charsRequired){
    return event => {
        if (event.target.value.length < charsRequired || nonDigitsRegExp.test(event.target.value)) {
            event.target.style.border = '2px solid rgb(226, 49, 9)';
        }
        if(event.target.value.length > charsRequired){
            event.target.value = event.target.value.substr(0, charsRequired);
        }
        if(event.target.value.length === charsRequired && !nonDigitsRegExp.test(event.target.value)){
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
 * Checks if there is any content inserted into the field.
 * In case of none, an error message is displayed and error border styling is applied to the field
 * Otherwise, the default styling is applied and the error message is cleared out
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
 * Checks whether the inserted email address is in the correct format.
 * In case of incorrect input, an error message is displayed and error border styling is applied to the field
 * Otherwise, the default styling is applied and the error message is cleared out
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
 * Checks whether there is at least one activity selected.
 * In case of none, error styling is applied to the title of the Activities section and an error message is displayed
 * Otherwise, the default styling is applied and the error message is cleared out
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
 * Validates the 3 mandatory fields for the credit card info: credit card number, zip code and cvv
 * In case of faulty input, it displays an error message for the incorrect fields and applies error border styling
 * If all the fields are correct, the default border styling is applied and the error messages are cleared out
 * @return {Boolean}
 */
function validateCreditCardInfo() {
    let validCC = true, validZP = true, validCVV = true;
    if (creditCardField.value.length === 0 || creditCardField.value.length < 13 || nonDigitsRegExp.test(creditCardField.value)) {
        validCC = displayErrMsgOnSubmit('Credit card number must be between 13 and 16 digits;');
        creditCardField.style.border = '2px solid rgb(226, 49, 9)';
    }
    if (zipCodeField.value.length === 0 || zipCodeField.value.length < 5 || nonDigitsRegExp.test(zipCodeField.value)) {
        validZP = displayErrMsgOnSubmit('\n\nZip code must be 5 digits;');
        zipCodeField.style.border = '2px solid rgb(226, 49, 9)';
    }
    if (cvvField.value.length === 0 || zipCodeField.value.length < 3 || nonDigitsRegExp.test(cvvField.value)) {
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
 * Displays an error message for the incorrect fields of the credit card section: credit card number, zip code and cvv
 * @param{String} message
 * @return {Boolean}
 */
function displayErrMsgOnSubmit(message) {
    ccErrorMessageBox.style.display = 'block';
    ccErrorMessageBox.innerHTML += message;
    return false;
}
