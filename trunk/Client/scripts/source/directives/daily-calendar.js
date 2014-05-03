(function(angular){
	'use strict';

	var app = angular.module('app');

	app.directive('dailyCalendar', [function(){

		// How many rows to draw between startTime and endTime
		function getNumberOfRows(startTime, endTime){
			var stepsFromStart = (60 - startTime.minutes()) / 15,
				stepsBetween = (((endTime.hours() - (startTime.hours() + 1)) * 60) / 15) + 1,
				remainder = endTime.minutes() / 15,
				total = stepsFromStart + stepsBetween + remainder;

			return total;			
		}

		return {
			restrict : 'E',
			scope: {
				locations : '='
			},		
			template:  '<table>\
						</table>',
			link : function(scope, element, attributes){
				var startTime, endTime, 
					numberOfRows, numberOfColumns;					

				function generateDataRow(rowIndex, time){
					var row = '<tr>',
						z;

					row += '<td>'+ time.toString() +'</td>';
					for(z = 0; z < numberOfColumns; z++){
						row += '<td></td>';
					}
					row += '</tr>';
					return row;					
				}

				function generateHeaderRow(){
					var row = '<tr>',
						z;

					row += '<th></th>';
					for(z = 0; z < numberOfColumns; z++){
						row += '<th></th>';
					}
					row += '</tr>';
					return row;					
				}

				function drawTable(){
					var time = startTime.clone(),
						tbody = '<tbody>',
						thead = '<thead>',
						i;

					thead += generateHeaderRow() + '</thead>';
					for(i = 0; i < numberOfRows; i++){						
						tbody += generateDataRow(i, time);
						time.next();
					}
					tbody += '</tbody>';

					return thead + tbody;
				}

				startTime = new app.Time(8, 0);
				endTime = new app.Time(23, 0);
				numberOfRows = getNumberOfRows(startTime, endTime);
				numberOfColumns = scope.locations.length;
				element.append(drawTable());
			}
		};
	}]);

})(angular);