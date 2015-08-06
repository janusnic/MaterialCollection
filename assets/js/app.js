function clearData() {
    localStorage.removeItem('images');
    localStorage.removeItem('name');
    localStorage.removeItem('visit');
    location.reload();
}

function getUrlData(){
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('#') + 1).split('&&');
    for(var i = 0; i < hashes.length; i++){
        hash = hashes[i].split('==');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function hasClass(el, cls) {
    return el.className && new RegExp("(\\s|^)" + cls + "(\\s|$)").test(el.className);
}

function switchClasses(elem, class1, class2) {
    elem.classList.remove(class1);
    elem.classList.add(class2);
}

function fadeOut(elem, speed) {
    var fadeEffect = setInterval(function() {
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

    var fadeEffect = setInterval(function() {
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
            $scope.name = 'Album';
            $scope.images = [];

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
            };

            $scope.changeName = function() {
                var nome = prompt("Set the name of this collection!");

                if (nome !== null && nome !== '') {
                    $scope.name = nome;

                    if (localStorage.getItem('name')) {
                        localStorage.removeItem('name');
                    }

                    localStorage.setItem('name', nome);
                }
            };

            $scope.copy = function(item) {
                window.prompt("URL: ", item.url);
            };

            $scope.showImage = function(url) {
                var imageShow = document.getElementsByClassName('image-show')[0];
                imageShow.style.background = 'url(' + url + ') center / cover';
                imageShow.style.display = 'block';
            };

            $scope.share = function(){
                var link = "";
                var array = $scope.images;
                for (var i = 0, len = array.length; i < len; i++) {
                    link += '!url!' + array[i].url;      
                }

                if(link == ""){
                    link = 'http://gabrielbarbosanascimento.github.io/MaterialCollection/#' + 'name==' + encodeURIComponent($scope.name);   
                } else{
                    link = 'http://gabrielbarbosanascimento.github.io/MaterialCollection/#' + 'name==' + encodeURIComponent($scope.name) + "&&" + "images==" + link;
                }

                window.prompt("Share the link bellow: ", link);

            };

            $scope.save = function(){
                localStorage.removeItem('images');
                localStorage.removeItem('name');
                localStorage.removeItem('visit');
                localStorage.setItem('images', JSON.stringify($scope.images));
                localStorage.setItem('name', $scope.name);
                localStorage.setItem('visit', true);
                document.getElementById('clear-data').style.display = 'block';           
                window.location.assign('http://gabrielbarbosanascimento.github.io/MaterialCollection/');
            }

            /* ----- Code for receiving an album link from someone ----- */
            var nameUrl = getUrlData()['name'];
            var imagesUrl = getUrlData()['images'];

            //IF GETS AN ALBUMS NAME
            if(nameUrl === undefined || nameUrl === null){
                if (localStorage.getItem('name')) {
                    $scope.name = localStorage.getItem('name');
                }
            } else{
                $scope.name = decodeURIComponent(nameUrl);
                document.getElementsByClassName('splash')[0].style.display = 'none';
                document.getElementById('save-data').style.display = 'block';
                document.getElementById('clear-data').style.display = 'none';    
            }

            //IF GETS IMAGES
            if(imagesUrl === undefined || nameUrl === null){
                if (localStorage.getItem('images')) {
                    $scope.images = JSON.parse(localStorage.getItem('images'));
                }
            } else{ 
                //Divide the urls
                var splitUrl = imagesUrl.split('!url!');
                for (var i = 0; i < splitUrl.length; i++) {
                    if(i > 0){
                        $scope.images.push({
                            url: splitUrl[i]
                        })
                    }
                };
            }

        }]);
})();

/* ----- SPLASH SCREEN CODES ----- */
var splash = document.getElementsByClassName('splash')[0];
var splashImage = document.getElementsByClassName('splash-image')[0];
var nextButton = document.getElementsByClassName('next')[0];
var prevButton = document.getElementsByClassName('prev')[0];
var skipButton = document.getElementsByClassName('skip')[0];
var splashImg1 = document.getElementsByClassName('splash-img')[0];
var splashImg2 = document.getElementsByClassName('splash-img2')[0];
//IF ITS NOT THE FIRST TIME, HIDE SPLASH SCREEN
if (localStorage.getItem('visit')) {
    splash.style.display = 'none';
} else {
    splash.style.display = 'block';
}
//Skip Button Actions
skipButton.addEventListener('click', function() {
    splash.style.display = 'none';
    localStorage.setItem('visit', true);
}, false);
//Next Button Actions
nextButton.addEventListener('click', function() {
    splash.style.background = '#4286F5';
    splashImage.getElementsByTagName('h2')[0].innerHTML = "Automatically saved";
    splashImage.getElementsByTagName('p')[0].innerHTML = "Never lose data, all photos and settings are quickly saved on cache, to your next visit.";
    skipButton.innerHTML = "OK";
    switchClasses(document.getElementsByClassName('dot1')[0], 'dot-active', 'dot-disable');
    switchClasses(document.getElementsByClassName('dot2')[0], 'dot-disable', 'dot-active');
    nextButton.style.display = 'none';
    splashImg1.style.display = 'none';
    fadeIn(prevButton, 25);
    fadeIn(splashImg2, 30);
}, false);
//Prev Button Actions
prevButton.addEventListener('click', function() {
    splash.style.background = '#FEA724';
    splashImage.getElementsByTagName('h2')[0].innerHTML = "Create a collection";
    splashImage.getElementsByTagName('p')[0].innerHTML = "Name your collection and add images to it, but don't worry, no login required. Quick and simple!";
    switchClasses(document.getElementsByClassName('dot1')[0], 'dot-disable', 'dot-active');
    switchClasses(document.getElementsByClassName('dot2')[0], 'dot-active', 'dot-disable');
    prevButton.style.display = 'none';
    splashImg2.style.display = 'none';
    fadeIn(nextButton, 25);
    fadeIn(splashImg1, 30);
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
closeButton.addEventListener('click', function() {
    imageShow.style.display = 'none';
    imageShow.style.background = 'black';
}, false);
//Fade Input Actions
fab.addEventListener('click', function() {
    fadeIn(input, 10);
}, false);
headerAddButton.addEventListener('click', function() {
    fadeIn(input, 10);
}, false);
//Hide Input Actions
cancelButton.addEventListener('click', function() {
    input.style.display = 'none';
}, false);
addButton.addEventListener('click', function() {
    input.style.display = 'none';
