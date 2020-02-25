/******************************************
 Treehouse Techdegree:
 FSJS project 3 - Interactive Form
 ******************************************/
var punsColors = [],
    heartColors = [],
    paymentMethods = [],
    jobPositionDropdown = document.getElementById('title'),
    sizeDropdown = document.getElementById('size'),
    monthDropdown = document.getElementById('exp-month'),
    yearDropdown = document.getElementById('exp-year'),
    designDropdown = document.getElementById('design'),
    colorDivSection = document.querySelector('div#colors-js-puns');
    colorDropdown = document.getElementById('color'),
    paymentDropdown = document.getElementById('payment'),
    otherTitleInput = document.querySelector('input#other-title');
    creditCardField = document.querySelector('input#cc-num'),
    zipCodeField = document.querySelector('input#zip'),
    cvvField = document.querySelector('input#cvv'),
    activitiesList = document.querySelector('fieldset.activities'),
    submitButton = document.querySelector('form'),
    totalCostTextSpan = document.createElement('span'),
    punsRegExp = /puns/i,
    heartSymbol = '\u2665',
    checkMark = '\u2713',
    heartRegExp = new RegExp(heartSymbol, ''),
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
        'message': 'Name field can not be empty',
        'displayed': false
    },
    mailFieldMsg = {
        'message': 'Invalid e-mail address',
        'displayed': false
    },
    activitiesFieldMsg = {
        'message': 'Please select at least one activity',
        'displayed': false
    },
    ccSectionErrMsg = {
        'displayed': false
    };

window.onload = function () {
    DOMManipulation();
    punsColors = jsPunsColorsList(colorDropdown.options);
    heartColors = jsHeartColorsList(colorDropdown.options);
    paymentMethods = getPaymentMethods(paymentDropdown.options);
    hideColorOptionsList();
    //setDefaultSelectedOption();
    eventHandlers();
};

function DOMManipulation() {
    let nameInput = document.getElementById('name');
    let paypalSection = document.getElementById('paypal');
    let bitcoinSection = document.getElementById('bitcoin');
    nameInput.focus();
    otherTitleInput.style.display = 'none';
    colorDivSection.style.display = 'none';
    paypalSection.style.display = 'none';
    bitcoinSection.style.display = 'none';
    paymentDropdown.options[1].innerHTML = checkMark + paymentDropdown.options[1].innerHTML;

    let selectElem = document.getElementById('color');
    let defaultColorOption = document.createElement('option');
    defaultColorOption.innerHTML = "Please select a T-shirt theme";
    defaultColorOption.selected = true;
    selectElem.insertBefore(defaultColorOption, selectElem.firstChild);

    totalCostTextSpan.id = 'js-total-cost';
    totalCostTextSpan.innerHTML = "Total cost: $";
    let totalCostPriceSpan = document.createElement('span');
    totalCostPriceSpan.id = 'price';
    totalCostPriceSpan.innerHTML = '0';
    totalCostTextSpan.appendChild(totalCostPriceSpan);
    let activitiesElem = document.querySelector('fieldset.activities');
    activitiesElem.appendChild(totalCostTextSpan);
}

function jsPunsColorsList(colorsOptions) {
    let punsList = [];
    for (let j = 1; j < colorsOptions.length; j++) {
        if (punsRegExp.test(colorsOptions[j].label.toLowerCase())) {
            punsList.push(colorsOptions[j].getAttribute('value'));
        }
    }

    return punsList;
}

function jsHeartColorsList(colorsOptions) {
    let heartColorsList = [];
    for (let j = 1; j < colorsOptions.length; j++) {
        if (heartRegExp.test(colorsOptions[j].label.toLowerCase())) {
            heartColorsList.push(colorsOptions[j].getAttribute('value'));
        }
    }

    return heartColorsList;
}

function getPaymentMethods(paymentMethodOptions) {
    let paymentMethods = [];
    for (let j = 1; j < paymentMethodOptions.length; j++) {
        paymentMethods.push(paymentMethodOptions[j].getAttribute('value'));
    }

    return paymentMethods;
}

