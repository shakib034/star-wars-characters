var app = angular.module("myApp", []); 
app.controller('myCtrl', function($scope, $http, $q) {

    $scope.showSpinner = false;
    
    $http.get('/characters.json').then(function(response) {
        $scope.characters = response.data.characters;
    });   


    $scope.getMovieList = function(charUrl) {

        $scope.showSpinner = true;

        
        
        
        $http.get(charUrl).then(onSuccess, onError);  

        function onSuccess(response) {  

            var charFilmUrls = response.data.films; 

            console.log(charFilmUrls);    

            var movieList = [];
            promiseArray = [];

            charFilmUrls.forEach(function(element) {

                var movie = {title: null, relaseDate: null};

                //console.log(element);
                var getRequest = {
                    method: "GET",
                    url: element,
                    headers : {'Accept' : 'application/json'}                    
                }

                promiseArray.push($http(getRequest).then(function(response) {
                    movie.title = response.data.title;
                    movie.relaseDate = response.data.release_date;
                    movieList.push(movie);

                    console.log(movie);
                }));
            });
            //console.log(promiseArray);
            $q.all(promiseArray).then(function(response) {
                $scope.showSpinner = false;
                console.log(movieList.length);
                $('#myModal').modal('show');
            });
            $scope.movieList = movieList;
        }
        
        function onError(data) {     
                     if(data.status==404) {
                        $('#myModal').modal('hide');
                        $scope.showSpinner = false;
                        alert('Invalid URl/Service not available. \nPlease try again later');                        
                     }
     
        }

    }


    $scope.formatDate = function(date){
        var dateOut = new Date(date.replace(/-/g, '\/'));
        return dateOut;
    };



    
});
