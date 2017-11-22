///<reference path="../typings/jquery/jquery.d.ts"/>
///<reference path="../typings/kineticjs/kinetic.d.ts"/>
///<reference path="../typings/bootstrap/bootstrap.d.ts"/>
var verseDisplay;
(function (verseDisplay) {
    var verseDisplayAnimation = (function () {
        function verseDisplayAnimation(baseUrl, imageUrl) {
            this._stage = null;
            this._memoryVerseKineticImage = null;
            this._layer1 = null;
            this._bounceAnimList = new Array();
            this._crazyAnimList = new Array();
            this._bounceList = new Array();
            this._shapeList = new Array();
            this._rotatedAngle = 0;
            this._plusRotate = true;
            this._maxWidth = 750;
            this._maxHeight = 550;
            this._scale = 1;
            this._shrinking = true;
            this.BaseUrl = baseUrl;
            this.ImageUrl = imageUrl.replace("~", baseUrl);
            this.InitializeStage();
            this._stage.draw();
            this._layer1.draw();
            this.HookControls();
            $('#ShowMenu').hide();
            $('#AnimationButtonGroup').show();
            $(document).on('ready', function () {
                $('container').click();
            });
        }
        // for rotation
        verseDisplayAnimation.prototype._rotateSpeed = function () {
            var rangeElement = document.getElementById('rangeSpeed');
            var rangeSpeed = +rangeElement.value;
            return rangeSpeed;
        };
        verseDisplayAnimation.prototype.HookControls = function () {
            var _this = this;
            $("#AnimationButtonGroup").on('click touchend', '#ButtonNone', function (e) {
                _this.None();
            });
            $("#AnimationButtonGroup").on('click touchend', '#ButtonSpin', function (e) {
                _this.Spin();
            });
            $('#AnimationButtonGroup').on('click touchend', '#ButtonWobble', function (e) {
                _this.Wobble();
            });
            $('#AnimationButtonGroup').on('click touchend', '#ButtonCover', function (e) {
                _this.Cover();
            });
            $('#AnimationButtonGroup').on('click touchend', '#ButtonBounce', function (e) {
                _this.Bounce();
            });
            $('#AnimationButtonGroup').on('click touchend', '#ButtonCrazy', function (e) {
                _this.Crazy();
            });
            $('#AnimationButtonGroup').on('click touchend', '#ButtonShrink', function (e) {
                _this.Shrink();
            });
            $('#HideMenu').on('click touchend', function (e) {
                $('#HideMenu').hide();
                $('#ShowMenu').show();
                $('#AnimationButtonGroup').slideUp();
            });
            $('#ShowMenu').on('click touchend', function (e) {
                $('#ShowMenu').hide();
                $('#HideMenu').show();
                $('#AnimationButtonGroup').slideDown();
            });
        };
        verseDisplayAnimation.prototype.InitializeStage = function () {
            var _this = this;
            this._stage = new Kinetic.Stage({
                container: 'container',
                width: 750,
                height: 550
            });
            this._layer1 = new Kinetic.Layer();
            var memoryVerseImage = new Image();
            memoryVerseImage.src = this.ImageUrl;
            this._memoryVerseKineticImage = new Kinetic.Image({
                x: this._maxWidth / 2, y: this._maxHeight / 2,
                image: memoryVerseImage,
                width: this._maxWidth, height: this._maxHeight,
                draggable: true
            });
            this._memoryVerseKineticImage.setOffset(this._maxWidth / 2, this._maxHeight / 2);
            this._layer1.add(this._memoryVerseKineticImage);
            this._stage.add(this._layer1);
            this._animSpin = new Kinetic.Animation(function (frame) {
                var angleDiff = 0.02 * _this._rotateSpeed();
                _this._memoryVerseKineticImage.rotateDeg(angleDiff);
                _this._rotatedAngle = _this._rotatedAngle + angleDiff;
            }, this._layer1);
            this._animShrink = new Kinetic.Animation(function (frame) {
                if (_this._shrinking == true) {
                    _this._scale = _this._scale - 0.01;
                }
                else {
                    _this._scale = _this._scale + 0.01;
                }
                if ((_this._scale < 0) || (_this._scale > 1)) {
                    _this._shrinking = !_this._shrinking;
                }
                _this._memoryVerseKineticImage.setHeight(_this._maxHeight * _this._scale);
                _this._memoryVerseKineticImage.setWidth(_this._maxWidth * _this._scale);
            }, this._layer1);
            this._animWobble = new Kinetic.Animation(function (frame) {
                var angleDiff = 0.02 * _this._rotateSpeed();
                if (_this._plusRotate) {
                    _this._memoryVerseKineticImage.rotateDeg(angleDiff);
                    _this._rotatedAngle = _this._rotatedAngle + angleDiff;
                }
                else {
                    _this._memoryVerseKineticImage.rotateDeg(-angleDiff);
                    _this._rotatedAngle = _this._rotatedAngle - angleDiff;
                }
                if (Math.abs(_this._rotatedAngle) >= 45) {
                    _this._plusRotate = !_this._plusRotate;
                }
            }, this._layer1);
        };
        verseDisplayAnimation.prototype.None = function () {
            this._bounceAnimList.forEach(function (anim) {
                anim.stop();
            });
            this._bounceAnimList = [];
            this._crazyAnimList.forEach(function (anim) {
                anim.stop();
            });
            this._crazyAnimList = [];
            this._layer1.removeChildren();
            this._shapeList = [];
            this._bounceList = [];
            this._layer1.add(this._memoryVerseKineticImage);
            this.StopAnimations();
        };
        verseDisplayAnimation.prototype.Spin = function () {
            this._memoryVerseKineticImage.rotateDeg(-this._rotatedAngle);
            this._memoryVerseKineticImage.setOffset(400, 200);
            this._memoryVerseKineticImage.setPosition(400, 200);
            this._rotatedAngle = 0;
            this.StopAnimations();
            this._animSpin.start();
        };
        verseDisplayAnimation.prototype.Wobble = function () {
            this._memoryVerseKineticImage.rotateDeg(-this._rotatedAngle);
            this._memoryVerseKineticImage.setOffset(0, 0);
            this._memoryVerseKineticImage.setPosition(0, 0);
            this._rotatedAngle = 0;
            this.StopAnimations();
            this._animWobble.start();
        };
        verseDisplayAnimation.prototype.Shrink = function () {
            this._memoryVerseKineticImage.setOffset(0, 0);
            this._memoryVerseKineticImage.setPosition(0, 0);
            this.StopAnimations();
            this._animShrink.start();
            this._layer1.draw();
        };
        verseDisplayAnimation.prototype.Cover = function () {
            for (var i = 0; i < 10; i++) {
                var circle = new Kinetic.Circle({
                    x: Math.random() * this._stage.getWidth(),
                    y: Math.random() * this._stage.getHeight(),
                    radius: 70,
                    fill: this.PickColor(),
                    stroke: 'black',
                    strokeWidth: 4,
                    opacity: 0.9,
                    draggable: true
                });
                this._layer1.add(circle);
            }
            this._layer1.draw();
        };
        verseDisplayAnimation.prototype.PickColor = function () {
            var colorArray = ['red', 'orange', 'yellow', 'blue', 'white'];
            var index = Math.floor(Math.random() * 4);
            return colorArray[index];
        };
        verseDisplayAnimation.prototype.Bounce = function () {
            var _this = this;
            for (var i = 0; i < 15; i++) {
                var circle = new Kinetic.Circle({
                    x: this._stage.getWidth(),
                    y: this._stage.getHeight(),
                    radius: i * 7,
                    fill: this.PickColor(),
                    stroke: 'black',
                    strokeWidth: 4,
                    opacity: 0.8
                });
                this._bounceList.push(circle);
                this._layer1.add(circle);
            }
            ;
            // Add animations
            var amplitudeX = this._stage.getWidth() / 2;
            var amplitudeY = this._stage.getHeight() / 2;
            var counterX = 0;
            var counterY = 0;
            this._bounceList.forEach(function (circle) {
                var anim = new Kinetic.Animation(function (frame) {
                    counterX = counterX + 50;
                    counterY = counterY + 20;
                    circle.setX(amplitudeX * Math.sin((frame.time + (150 * circle.getRadius())) * Math.PI / 10000) + 400);
                    circle.setY(amplitudeY * Math.cos((frame.time + (140 * circle.getRadius())) * Math.PI / (3000 + circle.getRadius())) + 200);
                }, _this._layer1);
                _this._bounceAnimList.push(anim);
            });
            this._bounceAnimList.forEach(function (anim) {
                anim.start();
            });
        };
        verseDisplayAnimation.prototype.Crazy = function () {
            var _this = this;
            for (var i = 0; i < 25; i++) {
                var shape;
                switch (i % 3) {
                    case 0:
                        shape = new Kinetic.Circle({
                            x: this._stage.getWidth(),
                            y: this._stage.getHeight(),
                            radius: i * 7,
                            fill: this.PickColor(),
                            stroke: 'black',
                            strokeWidth: 4,
                            opacity: i / 25
                        });
                        break;
                    case 1:
                        shape = new Kinetic.Rect({
                            x: this._stage.getWidth(),
                            y: this._stage.getHeight(),
                            width: i * 7,
                            height: i * 5,
                            fill: this.PickColor(),
                            stroke: 'black',
                            strokeWidth: 4,
                            opacity: i / 26
                        });
                        break;
                    case 2:
                        shape = new Kinetic.Ellipse({
                            x: this._stage.getWidth(),
                            y: this._stage.getHeight(),
                            radius: i * 7,
                            fill: this.PickColor(),
                            stroke: 'black',
                            strokeWidth: 4,
                            opacity: i / 25
                        });
                        break;
                    default:
                        break;
                }
                this._shapeList.push(shape);
                this._layer1.add(shape);
            }
            ;
            // Add animations
            var amplitudeX = this._stage.getWidth() / 2;
            var amplitudeY = this._stage.getHeight() / 2;
            var counterX = 0;
            var counterY = 0;
            var counter = 7;
            this._shapeList.forEach(function (shape) {
                var anim = new Kinetic.Animation(function (frame) {
                    counterX = counterX + 50;
                    counterY = counterY + 20;
                    counter = counter + 1;
                    shape.setX(amplitudeX * Math.sin((frame.time + (150)) * Math.PI / 1000 * shape.getAbsoluteOpacity()) + 400);
                    shape.setY(amplitudeY * Math.cos((frame.time + (140)) * Math.PI / (3000 * shape.getAbsoluteOpacity())) + 200);
                }, _this._layer1);
                _this._crazyAnimList.push(anim);
            });
            this._crazyAnimList.forEach(function (anim) {
                anim.start();
            });
        };
        verseDisplayAnimation.prototype.StopAnimations = function () {
            this._animShrink.stop();
            this._animSpin.stop();
            this._animWobble.stop();
            this._memoryVerseKineticImage.rotateDeg(-this._rotatedAngle);
            this._memoryVerseKineticImage.setOffset(400, 200);
            this._memoryVerseKineticImage.setPosition(400, 200);
            this._rotatedAngle = 0;
            this._memoryVerseKineticImage.setHeight(this._maxHeight);
            this._memoryVerseKineticImage.setWidth(this._maxWidth);
            this._layer1.draw();
        };
        return verseDisplayAnimation;
    })();
    verseDisplay.verseDisplayAnimation = verseDisplayAnimation;
})(verseDisplay || (verseDisplay = {}));
//# sourceMappingURL=verseDisplay.js.map