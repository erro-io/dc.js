dc.abstractBubbleChart = function(_chart) {
    var _maxBubbleRelativeSize = 0.3;
    var _minRadiusWithLabel = 10;

    _chart.BUBBLE_NODE_CLASS = "node";
    _chart.BUBBLE_CLASS = "bubble";
    _chart.MIN_RADIUS = 10;

    _chart = dc.singleSelectionChart(dc.colorChart(_chart));

    _chart.renderLabel(true);
    _chart.renderTitle(false);

    var _r = d3.scale.linear().domain([0, 100]);

    var _rValueAccessor = function(d) {
        return d.r;
    };

    _chart.r = function(_) {
        if (!arguments.length) return _r;
        _r = _;
        return _chart;
    };

    _chart.radiusValueAccessor = function(_) {
        if (!arguments.length) return _rValueAccessor;
        _rValueAccessor = _;
        return _chart;
    };

    _chart.rMin = function() {
        var min = d3.min(_chart.group().all(), function(e) {
            return _chart.radiusValueAccessor()(e);
        });
        return min;
    };

    _chart.rMax = function() {
        var max = d3.max(_chart.group().all(), function(e) {
            return _chart.radiusValueAccessor()(e);
        });
        return max;
    };

    _chart.bubbleR = function(d) {
        var value = _chart.radiusValueAccessor()(d);
        var r = _chart.r()(value);
        if (isNaN(r) || value <= 0)
            r = 0;
        return r;
    };

    var labelFunction = function(d) {
        return _chart.bubbleR(d) > _minRadiusWithLabel ? _chart.label()(d) : "";
    };

    _chart.doRenderLabel = function(bubbleGEnter) {
        if (_chart.renderLabel()) {
            var label = bubbleGEnter.select("text");

            if(label.empty())
                label = bubbleGEnter.append("text");

            label.attr("text-anchor", "middle")
                .attr("dy", ".3em")
                .on("click", _chart.onClick)
                .text(labelFunction);
        }
    };

    _chart.doUpdateLabels = function(bubbleGEnter) {
        if (_chart.renderLabel()) {
            bubbleGEnter.selectAll("text")
                .text(labelFunction);
        }
    };

    var titleFunction = function(d) {
        return _chart.title()(d);
    };

    _chart.doRenderTitles = function(g) {
        if (_chart.renderTitle()) {
            g.append("title").text(titleFunction);
        }
    };

    _chart.doUpdateTitles = function(g) {
        if (_chart.renderTitle()) {
            g.selectAll("title").text(titleFunction);
        }
    };

    _chart.onClick = function(d) {
        var toFilter = d.key;
        if (toFilter == _chart.filter()) {
            dc.events.trigger(function() {
                _chart.filter(null);
                dc.redrawAll(_chart.chartGroup());
            });
        } else {
            dc.events.trigger(function() {
                _chart.filter(toFilter);
                dc.redrawAll(_chart.chartGroup());
            });
        }
    };

    _chart.minRadiusWithLabel = function(_){
        if(!arguments.length) return _minRadiusWithLabel;
        _minRadiusWithLabel = _;
        return _chart;
    };

    _chart.maxBubbleRelativeSize = function(_){
        if(!arguments.length) return _maxBubbleRelativeSize;
        _maxBubbleRelativeSize = _;
        return _chart;
    };

    return _chart;
};
