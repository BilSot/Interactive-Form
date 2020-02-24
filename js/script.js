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
    colorDropdown = document.getElementById('color'),
    paymentDropdown = document.getElementById('payment'),
    activitiesList = document.querySelector('fieldset.activities'),
    totalCostTextSpan = document.createElement('span'),
    punsRegExp = /puns/i,
    heartSymbol = '\u2665',
    checkMark = '\u2713',
    heartRegExp = new RegExp(heartSymbol, '');

window.onload = function () {
    DOMManipulation();
    punsColors = jsPunsColorsList(colorDropdown.options);
    heartColors = jsHeartColorsList(colorDropdown.options);
    paymentMethods = getPaymentMethods(paymentDropdown.options);
    hideColorOptionsList();
    setDefaultSelectedOption();
    eventHandlers();
};

function DOMManipulation() {
    let nameInput = document.getElementById('name');
    let otherTitleInput = document.getElementById('other-title');
    let paypalSection = document.getElementById('paypal');
    let bitcoinSection = document.getElementById('bitcoin');
    nameInput.focus();
    otherTitleInput.style.display = 'none';
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

function getPaymentMethods(paymentMethodOptions){
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

function setDefaultSelectedOption(){
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
        addCheckmarkToSelectedOption(event.target, 1);
    });

    jobPositionDropdown.addEventListener('change', function (event) {
        addCheckmarkToSelectedOption(event.target, 0);
    });

    sizeDropdown.addEventListener('change', function (event) {
        addCheckmarkToSelectedOption(event.target, 0);
    });

    monthDropdown.addEventListener('change', function (event) {
        addCheckmarkToSelectedOption(event.target, 0);
    });

    yearDropdown.addEventListener('change', function (event) {
        addCheckmarkToSelectedOption(event.target, 0);
    });

    paymentDropdown.addEventListener('change', function () {
        this.options[0].style.display = 'none';
    }, {once: true});
    paymentDropdown.addEventListener('change', changePaymentHandler);

    activitiesList.addEventListener('change', registerActivitiesHandler);
}

function changeSelectedDesignHandler(event) {
    let optionItem = this.options[this.selectedIndex].label;
    processSelectedOption(optionItem.toLowerCase());
    setSelectedColor(colorDropdown.options);
    addCheckmarkToSelectedOption(event.target, 1);
}

function setSelectedColor(optionsList) {
    for (let j = 1; j < optionsList.length; j++) {
        if (optionsList[j].style.display === 'block') {
            optionsList[j].selected = true;
            break;
        }
    }
    addCheckmarkToSelectedOption(colorDropdown, 1);
}

function changePaymentHandler(event){
    setPaymentMethodVisibility(event.target);
    addCheckmarkToSelectedOption(event.target, 1);
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
        }else{
            if(innerHtml.indexOf(checkMark) === -1) {
                temp = checkMark + innerHtml;
                item.options[item.selectedIndex].innerHTML = temp;
            }
        }
    }
}

function registerActivitiesHandler(event) {
    let totalCost = 0;
    let item = event.target;
    if (item.tagName === 'INPUT') {
        let dataCost = item.getAttribute('data-cost');
        let dateAndTime = item.getAttribute('data-day-and-time');
        let selectedName = item.getAttribute('name');

        let timeSlotObj = getTimeSlot(dateAndTime, selectedName, dataCost, item.checked);
        checkForOverlappingActivities(timeSlotObj);
        totalCost = parseInt(timeSlotObj.cost);
    }

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
                if(timeSlot.checked) {
                    activitiesInputElem[i].setAttribute("disabled", "true");
                }else{
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
