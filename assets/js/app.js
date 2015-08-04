function clearData(){
    localStorage.removeItem('images');
    localStorage.removeItem('name');
    localStorage.removeItem('visit');
    location.reload();
}

function hasClass(el, cls) {
    return el.className && new RegExp("(\\s|^)" + cls + "(\\s|$)").test(el.className);
}
/* ----- ANGULAR CODE ----- */
(function() {
    angular.module('wallpaper', [])
        //CONTROLLER
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
                var element = document.getElementById("input-url");

                if (hasClass(element, "is-dirty")) {
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
/* ----- JQUERY CODE ----- */
$(document).ready(function() {
    if(localStorage.getItem('visit')){
        $('.splash').css('display', 'none');
    }

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

    $('.splash-actions .skip').click(function() {
        $('.splash').css('display', 'none');
        localStorage.setItem('visit', true);
    });

    $('.splash-actions .next').click(function() {
        $('.splash').css('background', '#4286F5');
        $('.splash-image h2').text('Automatically saved');
        $('.splash-image p').text('Never lose data, all photos and settings are quickly saved on cache, to your next visit');
        $('.splash-actions .skip').text('OK');
        $('.dot1').removeClass('dot-active').addClass('dot-disable');
        $('.dot2').removeClass('dot-disable').addClass('dot-active');
        $(this).fadeOut('fast');
        $('.splash-img').css('display', 'none');
        $('.splash-img2').fadeIn('fast');
    });
});