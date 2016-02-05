'use strict';
AMIApp.controller('RequestCtrl', ['$scope', '$location', '$window', '$timeout', 'NavCollection', 'AMIRequest', function ($scope, $location, $window, $timeout, NavCollection, AMIRequest) {
  var blurListener;
  $window.scrollTo(0,0);
  $scope.nextIsLoading = false;
  $scope.previous = function(){
    $location.path('/account');
  }
  if(!AMIRequest.has('subject') || !AMIRequest.has('operator') || !AMIRequest.has('services' || !(typeof _.findWhere(AMIRequest.get('services'), {selected: true}) !== "undefined")) || AMIRequest.has('')){
    $scope.previous();
    return;
  }

  $scope.components = AMIRequest.get('components');

  $scope.jurisdiction = AMIRequest.get('jurisdiction');
  $scope.industry = AMIRequest.get('industry');
  $scope.operator = AMIRequest.get('operator');
  $scope.services = AMIRequest.get('services');
  $scope.subject = AMIRequest.get('subject');
  console.log("subject", $scope.subject);
  $scope.date = moment().format('MMMM Do, YYYY');
  AMIRequest.set('date', $scope.date);
  
  $scope.servicelist = '';
  for(var i=0; i < $scope.services.length; i++){
  	var dividerChar = "";
  	if(i == $scope.services.length - 1){
  		dividerChar = ""
  	}
  	else if(i == $scope.services.length - 2){
  		dividerChar = " and ";
  	}
  	else{
  		dividerChar = ", ";
  	}
  	$scope.servicelist = $scope.servicelist + $scope.services[i].title + dividerChar;
  }
  if($scope.services.length > 1){
  	$scope.servicelist += " services";
  }
  else{
	$scope.servicelist += " service";
  }

  $scope.displayInstructions = false;
  $scope.displayEmailExtras = false;

  $scope.componentdata = $scope.components['data']['items'];
  $scope.componentquestions = $scope.components['questions']['items'];

  $scope.pdf = {
    isGenerating: false,
    isGenerated: false
  };
  $scope.email = {
    isGenerating: false,
    isGenerated: false
  }
  blurListener = function(){
    $window.removeEventListener('blur', blurListener, false);
    $timeout.cancel(timer);
    $scope.setLetterDoneState();
  }
  $scope.emailClick = function(){
      var timer2;
      var timer = $timeout(function(){
        $scope.showEmailExtras();
        $timeout.cancel(timer2);
        timer2 = $timeout(function(){
          $window.removeEventListener('blur', blurListener, false);
        },3000);
      }, 1500);
      $window.addEventListener('blur', blurListener, false);
    }
  $scope.generatePDF = function(){
    $scope.pdf.isGenerating = true;
  }
  $scope.$watch('pdf.isGenerated', function(newVal, oldVal){
    if(newVal === true && (oldVal === false || typeof oldVal == "undefined")){
      $scope.letterDoneState = true;
    }
  });
  $scope.instructionsDisplayToggle = function(){
    if($scope.displayInstructions){
      $scope.displayInstructions = false;
    }
    else{
      $scope.displayInstructions = true;
    }
  }
  $scope.showEmailExtras = function(){
    $scope.displayEmailExtras = true;
  }
  $timeout(function(){
    $scope.email.isGenerating = true;
  }, 100);

  NavCollection.unRestrict('finish');
}]);