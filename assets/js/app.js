function clearData(){
    localStorage.removeItem('images');
    localStorage.removeItem('name');
    localStorage.removeItem('visit');
    location.reload();
}

function hasClass(el, cls) {
    return el.className && new RegExp("(\\s|^)" + cls + "(\\s|$)").test(el.className);
}

function switchClasses(elem, class1, class2){
    elem.classList.remove(class1);
    elem.classList.add(class2);
}

function fadeOut(elem, speed) {
    var fadeEffect = setInterval(function () {
        if (!elem.style.opacity) {
            elem.style.opacity = 1;
        }
        if (elem.style.opacity < 0.1) {
            clearInterval(fadeEffect);
        } else {
            elem.style.opacity -= 0.1;
        }
    }, speed);

    elem.style.display = 'none';
}

function fadeIn(elem, speed) {
    elem.style.opacity = 0;

    var fadeEffect = setInterval(function () {
        if (elem.style.opacity > 0.9) {
            clearInterval(fadeEffect);
        } else {
            elem.style.opacity = +elem.style.opacity + 0.1;
        }
    }, speed);

    elem.style.display = 'block';
}
/* ----- ANGULAR CODES ----- */
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
                var imageShow = document.getElementsByClassName('image-show')[0];
                imageShow.style.background = 'url(' + url + ') center / cover';
                fadeIn(imageShow, 25);
            }

        }]);
})();

/* ----- SPLASH SCREEN CODES ----- */
var splash = document.getElementsByClassName('splash')[0];
var splashImage = document.getElementsByClassName('splash-image')[0];
var nextButton = document.getElementsByClassName('next')[0];
var skipButton = document.getElementsByClassName('skip')[0];
var splashImg1 = document.getElementsByClassName('splash-img')[0];
var splashImg2 = document.getElementsByClassName('splash-img2')[0];
//IF ITS NOT THE FIRST TIME, HIDE SPLASH SCREEN
if(localStorage.getItem('visit')){
    splash.style.display = 'none';
} else{
    splash.style.display = 'block';
}
//Skip Button Actions
skipButton.addEventListener('click', function(){
    splash.style.display='none';
    localStorage.setItem('visit', true);
}, false);
//Next Button Actions
nextButton.addEventListener('click', function(){
    splash.style.background = '#4286F5';
    splashImage.getElementsByTagName('h2')[0].innerHTML = "Automatically saved";
    splashImage.getElementsByTagName('p')[0].innerHTML = "Never lose data, all photos and settings are quickly saved on cache, to your next visit.";
    skipButton.innerHTML = "OK";
    switchClasses(document.getElementsByClassName('dot1')[0], 'dot-active', 'dot-disable');
    switchClasses(document.getElementsByClassName('dot2')[0], 'dot-disable', 'dot-active');
    fadeOut(nextButton, 25);
    splashImg1.style.display = 'none';
    fadeIn(splashImg2, 30);
}, false);
/* ----- CONTAINER CODE -----*/
var closeButton = document.getElementById('close');
var imageShow = document.getElementsByClassName('image-show')[0];
var input = document.getElementById('input');
var fab = document.getElementById('fab');
var headerAddButton = document.getElementsByClassName('header-add-button')[0];
var cancelButton = document.getElementById('cancel');
var addButton = document.getElementById('add');
//Close Button Action
closeButton.addEventListener('click', function(){
    fadeOut(imageShow, 30);
    imageShow.style.background = 'black';
}, false);
//Fade Input Actions
fab.addEventListener('click', function(){
    fadeIn(input, 10);
}, false);
headerAddButton.addEventListener('click', function(){
    fadeIn(input, 10);
}, false);
//Hide Input Actions
cancelButton.addEventListener('click', function(){
    input.style.display = 'none';
}, false);
addButton.addEventListener('click', function(){
    input.style.display = 'none';
}, false);
