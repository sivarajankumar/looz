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
			template:  '<canvas width="{{width}}" height="{{height}}">\
						</canvas>',
			link : function(scope, element, attributes){
				var canvas = element.find("canvas")[0].getContext("2d"),
					width, height,
					startTime, endTime, 
					numberOfRows, numberOfColumns, 
					cellWidth, cellHeight,
					i;

				function drawGrid(){
					for(i = 0; i <= numberOfRows; i++){
						canvas.moveTo(0,(i*cellHeight));
						canvas.lineTo(width, (i*cellHeight));
						canvas.stroke();
					}

					for(i = 0; i <= numberOfColumns; i++){
						canvas.moveTo((cellWidth * i), 0);
						canvas.lineTo((cellWidth * i), height);
						canvas.stroke();
					}	
				}

				function drawHours(startTime){
					var y;

					for(i = 1; i <= numberOfRows +1; i++){
						y = (i*cellHeight) - 5;
						canvas.fillText(startTime.toString(), 0, y);
						startTime.next();						
					}
				}

				startTime = new app.Time(8, 0);
				endTime = new app.Time(23, 0);
				numberOfRows = getNumberOfRows(startTime, endTime);
				numberOfColumns = 4 + 1; // TODO: fix this to be the number of locations
				width = element.parent().width();				
				cellWidth = Math.round(width / numberOfColumns);
				cellHeight = 20;
				height = Math.round(cellHeight * numberOfRows);	

				scope.height = height;
				scope.width = width;

				setTimeout(function(){
					drawGrid();
					drawHours(startTime.clone());
				},0);
				
			}
		};
	}]);

})(angular);