/// <reference path="./dependencies/moment.min.js" />
$.widget("ljo.rangeSlider", {
    //need momentjs
    // default options
    version: "0.9.5",
    element: null,
    slider: null,
    leftHandle: null,
    rightHandle: null,
    mainHandle: null,
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
    // The constructor
    _create: function () {
        moment.locale(this.options.behavior.dateMode.locale);
        this.element
          // add a class for theming
        .addClass("ljo-rangeSlider")
        .css("background-color", this.options.layout.backgroundColor)
        .on("mouseup", function (e) {
            var thisData = $(this).data("ljo-rangeSlider");
            var slider = $(this).find(".ljo-rangeSlider-Slider");
            var sliderLeft = slider.offset().left - slider.parent().offset().left;
            var desiredDate = thisData.options.range.values.min;
            if (e.offsetX < sliderLeft) {
                //Période précédente
                desiredDate = moment(thisData.options.range.values.min).add(-1,thisData.options.behavior.dateMode.periodicity).toDate();
                if (moment(desiredDate).diff(moment(thisData.options.range.bounds.min), "milliseconds") <= 0) {
                    desiredDate = thisData.options.range.bounds.min;
                }
            } else if (e.offsetX > sliderLeft + slider.width()) {
                desiredDate = moment(thisData.options.range.values.min).add(1, thisData.options.behavior.dateMode.periodicity).toDate();
                if (moment(moment(thisData.options.range.bounds.max).diff(desiredDate), "milliseconds") <= 0) {
                    desiredDate = thisData.options.range.bounds.max;
                }
            }
            var periodMilliseconds = moment(thisData.options.range.bounds.max).diff(moment(thisData.options.range.bounds.min), "milliseconds");
            var visibleMilliseconds = moment(thisData.options.range.values.max).diff(moment(thisData.options.range.values.min), "milliseconds");
            var moveMilliseconds = moment(desiredDate).diff(moment(thisData.options.range.values.min), "milliseconds");
            thisData.options.range.values.min = desiredDate;
            thisData.options.range.values.max = moment(thisData.options.range.values.min).add(visibleMilliseconds, "milliseconds").toDate();
            var totalDistance = $(this).width() - slider.width();
            var pixelMillisecond = totalDistance / periodMilliseconds;
            var pixelsToAdd = moveMilliseconds * pixelMillisecond;
            slider.css("left", (sliderLeft + pixelsToAdd) + "px");
            $(this).find("[data-role='valuesmin']").text(moment(thisData.options.range.values.min).format("DD/MM/YYYY"));
            $(this).find("[data-role='valuesmax']").text(moment(thisData.options.range.values.max).format("DD/MM/YYYY"));
            console.log("ljo.rangeSlider drag" + moment(thisData.options.range.values.min).format("YYYY-MM-DDThh:mm:ss") + " to " + moment(thisData.options.range.values.max).format("YYYY-MM-DDThh:mm:ss"));
            thisData._refresh(e);
            thisData._trigger("change", event, thisData.options.range);
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
                    var periodMilliseconds = moment(thisData.options.range.bounds.max).diff(moment(thisData.options.range.bounds.min), "milliseconds");
                    var visibleMilliseconds = moment(thisData.options.range.values.max).diff(moment(thisData.options.range.values.min), "milliseconds");
                    var totalDistance = $(this).parent().width() - $(this).width();
                    //totalDistance<=>periodMilliseconds
                    //ui.position.left<=>x
                    var millisecondsToAdd = parseInt(((periodMilliseconds - visibleMilliseconds) * ui.position.left) / totalDistance);
                    thisData.options.range.values.min = moment(thisData.options.range.bounds.min).add(millisecondsToAdd, "milliseconds").toDate();
                    thisData.options.range.values.max = moment(thisData.options.range.values.min).add(visibleMilliseconds, "milliseconds").toDate();
                    $(this).parent().find("[data-role='valuesmin']").text(moment(thisData.options.range.values.min).format("DD/MM/YYYY"));
                    $(this).parent().find("[data-role='valuesmax']").text(moment(thisData.options.range.values.max).format("DD/MM/YYYY"));
                    console.log("ljo.rangeSlider drag" + moment(thisData.options.range.values.min).format("YYYY-MM-DDThh:mm:ss") + " to " + moment(thisData.options.range.values.max).format("YYYY-MM-DDThh:mm:ss"));
                },
                stop: function (e, ui) {
                    console.log("ljo.rangeSlider dragStop");
                    var thisData = $(this).parent().data("ljo-rangeSlider");
                    $(this).parent().find("[data-role='valuesmin']").text(moment(thisData.options.range.values.min).format("DD/MM/YYYY"));
                    $(this).parent().find("[data-role='valuesmax']").text(moment(thisData.options.range.values.max).format("DD/MM/YYYY"));
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

    // Called when created, and later when changing options
    _refresh: function (event) {
        // Trigger a callback/event
        console.log("ljo.rangeSlider _refresh")
        //ToDo refresh internal controls and resize slider using existing code.
    },
    min: function (v) {
        if (v == undefined) {
            return this.options.values.min;
        } else {
            this.options.range.values.min = v;
            this._refresh();
        }
    },
    max: function (v) {
        if (v == undefined) {
            return this.options.values.max;
        } else {
            this.options.range.values.max = v;
            this._refresh();
        }
    },
    boundMin: function (v) {
        if (v == undefined) {
            return this.options.bounds.min;
        } else {
            this.options.range.bounds.min = v;
            this._refresh();
        }
    },
    boundMax: function (v) {
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
    }
});
$('#widget').on('widgetcreate', function (event, ui) {
    alert('Hi again!');
});