/* ----- ANGULAR CODES ----- */
angular.module('wallpaper', [])
    // App Controller
    .controller('containerController', ['$scope', function($scope) {
        $scope.name = 'Album';
        $scope.images = [];
        $scope.shareLink = 'http://gabrielbarbosanascimento.github.io/MaterialCollection/';

        // Runs the localStorage codes, and gets the return
        var code = run();

        /**
         *  Add one image to the array and displays it at the container
         *  @param {string} The link of the image that will be added 
         */
        $scope.addItem = function(imgUrl) {
            var input = document.getElementsByClassName('mdl-textfield')[0];

            if (hasClass(input, 'is-dirty')) {
                // If the image is new, add to the album
                if (!hasUrl(imgUrl)) {
                    $scope.images.push({
                        url: imgUrl
                    });
                } else {
                    alert('This image has already been added');
                }

                // If not editing a shared Url, do cache
                if (code[1] === false) {
                    setItem('images', JSON.stringify($scope.images));
                }
            }
        };

        /**
         *  Check on the array images if the url is not added yet
         *  @param {string} The url to look for in the array
         *  @return {boolean} if it's alredy exist or not
         */
        function hasUrl(link) {
            for (var i = 0, l = $scope.images.length; i < l; i++) {
                if ($scope.images[i].url == link) {
                    return true;
                }
            }

            return false;
        }

        /**
         *  Remove one image to the array and from the container
         *  @param {int} The index of the item that will be removed 
         */
        $scope.removeItem = function(index) {
            $scope.images.splice(index, 1);
            // If not editing a shared Url, do cache
            if (code[1] === false) {
                setItem('images', JSON.stringify($scope.images));
            }
        };

        /**
         *  Change the name of the album and save it on the cache
         *  @param {String} The new name of the album
         */
        $scope.changeName = function(nome) {
            // Check ift's not empty
            $scope.name = nome;
            // If not editing a shared Url, do cache
            if (code[0] === false) {
                setItem('name', nome);
            }
        };

        /**
         *  Gets the link of the image, and shows the image in a image visualizer  
         *  @param {string} The image to display on the visualizer
         */
        $scope.showImage = function(item) {
            var imageShow = document.getElementsByClassName('image-show')[0];
            imageShow.style.background = 'url(' + item.url + ') center / cover';
            imageShow.style.display = 'block';
        };

        /**
         *  Transform all the data in a link to share to others
         */
        $scope.share = function() {
            var link, array;

            link = "";
            array = $scope.images;

            for (var i = 0, len = array.length; i < len; i++) {
                link += '!url!' + array[i].url;
            }

            //If it's only sharing the name of the album, with empty photos
            if (link === "") {
                link = 'http://gabrielbarbosanascimento.github.io/MaterialCollection/#' + 'name==' + encodeURIComponent($scope.name);
            } else {
                link = 'http://gabrielbarbosanascimento.github.io/MaterialCollection/#' + 'name==' + encodeURIComponent($scope.name) + "&&" + "images==" + link;
            }

            $scope.shareLink = link;
        };

        /**
         *  Save an shared album's photos to the localStorage cache, not overwritting the current data
         */
        $scope.save = function() {
            var data = [];
            var cache = localStorage.getItem('images');
            var x = JSON.parse(cache);

            var i, j, len;
            // If there's photos on the cache, do not overwrite them !
            if (cache !== null) {
                // Save first the cache on the array
                for (i = 0, len = x.length; i < len; i++) {
                    delete x[i].$$hashKey;
                    data.push(x[i]);
                }

                // Look for if some photo's url on the shared album is not already included on the cache
                var lengthImages = $scope.images.length;
                var lengthX = x.length;

                for (i = 0; i < lengthImages; i++) {
                    delete $scope.images[i].$$hashKey;
                    var equal = false;

                    // Compare urls with the cache
                    for (j = 0; j < lengthX; j++) {
                        if ($scope.images[i].url == x[j].url) {
                            equal = true;
                        }
                    }

                    // If the url of the photo is not the same, it can be included on the array
                    if (!equal) {
                        data.push($scope.images[i]);
                    }
                }

            } else {
                // If there's not previous cache, the photos of shared album can be painless added
                for (j = 0, len = $scope.images.length; j < len; j++) {
                    delete $scope.images[j].$$hashKey;
                    data.push($scope.images[j]);
                }
            }

            // Save the data on the cache and reload
            setItem('images', JSON.stringify(data));
            setItem('visit', true);
            window.location.assign('http://gabrielbarbosanascimento.github.io/MaterialCollection/');
        };

        /**
         *  Function for the dealing on opening links, checking if it's the regular url of if it's a shared url link
         *  @retun {Array<boolean>} return if the link openend constains an album name or images,
         *  wherein the first position is for the name and the second for the image
         */
        function run() {
            var code = [false, false];
            var name = getUrlData().name;
            var imgs = getUrlData().images;

            // if there's an album's name attr at the link opened
            if (name === undefined || name === null) {
                if (localStorage.getItem('name')) {
                    $scope.name = localStorage.getItem('name');
                }
            } else {
                // Change properties for a shared link page
                $scope.name = decodeURIComponent(name);
                document.getElementsByClassName('splash')[0].style.display = 'none';
                document.getElementById('save-data').style.display = 'block';
                document.getElementById('clear-data').style.display = 'none';
                code[0] = true;
            }

            // if there are imgages attr at the link opened
            if (imgs === undefined || imgs === null) {
                if (localStorage.getItem('images')) {
                    $scope.images = JSON.parse(localStorage.getItem('images'));
                }
            } else {
                // Divide the link to get the data
                var splitUrl = imgs.split('!url!');
                var l = splitUrl.length;

                for (var i = 0; i < l; i++) {
                    if (i > 0) {
                        $scope.images.push({
                            url: splitUrl[i]
                        });
                    }
                }

                code[1] = true;
            }

            return code;
        }

}]);