function hideColorOptionsList() {
    let defaultOption = 'select theme';
    if (designDropdown.options[0].value.toLowerCase() === defaultOption) {
        let colorsList = colorDropdown.options;
        for (let i = 1; i < colorsList.length; i++) {
            colorsList[i].style.display = 'none';
        }
    }
}

function setDefaultSelectedOption() {
    addCheckmarkToSelectedOption(jobPositionDropdown, 0);
    addCheckmarkToSelectedOption(sizeDropdown, 0);
    addCheckmarkToSelectedOption(monthDropdown, 0);
    addCheckmarkToSelectedOption(yearDropdown, 0);
}

function eventHandlers() {
    designDropdown.addEventListener('change', changeSelectedDesignHandler);
    designDropdown.addEventListener('change', function () {
        this.options[0].style.display = 'none';
        colorDropdown.options[0].style.display = 'none';
    }, {once: true});

    colorDropdown.addEventListener('change', function (event) {
        //addCheckmarkToSelectedOption(event.target, 1);
    });

    jobPositionDropdown.addEventListener('change', function (event) {
        //addCheckmarkToSelectedOption(event.target, 0);
        if(event.target.options[event.target.selectedIndex].value === 'other'){
            otherTitleInput.style.display = 'inline';
        }else{
            otherTitleInput.style.display = 'none';
        }
    });

    sizeDropdown.addEventListener('change', function (event) {
        //addCheckmarkToSelectedOption(event.target, 0);
    });

    monthDropdown.addEventListener('change', function (event) {
        //addCheckmarkToSelectedOption(event.target, 0);
    });

    yearDropdown.addEventListener('change', function (event) {
        //addCheckmarkToSelectedOption(event.target, 0);
    });

    paymentDropdown.addEventListener('change', function () {
        this.options[0].style.display = 'none';
    }, {once: true});
    paymentDropdown.addEventListener('change', changePaymentHandler);

    activitiesList.addEventListener('change', registerActivitiesHandler);

    creditCardField.addEventListener('input', checkForNumericInput(16));
    creditCardField.addEventListener('focus', checkForInputLength('block','Credit card number must be between 13 and 16 digits', 13));
    creditCardField.addEventListener('blur', checkForInputLength('none','',13));

    zipCodeField.addEventListener('input', checkForNumericInput(5));
    zipCodeField.addEventListener('focus', checkForInputLength('block','Zip code must be 5 digits', 5));
    zipCodeField.addEventListener('blur', checkForInputLength('none','', 5));

    cvvField.addEventListener('input', checkForNumericInput(3));
    cvvField.addEventListener('focus', checkForInputLength('block','CVV must be 3 digits', 3));
    cvvField.addEventListener('blur', checkForInputLength('none','', 3));

    submitButton.addEventListener('submit', function(event){
        let nameInput = document.getElementById('name');
        let emailInput = document.getElementById('mail');
        let activitiesSelected = activitiesList.getElementsByTagName('input');
        let activitiesTitle = activitiesList.getElementsByTagName('legend')[0];

        if(nameInput.value.length === 0){
            nameErrorMessageBox.style.display = 'block';
            nameErrorMessageBox.innerHTML = invalidNameMsg.message;
            invalidNameMsg.displayed = true;
        }else{
            nameErrorMessageBox.style.display = 'none';
            nameErrorMessageBox.innerHTML = '';
            invalidNameMsg.displayed = false;
        }

        let mailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!mailRegExp.test(emailInput.value)){
            mailErrorMessageBox.style.display = 'block';
            mailErrorMessageBox.innerHTML = mailFieldMsg.message;
            mailFieldMsg.displayed = true;
        }else{
            mailErrorMessageBox.style.display = 'none';
            mailErrorMessageBox.innerHTML = '';
            mailFieldMsg.displayed = false;
        }

        let selected = 0;
        for(let i = 0; i < activitiesSelected.length; i++){
            if(activitiesSelected[i].checked){
                selected++;
            }
        }
        if(selected === 0){
            activitiesTitle.style.color = 'rgb(226, 49, 9)';
            activitiesErrorMessageBox.style.display = 'block';
            activitiesErrorMessageBox.innerHTML = activitiesFieldMsg.message;
            activitiesFieldMsg.displayed = true;
        }else{
            activitiesTitle.style.color = 'rgba(6, 49, 68, 0.9)';
            activitiesErrorMessageBox.style.display = 'none';
            activitiesErrorMessageBox.innerHTML = '';
            activitiesFieldMsg.displayed = false;
        }

        let ccErrMsg = false, zipCodeErrMsg = false, cvvCodeErrMsg = false;
        if(creditCardField.value.length === 0 || creditCardField.value.length < 13){
            ccErrMsg = displayErrMsgOnSubmit('Credit card number must be between 13 and 16 digits;');
        }
        if(zipCodeField.value.length === 0 || zipCodeField.value.length < 5){
            zipCodeErrMsg = displayErrMsgOnSubmit('\n\nZip code must be 5 digits;');
        }
        if(cvvField.value.length === 0 || zipCodeField.value.length < 3){
            cvvCodeErrMsg = displayErrMsgOnSubmit('\n\nCVV code must be 3 digits');
        }
        if(!ccErrMsg && !zipCodeErrMsg && !cvvCodeErrMsg){
            ccErrorMessageBox.style.display = 'none';
            ccErrorMessageBox.innerHTML = '';
            ccSectionErrMsg.displayed = false;
        }

        if(invalidNameMsg.displayed || mailFieldMsg.displayed || activitiesFieldMsg.displayed || ccSectionErrMsg.displayed){
            event.preventDefault();
        }
    });
}

