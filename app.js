(function() {
    angular.module('wallpaper', [])
        .controller('containerController', ['$scope', function($scope) {
            $scope.name = 'My Collection';
            $scope.images = [];

            if (localStorage.getItem('images')) {
                $scope.images = JSON.parse(localStorage.getItem('images'));
            }

            if (localStorage.getItem('name')) {
                $scope.name = localStorage.getItem('name');
            }

            $scope.addItem = function(item) {

                function hasClass(el, cls) {
                    return el.className && new RegExp("(\\s|^)" + cls + "(\\s|$)").test(el.className);
                }

                var element = document.getElementById("input-url");
                /* use like below */
                // Check if an element has class "foo"
                if (hasClass(element, "is-dirty")) {
                    // Show an alert message if it does
                    $scope.images.push({
                        url: item
                    });

                    localStorage.removeItem('images');

                    localStorage.setItem('images', JSON.stringify($scope.images));
                }

            };

            $scope.removeItem = function(index) {
                $scope.images.splice(index, 1);


                localStorage.removeItem('images');

                localStorage.setItem('images', JSON.stringify($scope.images));
            }

            $scope.changeName = function() {
                var nome = prompt("Set the name of this collection!");

                if (nome !== null && nome !== '') {
                    $scope.name = nome;

                    if (localStorage.getItem('name')) {
                        localStorage.removeItem('name');
                    }

                    localStorage.setItem('name', nome);
                }
            }

            $scope.copy = function(item) {
                window.prompt("URL: ", item.url);
            }

            $scope.showImage = function(url) {
                $('.image-show').css('background', 'url(' + url + ') center / cover');
                $('.image-show').fadeIn('fast');
            }

        }]);
})();

$(document).ready(function() {

    $('#close').click(function() {
        $('.image-show').fadeOut('fast');
        $('.image-show').css('background', 'black');
    });

    $('#cancel, #add').click(function() {
        $('#input').css('display', 'none');
    });

    $('#fab, .header-add-button').click(function() {
        $('#input').fadeIn('fast');
    });
});