/**
 *  Add data to the localStorage cache
 *  @param {string} A keyname to get some data from the cache
 *  @param {Object} The data that will be stored
 */
function setItem(key, data) {
    localStorage.setItem(key, data);
}

/**
 *  Remove data from the localStorage cache
 *  @param {string} A keyname to get some data from the cache
 *  @param {Object} The data that will be returned
 */
function removeItem(key, data) {
    localStorage.removeItem(key, data);
}

/**
 *  Clear all the cache data from the localStorage and reload the page
 */
function reset() {
    removeItem('images');
    removeItem('name');
    removeItem('visit');
    location.reload();
}

/**
 *  Gets the link of a shared album and splits it as attributes, storing it in a array
 *  @return {Array<string>} The atributes of the custom Url
 */
function getUrlData() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('#') + 1).split('&&');

    for (var i = 0, l = hashes.length; i < l; i++) {
        hash = hashes[i].split('==');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }

    return vars;
}

/**
 *  Checks if an element has an specific class
 *  @param {HTMLElement} The element to check if contains some class
 *  @param {string} The name of the class to look for in the element
 *  @return {boolean}
 */
function hasClass(el, cls) {
    return el.className && new RegExp("(\\s|^)" + cls + "(\\s|$)").test(el.className);
}

/**
 *  Swich one class for another in some element
 *  @param {HTMLElement} The element desired to swap classes 
 *  @param {string} The name of the class that will be replaced
 *  @param {String} The name of the class that will replace the other class
 */
function swapClasses(elem, class1, class2) {
    elem.classList.remove(class1);
    elem.classList.add(class2);
}

/**
 *  A fadeIn animation effect
 *  @param {HTMLElement} The element desired 
 */
function fadeIn(elem) {
    elem.style.display = 'block';
    elem.classList.remove('fadeOut');
    elem.classList.add('fadeIn');
}

