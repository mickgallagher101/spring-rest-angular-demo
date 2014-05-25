'use strict';

/*******************************************************************************
 * Controllers - configure interaction with back-end
 ******************************************************************************/

var trade360Controllers = angular.module('trade360Controllers', []);

var base_url = 'http://mint1-laptop:8090/';
var instr_url = base_url + "instrument.json";
var wi_url = base_url + "workItem.json";
var cust_url = base_url + "customer.json";
var cust_addr_url = base_url + "customerAddress.json";

/****************************************************************************/

trade360Controllers.controller(
		'instrumentCtrl', 
		[ '$scope', '$http', 'InstrumentService',
		  
		function($scope, $http, InstrumentService) {
			$http.get(instr_url).success(function(data) {
				$scope.instrument = data;
			});
		
			$scope.musicalInstruments = InstrumentService.getInstruments();
		
		} ]
);

/****************************************************************************/

trade360Controllers.controller(
		'customerCtrl', 
		[ '$scope', '$http', 'CustomerFactory', 'RestCustomerFactory',
		  'RestCustomerAddressFactory', 'Api',
		
	        function($scope, $http, CustomerFactory, 
	        		RestCustomerFactory, RestCustomerAddressFactory,
	        		Api) {
			
			    /* Gets customers from factory with local data */
				$scope.customers = CustomerFactory.getCustomers();
	        
				/* Add a customer locally to the local customer list */
				$scope.addCustomer = function() {
				    $scope.customers.push({
				    	name:$scope.newCustomer.name, 
				    	city:$scope.newCustomer.city});
				}
			
				/* Gets customers from factory with remote REST call */
    			RestCustomerFactory.getCustomer(function(data) {
    				$scope.dbCustomer = data;
				    console.log('MICK - RestCustomerFactory async returned value =' 
				        + JSON.stringify(data));
    			});

				/* Gets customer address from factory with remote REST call */
    			RestCustomerAddressFactory.getCustomerAddress(function(data) {
    				$scope.dbCustomerAddress = data;
				    console.log('MICK - RestCustomerAddressFactory async returned value =' 
				        + JSON.stringify(data));
    			});
    			
    			$scope.resCustomer = Api.resCustomer.get();
    			$scope.resCustomerAddress = Api.resCustomerAddress.query();
    			
    			console.log('MICK - resCustomer = ' + JSON.stringify($scope.resCustomer));
    			console.log('MICK - resCustomerAddress = ' + JSON.stringify($scope.resCustomerAddress));

		    }
		]
);

/****************************************************************************/

trade360Controllers.controller('workItemCtrl', [ '$scope', '$http',
		function($scope, $http) {
			$http.get(wi_url).success(function(data) {
				$scope.workItem = data;
			});
		} ]);

/****************************************************************************/

trade360Controllers.factory('CustomerFactory', function() {
	
	var factory = {};
	var customers = [
	          	   {name:'Billy Bob', city:'Phoenix'}, 
	        	   {name:'Jim Bob', city:'Preston'}, 
	        	   {name:'Bobby Sue', city:'Manchester'}, 
	        	   {name:'Zubediah Bilbo', city:'London'}
	        	];
	
	factory.getCustomers = function() {
		return customers;
	};
	
	return factory;
});

/****************************************************************************/

trade360Controllers.factory(
		'RestCustomerFactory', 
		['$http',
		 
			 function($http) {
				 return {
					getCustomer: function(callback) {
					    $http.get(cust_url).success(callback);
					}
				}
			}
		]
);

/****************************************************************************/

trade360Controllers.factory(
		'RestCustomerAddressFactory', 
		['$http',
		 
			 function($http) {
				 return {
					getCustomerAddress: function(callback) {
					    $http.get(cust_addr_url).success(callback);
					}
				}
			}
		]
);

trade360Controllers.factory(
		'Api', 
		['$resource',
          function($resource) {
			return {
                resCustomer: $resource(cust_url),
                resCustomerAddress:  $resource(cust_addr_url),
            };
}]);

/****************************************************************************/

trade360Controllers.service('InstrumentService', function() {
	
	var instruments = [
	          	   {name:'Guitar', description:'Lots of strings'}, 
	        	   {name:'Flute', description: 'Hollow log'}, 
	        	   {name:'Drums', description:'Really noisy'}, 
	        	   {name:'Piano', description:'Lots of keys'}
	        	];
	
	this.getInstruments = function() {
		return instruments;
	};
});

