/**
 * Created by leow on 6/13/16.
 */
"use strict"

function prepareBabbageParams() {
    // Assumptions: this context is mapped to the currrent state structure ..
    console.error("INSIDE prepareBabbageParams")
    // Output: ["<key>:<JSON_value>", "<key>:<JSON_value>"]
    // key is current_level, value is what is drilled down
    // ES6 object map??
    // [{k1,v1}, {k2,v2}]
    /*
     var cut = _.map(
     $scope.state.dimensions.current.filters,
     function(value, key) {
     return key + ':"' + value + '"';
     });

     var series = $scope.state.dimensions.current.series;
     if (series && !_.isArray(series)) {
     series = [series];
     }

     var babbageParams = {
     aggregates: $scope.state.measures.current,
     group: [_.first($scope.state.dimensions.current.groups)],
     filter: cut,
     order: [$scope.state.orderBy]
     };
     if (series && series.length) {
     babbageParams.series = series;
     }

     $scope.state.babbage = babbageParams;

     var babbageTimeSeries = babbageParams;
     if (babbageParams.series) {
     var seriesSameAsGroups = (babbageParams.series.length == 1) &&
     (babbageParams.series[0] == babbageParams.group[0]);
     if (seriesSameAsGroups) {
     babbageTimeSeries = _.extend({}, babbageParams);
     babbageTimeSeries.series = undefined;
     }
     }
     $scope.state.babbageTimeSeries = babbageTimeSeries;

     $scope.state.babbagePivot = {
     aggregates: $scope.state.measures.current,
     rows: $scope.state.dimensions.current.rows,
     cols: $scope.state.dimensions.current.columns,
     filter: cut,
     order: [$scope.state.orderBy]
     };

     $scope.state.babbageFacts = {
     aggregates: $scope.state.measures.current,
     group: [_.first($scope.state.dimensions.current.groups)],
     filter: cut
     };



     */
    // The Object returned is passed direct into the
    // component?
}

