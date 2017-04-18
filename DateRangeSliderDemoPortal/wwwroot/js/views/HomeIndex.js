var datePickerFormatDate = "dd/mm/yy";


var sliderRangeOptions = {
    bounds: { min: null, max: null },
    values: { min: null, max: null }
};

var rangeSliderChangeHandler = function (e, range) {
    $("#valuesStart").val(moment(range.values.min).format("DD/MM/YYYY"));
    $("#valuesEnd").val(moment(range.values.max).format("DD/MM/YYYY"));
}
var boundsStartChangeHandler = function (e) {
    $("#dateRangeSlider").data("ljo-rangeSlider").boundsMin($(this).datepicker('getDate'));
}

var boundsEndChangeHandler = function (e) {
    $("#dateRangeSlider").data("ljo-rangeSlider").boundsMax($(this).datepicker('getDate'));
}

var valuesStartChangeHandler = function (e) {
    $("#dateRangeSlider").data("ljo-rangeSlider").valuesMin($(this).datepicker('getDate'));
}

var valuesEndChangeHandler = function (e) {
    $("#dateRangeSlider").data("ljo-rangeSlider").valuesMax($(this).datepicker('getDate'));
}

var DocReady = function () {
    sliderRangeOptions.bounds.min = moment(new Date()).subtract(6, "months").toDate();
    sliderRangeOptions.bounds.max = moment(new Date()).add(6, "months").toDate();
    sliderRangeOptions.values.min = new Date();
    sliderRangeOptions.values.max = moment(new Date()).add(1, "months").toDate();
    datePickerOptions = {
        dateFormat: datePickerFormatDate
    };
    //#region datePickers
    $("#boundsStart").val(moment(sliderRangeOptions.bounds.min).format("DD/MM/YYYY"));
    $("#boundsEnd").val(moment(sliderRangeOptions.bounds.max).format("DD/MM/YYYY"));
    $("#valuesStart").val(moment(sliderRangeOptions.values.min).format("DD/MM/YYYY"));
    $("#valuesEnd").val(moment(sliderRangeOptions.values.max).format("DD/MM/YYYY"));
    $("#boundsStart").datepicker(datePickerOptions);
    $("#boundsEnd").datepicker(datePickerOptions);
    $("#valuesStart").datepicker(datePickerOptions);
    $("#valuesEnd").datepicker(datePickerOptions);
    $("#boundsStart").on("change", boundsStartChangeHandler);
    $("#boundsEnd").on("change", boundsEndChangeHandler);
    $("#valuesStart").on("change", valuesStartChangeHandler);
    $("#valuesEnd").on("change",   valuesEndChangeHandler);
    //#endregion
    //#region sliderRange
    $("#dateRangeSlider").rangeSlider({
        behavior: {
            dateMode: {
                periodicity: "months",//Le remplissage de la liste déroulante des périodicités commence à 1 (valeur BDD)
                locale: "fr"
            }
        },
        range: sliderRangeOptions,
        change: rangeSliderChangeHandler
    });
    //#endregion
}