function displayErrMsgOnSubmit(message) {
    ccErrorMessageBox.style.display = 'block';
    ccErrorMessageBox.innerHTML += message;
    ccSectionErrMsg.displayed = true;
    return true;
}

function changeSelectedDesignHandler(event) {
    colorDivSection.style.display = 'block';
    let optionItem = this.options[this.selectedIndex].label;
    processSelectedOption(optionItem.toLowerCase());
    setSelectedColor(colorDropdown.options);
    //addCheckmarkToSelectedOption(event.target, 1);
}

function setSelectedColor(optionsList) {
    for (let j = 1; j < optionsList.length; j++) {
        if (optionsList[j].style.display === 'block') {
            optionsList[j].selected = true;
            break;
        }
    }
    //addCheckmarkToSelectedOption(colorDropdown, 1);
}

function changePaymentHandler(event) {
    setPaymentMethodVisibility(event.target);
    addCheckmarkToSelectedOption(event.target, 1);
}

function checkForNumericInput(maxCharsAllowed) {
    return event => {
        let keyInserted = event.target.value;//event.key ? event.key : event.code;
        if(event.target.value.length === 0){
            resetErrorBox(event);
            return;
        }
        if(event.shiftKey){
            event.preventDefault();
            //resetErrorBox(event);
            return;
        }
        let error1 = false;
        let error2 = false;
        if(/[a-zA-Z-!$%^&*()_+|~=`{}\[\]:\/;'<>?,.@#\s]/.test(keyInserted)){
            error1 = true;
        }
        if(event.target.value.length > maxCharsAllowed){
            error2 = true;
        }
        event.target.value = event.target.value.replace(/[a-zA-Z-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#\s]/, '');

        if(error1 && !error2) {
            if (!numericInputMsg.displayed) {
                ccErrorMessageBox.style.display = 'block';
                ccErrorMessageBox.innerHTML = numericInputMsg.message;
                numericInputMsg.displayed = true;
                event.target.style.border = '2px solid rgb(226, 49, 9)';
            }
        }
        if (!error1 && error2) {
            event.target.value = event.target.value.substr(0, maxCharsAllowed);
            if(!maxCharsMsg.displayed) {
                ccErrorMessageBox.style.display = 'block';
                ccErrorMessageBox.innerHTML = maxCharsMsg.message + maxCharsAllowed;
                maxCharsMsg.displayed = true;
                event.target.style.border = '2px solid rgb(226, 49, 9)';
            }
        }
        if(!error1 && !error2){
            resetErrorBox(event);
        }
    };
}

function checkForInputLength(display, message, minCharsNeeded) {
    return event => {
        if (event.target.value.length === 0 || event.target.value.length < minCharsNeeded) {
            ccErrorMessageBox.style.display = display;
            ccErrorMessageBox.innerHTML = message;
            event.target.style.border = '2px solid rgb(226, 49, 9)';
            ccSectionErrMsg.displayed = true;
        } else {
            resetErrorBox(event);
        }
    };
}

function resetErrorBox(event) {
    numericInputMsg.displayed = false;
    maxCharsMsg.displayed = false;
    ccErrorMessageBox.innerHTML = '';
    ccErrorMessageBox.style.display = 'none';
    event.target.style.border = '2px solid rgb(111, 157, 220)';
}

function setPaymentMethodVisibility(item) {
    let selectedPayment = item.options[item.selectedIndex].value;
    document.getElementById(selectedPayment).style.display = 'block';
    for (let i = 0; i < paymentMethods.length; i++) {
        if (paymentMethods[i] !== selectedPayment) {
            document.getElementById(paymentMethods[i]).style.display = 'none';
        }
    }
}

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

function registerActivitiesHandler(event) {
    let totalCost = 0;
    let item = event.target;
    let timeSlotObj = {};
    if (item.tagName === 'INPUT') {
        let dataCost = item.getAttribute('data-cost');
        let dateAndTime = item.getAttribute('data-day-and-time');
        let selectedName = item.getAttribute('name');
        timeSlotObj = getTimeSlot(dateAndTime, selectedName, dataCost, item.checked);
    }
    checkForOverlappingActivities(timeSlotObj);
    totalCost = parseInt(timeSlotObj.cost);
    updateTotalCost(totalCost, item);

}

function updateTotalCost(totalCost, item) {
    let cost = parseInt(totalCostTextSpan.getElementsByTagName('span')[0].innerHTML);

    if (item.checked) {
        cost += totalCost;
    } else {
        cost -= totalCost;
    }
    totalCostTextSpan.getElementsByTagName('span')[0].innerHTML = `${cost}`;
    totalCostTextSpan.style.display = 'inline';
}

function getTimeSlot(dateAndTime, name, dataCost, itemChecked) {
    let timeSlot = {};
    if (dateAndTime !== undefined && dateAndTime !== null) {
        timeSlot = dateAndTime.split(" ");
    }
    let date = timeSlot[0] ? timeSlot[0] : '';
    let time = timeSlot[1] ? timeSlot[1] : '';
    return {
        'date': date,
        'time': time,
        'name': name,
        'cost': dataCost,
        'checked': itemChecked
    };
}

function checkForOverlappingActivities(timeSlot) {
    let activitiesInputElem = document.querySelector('fieldset.activities').getElementsByTagName('input');
    for (let i = 0; i < activitiesInputElem.length; i++) {
        if (activitiesInputElem[i].getAttribute('name') !== timeSlot.name) {
            let activityInfo = getTimeSlot(activitiesInputElem[i].getAttribute('data-day-and-time'),
                activitiesInputElem[i].getAttribute('name'),
                activitiesInputElem[i].getAttribute('data-cost'));

            if (activityInfo.date === timeSlot.date && activityInfo.time === timeSlot.time) {
                if (timeSlot.checked) {
                    activitiesInputElem[i].setAttribute("disabled", "true");
                } else {
                    activitiesInputElem[i].removeAttribute("disabled");
                }
            }

        }
    }
}

function processSelectedOption(optionItem) {
    let optionValue = optionItem;
    if (punsRegExp.test(optionValue)) {
        setColorVisibility(punsColors, 'block');
        setColorVisibility(heartColors, 'none');
    } else if (heartRegExp.test(optionValue)) {
        setColorVisibility(heartColors, 'block');
        setColorVisibility(punsColors, 'none');
    }
}

function setColorVisibility(array, style) {
    let colors = colorDropdown.options;
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < colors.length; j++) {
            if (colors[j].getAttribute('value') === array[i]) {
                colors[j].style.display = style;
            }
        }
    }
}
