(function(angular){
	'use strict';

	var app = angular.module('app');

	/*
	 * Create a time object that consists of hours and minutes.
	 * Hours can be set to 0 - 23.
	 * Minuts must be in 15 minuts intervals, accepting 0, 15, 30 and 45 as valid values.
	 */
	function Time(hours, minutes){
		var _hours = 0,
			_minutes = 0;

		function nullOrUndef(value){
			return 'undefined' === typeof value || value === null;
		}

		function ensureNumber(value){
			if('number' !== typeof value){
				throw new Error('Time expecting a number');
			}
		}

		function hoursSetterGetter(value){
			if(nullOrUndef(value) === true){
				return _hours;
			}
			else{
				ensureNumber(value);
				if(value < 0 || value > 23){
					throw new Error('Invalid hours value, expecting values between 0 ans 23');
				}
				_hours = value;
			}
		}

		function minutesSetterGetter(value){
			if(nullOrUndef(value) === true){
				return _minutes;
			}
			else{
				ensureNumber(value);
				if(value === 0 || value === 15 || value === 30 || value === 45){
					_minutes = value;
				}
				else{
					throw new Error('Invalid minutes value, valid values are 0, 15, 30 or 45');
				}
			}
		}

		// Advance time in 15 minuts.
		function next(){
			if(_minutes === 45){
				if(_hours === 23){
					_hours = 0;
				}
				else{
					_hours = _hours + 1;
				}
				_minutes = 0;
			}
			else{
				_minutes = _minutes + 15;
			}				
		}

		function clone(){
			return new Time(_hours, _minutes);
		}

		function toString(){
			var hoursString = _hours < 10 ? '0' + _hours : _hours,
				minutesString = _minutes === 0 ? '0' + _minutes : _minutes;

			return hoursString + ':' + minutesString;
		}

		this.hours = hoursSetterGetter;
		this.minutes = minutesSetterGetter;
		this.next = next;
		this.clone = clone;
		this.toString = toString;

		hoursSetterGetter(hours);
		minutesSetterGetter(minutes);
	}

	app.Time = Time;

})(angular);