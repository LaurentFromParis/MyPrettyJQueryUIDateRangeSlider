/// <reference path="./dependencies/moment.min.js" />
$.widget("ljo.rangeSlider", {
    //need momentjs
    // default options
    _garbageCollector: [],
    _periodicityAllowedValues: [
        "years",
        "quarters",
        "months",
        "weeks",
        "days",
        "hours",
        "minutes",
        "seconds",
        "milliseconds"
    ],
    _dragging: false,


    version: "0.9.9",
    element: null,
    slider: null,
    leftHandle: null,
    rightHandle: null,
    mainHandle: null,
    defaultElement: "<div>",
    options: {
        behavior: {
            draggable: true,
            dateMode: {
                periodicity: "days", //sec, min, hou, day, wee, mon, yea, cen,
                locale: "fr"
            }
        },
        layout: {
            backgroundColor: "#eee",
            sliderBackgroundColor: "#ccc",
        },
        range: {
            bounds: { min: moment().startOf("year").toDate(), max: moment().endOf("year").toDate() },
            values: { min: moment().startOf("month").toDate(), max: moment().endOf("month").toDate() }
        },
        change: null
    },
    valuesMin: function (v) {
        if (v == undefined) {
            return this.options.values.min;
        } else {
            this.options.range.values.min = v;
            this._refresh();
        }
    },
    valuesMax: function (v) {
        if (v == undefined) {
            return this.options.values.max;
        } else {
            this.options.range.values.max = v;
            this._refresh();
        }
    },
    boundsMin: function (v) {
        if (v == undefined) {
            return this.options.bounds.min;
        } else {
            this.options.range.bounds.min = v;
            this._refresh();
        }
    },
    boundsMax: function (v) {
        if (v == undefined) {
            return this.options.bounds.max;
        } else {
            this.options.range.bounds.max = v;
            this._refresh();
        }
    },
    widget: function () {
        return this.element;
    },
    // The constructor
    _create: function () {
        moment.locale(this.options.behavior.dateMode.locale);
        this.element
            // add a class for theming
            .addClass("ljo-rangeSlider")
            .css("background-color", this.options.layout.backgroundColor)
            .on("mouseup", function (e) {
                var thisData = $(this).data("ljo-rangeSlider");
                if (!thisData._dragging) {
                    slider = $(this).find(".ljo-rangeSlider-Slider");
                    var sliderLeft = slider.offset().left - slider.parent().offset().left;
                    var desiredDate = thisData.options.range.values.min;
                    if (e.offsetX < sliderLeft) {
                        //Période précédente
                        desiredDate = moment(thisData.options.range.values.min).add(-1, thisData.options.behavior.dateMode.periodicity).toDate();
                        if (moment(desiredDate).diff(moment(thisData.options.range.bounds.min), "milliseconds") <= 0) {
                            desiredDate = thisData.options.range.bounds.min;
                        }
                    } else if (e.offsetX > sliderLeft + slider.width()) {
                        desiredDate = moment(thisData.options.range.values.min).add(1, thisData.options.behavior.dateMode.periodicity).toDate();
                        if (moment(moment(thisData.options.range.bounds.max).diff(desiredDate), "milliseconds") <= 0) {
                            desiredDate = thisData.options.range.bounds.max;
                        }
                    }
                    var sliderMilliseconds = thisData._getSliderMilliseconds();
                    thisData.options.range.values.min = desiredDate;
                    thisData.options.range.values.max = moment(desiredDate).add(sliderMilliseconds, "milliseconds").toDate();
                    console.log("ljo.rangeSlider drag" + moment(thisData.options.range.values.min).format("YYYY-MM-DDThh:mm:ss") + " to " + moment(thisData.options.range.values.max).format("YYYY-MM-DDThh:mm:ss"));
                    thisData._refresh(e);
                    thisData._trigger("change", event, thisData.options.range);
                }
            });
        this.generatedElementSlider = $("<div>", {
            "class": "ljo-rangeSlider-h ljo-rangeSlider-Slider",
        })
            .appendTo(this.element)
            .css("width", this._sliderWidth())
            .css("background-color", this.options.layout.sliderBackgroundColor)
            .draggable(
            {
                axis: "x",
                containment: "parent",
                drag: function (e, ui) {
                    var thisData = $(this).parent().data("ljo-rangeSlider");
                    thisData._dragging = true;
                    var periodMilliseconds = thisData._getPeriodMilliseconds();
                    var sliderMilliseconds = thisData._getSliderMilliseconds();
                    var slidingDistance = thisData._getSlidingDistance();
                    //slidingDistance<=>periodMilliseconds
                    //ui.position.left<=>x
                    var millisecondsToAdd = parseInt(((periodMilliseconds - sliderMilliseconds) * ui.position.left) / slidingDistance);
                    thisData.options.range.values.min = moment(thisData.options.range.bounds.min).add(millisecondsToAdd, "milliseconds").toDate();
                    thisData.options.range.values.max = moment(thisData.options.range.bounds.min).add(millisecondsToAdd + sliderMilliseconds, "milliseconds").toDate();
                    $(this).parent().find("[data-role='valuesmin']").text(moment(thisData.options.range.values.min).format("DD/MM/YYYY"));
                    $(this).parent().find("[data-role='valuesmax']").text(moment(thisData.options.range.values.max).format("DD/MM/YYYY"));
                    console.log("ljo.rangeSlider drag" + moment(thisData.options.range.values.min).format("YYYY-MM-DDThh:mm:ss") + " to " + moment(thisData.options.range.values.max).format("YYYY-MM-DDThh:mm:ss"));
                },
                stop: function (e, ui) {
                    console.log("ljo.rangeSlider dragStop");
                    var thisData = $(this).parent().data("ljo-rangeSlider");
                    thisData._dragging = false;
                    thisData._refresh(e);
                    thisData._trigger("change", e, thisData.options.range);
                }
            }
            );
        this._garbageCollector.push(this.generatedElementSlider);

        this.generatedElementBoundMinCont = $("<table>", {
            "class": "ljo-rangeSlider-minBoundCont",
        })
            .css("height", $(this.element).height() + "px")
            .appendTo(this.element);
        this._garbageCollector.push(this.generatedElementBoundMinCont);

        this.generatedElementBoundMaxCont = $("<table>", {
            "class": "ljo-rangeSlider-maxBoundCont",
        })
            .css("height", $(this.element).height() + "px")
            .appendTo(this.element);
        this._garbageCollector.push(this.generatedElementBoundMaxCont);

        this.generatedElementBoundMinContTr1 = $("<tr>")
            .appendTo(this.generatedElementBoundMinCont);
        this._garbageCollector.push(this.generatedElementBoundMinContTr1);

        this.generatedElementBoundMaxContTr1 = $("<tr>")
            .appendTo(this.generatedElementBoundMaxCont);
        this._garbageCollector.push(this.generatedElementBoundMaxContTr1);

        this.generatedElementBoundMinIcon = $("<td>", {
            "class": "ui-icon ui-icon-circle-arrow-e"
        }).appendTo(this.generatedElementBoundMinContTr1);
        this._garbageCollector.push(this.generatedElementBoundMinIcon);

        this.generatedElementBoundMinTd = $("<td>", {
            "class": "ljo-rangeSlider-minBoundTd",
            "data-role": "boundsmin"
        })
            .text(moment(this.options.range.bounds.min).format("DD/MM/YYYY"))
            .appendTo(this.generatedElementBoundMinContTr1);
        this._garbageCollector.push(this.generatedElementBoundMinTd);

        this.generatedElementValuesMinTd = $("<td>", {
            "class": "ljo-rangeSlider-minValuesTd",
            "data-role": "valuesmin"
        })
            .text(moment(this.options.range.values.min).format("DD/MM/YYYY"))
            .appendTo(this.generatedElementBoundMinContTr1);
        this._garbageCollector.push(this.generatedElementValuesMinTd);

        this.generatedElementValuesMaxTd = $("<td>", {
            "class": "ljo-rangeSlider-maxValuesTd",
            "data-role": "valuesmax"
        })
            .text(moment(this.options.range.values.max).format("DD/MM/YYYY"))
            .appendTo(this.generatedElementBoundMaxContTr1);
        this._garbageCollector.push(this.generatedElementValuesMaxTd);

        this.generatedElementBoundMaxTd = $("<td>", {
            "class": "ljo-rangeSlider-maxBoundTd",
            "data-role": "boundsmax"
        })
            .text(moment(this.options.range.bounds.max).format("DD/MM/YYYY"))
            .appendTo(this.generatedElementBoundMaxContTr1);
        this._garbageCollector.push(this.generatedElementBoundMaxTd);

        this.generatedElementBoundEndIcon = $("<td>", {
            "class": "ui-icon ui-icon-circle-arrow-w"
        })
            .appendTo(this.generatedElementBoundMaxContTr1)
        this._garbageCollector.push(this.generatedElementBoundEndIcon);

        this._refresh(null);
    },
    _buildHandle: function () {
        this.generatedElementSlider
    },
    _sliderWidth: function (v) {
        var toReturn = "0px";
        if (v == undefined) {
            if (this.options.behavior.dateMode) {
                var s = moment(this.options.range.values.max).diff(moment(this.options.range.values.min), "milliseconds");
                var c = moment(this.options.range.bounds.max).diff(moment(this.options.range.bounds.min), "milliseconds");
                toReturn = this.element.width() * (s / c);
            } else {
                toReturn = this.element.width() * ((this.options.range.values.max - this.options.range.values.min) / (this.options.range.bounds.max - this.options.range.bounds.min));
            }
            return toReturn;
        } else {
            if (v >= this.element.width()) {
                this.element.find("ljo-rangeSlider-slider").css("width", this.element.width() + "px");
            } else if (v <= 0) {
                this.element.find("ljo-rangeSlider-slider").css("width", 0 + "px");
            } else {
                this.element.find("ljo-rangeSlider-slider").css("width", v + "px");
            }
        }
    },
    // Events bound via _on are removed automatically
    // revert other modifications here
    _destroy: function () {
        // remove generated elements
        while (this._garbageCollector.length > 0) {
            (this._garbageCollector[this._garbageCollector.length - 1]).remove();
            this._garbageCollector.pop();
        }
        this.generatedElementSlider.remove();

        this.element
            .removeClass("ljo-rangeSlider")
            .enableSelection()
            .css("background-color", "transparent");
    },

    // _setOptions is called with a hash of all options that are changing
    // always refresh when changing options
    _setOptions: function () {
        // _super and _superApply handle keeping the right this-context
        this._superApply(arguments);
        this._refresh();
    },

    // _setOption is called for each individual option that is changing
    _setOption: function (key, value) {
        // prevent invalid values
        this._super(key, value);
    },
    _getPeriodMilliseconds : function () {
        var toReturn = moment(this.options.range.bounds.max).diff(moment(this.options.range.bounds.min), "milliseconds");
        return toReturn;
    },
    _getSliderMilliseconds: function () {
        var toReturn = moment(this.options.range.values.max).diff(moment(this.options.range.values.min), "milliseconds")
        return toReturn;
    },
    _getSlidingDistance: function () {
        var toReturn = this.element.width() - this.element.find("ljo-rangeSlider-slider").width();
        return toReturn;
    },
    // Called when created, and later when changing options
    _refresh: function (event) {
        // Trigger a callback/event
        console.log("ljo.rangeSlider _refresh")
        //ToDo refresh internal controls and resize slider using existing code.
        this._refreshSlider(this.options.range.bounds.min, this.options.range.bounds.max, this.options.range.values.min, this.options.range.values.max);
    },
    _refreshSlider: function (boundsMin, boundsMax, valuesMin, valuesMax) {
        this.element.find("[data-role='boundsmin']").text(moment(boundsMin).format("DD/MM/YYYY"));
        this.element.find("[data-role='boundsmax']").text(moment(boundsMax).format("DD/MM/YYYY"));
        this.element.find("[data-role='valuesmin']").text(moment(valuesMin).format("DD/MM/YYYY"));
        this.element.find("[data-role='valuesmax']").text(moment(valuesMax).format("DD/MM/YYYY"));
        var rangeSliderWidth = $(this.element).width();
        var periodMilliseconds = this._getPeriodMilliseconds();
        var sliderMilliseconds = this._getSliderMilliseconds();
        var slidingDistance = this._getSlidingDistance();
        var pixelDuration = slidingDistance / periodMilliseconds;
        var sliderWidth = sliderMilliseconds * pixelDuration;
        var pixelSlidingDuration = slidingDistance / periodMilliseconds;
        var slideDuration = moment(valuesMin).diff(moment(boundsMin), "milliseconds");
        var sliderLeft = slideDuration * pixelSlidingDuration;
        this.slider = this.element.find("ljo-rangeSlider-slider");
        this.element.find(".ljo-rangeSlider-Slider").css("width", sliderWidth + "px");
        this.element.find(".ljo-rangeSlider-Slider").css("left", sliderLeft + "px");
        console.log("_refreshSlider: "
            + "\nrangeSliderWidth :" + rangeSliderWidth
            + "\nperiodMilliseconds :" + periodMilliseconds
            + "\npixelDuration :" + pixelDuration
            + "\nsliderMilliseconds :" + sliderMilliseconds
            + "\nsliderWidth :" + sliderWidth
            + "\nsliderLeft :" + sliderLeft
        );
    }
});
$('#widget').on('widgetcreate', function (event, ui) {
    alert('Hi again!');
});