/**
 *  A fadeOut animation effect
 *  @param {HTMLElement} The element desired 
 */
function fadeOut(elem) {
    elem.classList.remove('fadeIn');
    elem.classList.add('fadeOut');
}


/* ----- SPLASH SCREEN CODE ----- */
var splash = document.getElementsByClassName('splash')[0];
var splashImage = document.getElementsByClassName('splash-image')[0];
var nextButton = document.getElementsByClassName('next')[0];
var prevButton = document.getElementsByClassName('prev')[0];
var skipButton = document.getElementsByClassName('skip')[0];
var splashImg1 = document.getElementsByClassName('splash-img')[0];
var splashImg2 = document.getElementsByClassName('splash-img2')[0];
// If it's not the first time visiting, hide intro
if (localStorage.getItem('visit')) {
    splash.style.display = 'none';
} else {
    splash.style.display = 'block';
}

skipButton.addEventListener('click', function() {
    splash.style.display = 'none';
    setItem('visit', true);
}, false);

nextButton.addEventListener('click', function() {
    splash.style.background = '#4286F5';
    splashImage.getElementsByTagName('h2')[0].innerHTML = "Automatically saved";
    splashImage.getElementsByTagName('p')[0].innerHTML = "Never lose data, all photos and settings are quickly saved on cache, to your next visit.";
    skipButton.innerHTML = "OK";
    swapClasses(document.getElementsByClassName('dot1')[0], 'dot-active', 'dot-disable');
    swapClasses(document.getElementsByClassName('dot2')[0], 'dot-disable', 'dot-active');
    nextButton.style.display = 'none';
    splashImg1.style.display = 'none';
    fadeIn(prevButton);
    fadeIn(splashImg2);
}, false);

prevButton.addEventListener('click', function() {
    splash.style.background = '#FEA724';
    splashImage.getElementsByTagName('h2')[0].innerHTML = "Create a collection";
    splashImage.getElementsByTagName('p')[0].innerHTML = "Name your collection and add images to it, but don't worry, no login required. Quick and simple!";
    swapClasses(document.getElementsByClassName('dot1')[0], 'dot-disable', 'dot-active');
    swapClasses(document.getElementsByClassName('dot2')[0], 'dot-active', 'dot-disable');
    prevButton.style.display = 'none';
    splashImg2.style.display = 'none';
    fadeIn(nextButton);
    fadeIn(splashImg1);
}, false);

/* ----- CONTAINER CODE -----*/
var closeButton = document.getElementById('close');
var imageShow = document.getElementsByClassName('image-show')[0];
var input = document.getElementsByClassName('input');
var fab = document.getElementById('fab');
var headerAddButton = document.getElementsByClassName('header-add-button')[0];
var headerShareButton = document.getElementsByClassName('header-share-button')[0];
var renameButton = document.getElementById('rename-album');
var cancelButton = document.getElementsByClassName('cancel');
var addButton = document.getElementsByClassName('add');

closeButton.addEventListener('click', function() {
    imageShow.style.display = 'none';
    imageShow.style.background = 'black';
}, false);

fab.addEventListener('click', function() {
    fadeIn(input[0]);
}, false);

headerAddButton.addEventListener('click', function() {
    fadeIn(input[0]);
}, false);

renameButton.addEventListener('click', function() {
    fadeIn(input[1]);
}, false);

headerShareButton.addEventListener('click', function(){
    fadeIn(input[2]);
}, false);

cancelButton[0].addEventListener('click', function() {
    input[0].style.display = 'none';
}, false);

cancelButton[1].addEventListener('click', function() {
    input[1].style.display = 'none';
}, false);

addButton[0].addEventListener('click', function() {
    input[0].style.display = 'none';
}, false);

addButton[1].addEventListener('click', function() {
    input[1].style.display = 'none';
}, false);

addButton[2].addEventListener('click', function() {
    input[2].style.display = 'none';
}, false);