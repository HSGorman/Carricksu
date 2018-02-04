///<reference path="../typings/jquery/jquery.d.ts"/>
///<reference path="../typings/kineticjs/kinetic.d.ts"/>
///<reference path="../typings/bootstrap/bootstrap.d.ts"/>
var verseDisplay;
(function (verseDisplay) {
    class verseDisplayAnimation {
        constructor(baseUrl, imageUrl) {
            this._stage = null;
            this._memoryVerseKineticImage = null;
            this._layer1 = null;
            this._bounceAnimList = new Array();
            this._crazyAnimList = new Array();
            this._bounceList = new Array();
            this._shapeList = new Array();
            this._rotatedAngle = 0;
            this._plusRotate = true;
            this._scale = 1;
            this._shrinking = true;
            this.BaseUrl = baseUrl;
            this.ImageUrl = imageUrl.replace("~", baseUrl);
            window.onload = () => {
                this.InitializeStage();
                this.SetSizes();
                this._stage.draw();
                this._layer1.draw();
                this.HookControls();
            };
            window.onresize = () => {
                this.SetSizes();
            };
        }
        // for rotation
        _rotateSpeed() {
            var rangeElement = document.getElementById('rangeSpeed');
            var rangeSpeed = +rangeElement.value;
            return rangeSpeed;
        }
        SetSizes() {
            let navbar = document.getElementById('navigationbar');
            let menuSlider = document.getElementById('MenuSlider');
            this._stage.setWidth(menuSlider.clientWidth);
            this._stage.setHeight(window.innerHeight - (navbar.clientHeight + menuSlider.clientHeight + 150));
            this._memoryVerseKineticImage.setX(this._stage.getWidth() / 2);
            this._memoryVerseKineticImage.setY(this._stage.getHeight() / 2);
            this._memoryVerseKineticImage.setWidth(this._stage.getWidth());
            this._memoryVerseKineticImage.setHeight(this._stage.getHeight());
            this._memoryVerseKineticImage.setOffset(this._stage.getWidth() / 2, this._stage.getHeight() / 2);
        }
        InitializeStage() {
            this._stage = new Kinetic.Stage({
                container: 'container',
            });
            this._layer1 = new Kinetic.Layer();
            var memoryVerseImage = new Image();
            memoryVerseImage.src = this.ImageUrl;
            this._memoryVerseKineticImage = new Kinetic.Image({
                x: this._stage.getWidth() / 2, y: this._stage.getHeight() / 2,
                image: memoryVerseImage,
                width: this._stage.getWidth(), height: this._stage.getHeight(),
                draggable: true
            });
            this._memoryVerseKineticImage.setOffset(this._stage.getWidth() / 2, this._stage.getHeight() / 2);
            this._layer1.add(this._memoryVerseKineticImage);
            this._stage.add(this._layer1);
            this._animSpin = new Kinetic.Animation((frame) => {
                var angleDiff = 0.02 * this._rotateSpeed();
                this._memoryVerseKineticImage.rotateDeg(angleDiff);
                this._rotatedAngle = this._rotatedAngle + angleDiff;
            }, this._layer1);
            this._animShrink = new Kinetic.Animation((frame) => {
                if (this._shrinking == true) {
                    this._scale = this._scale - 0.01;
                }
                else {
                    this._scale = this._scale + 0.01;
                }
                if ((this._scale < 0) || (this._scale > 1)) {
                    this._shrinking = !this._shrinking;
                }
                this._memoryVerseKineticImage.setHeight(this._stage.getHeight() * this._scale);
                this._memoryVerseKineticImage.setWidth(this._stage.getWidth() * this._scale);
            }, this._layer1);
            this._animWobble = new Kinetic.Animation((frame) => {
                var angleDiff = 0.02 * this._rotateSpeed();
                if (this._plusRotate) {
                    this._memoryVerseKineticImage.rotateDeg(angleDiff);
                    this._rotatedAngle = this._rotatedAngle + angleDiff;
                }
                else {
                    this._memoryVerseKineticImage.rotateDeg(-angleDiff);
                    this._rotatedAngle = this._rotatedAngle - angleDiff;
                }
                if (Math.abs(this._rotatedAngle) >= 45) {
                    this._plusRotate = !this._plusRotate;
                }
            }, this._layer1);
        }
        HookControls() {
            $("#AnimationButtonGroup").on('click touchend', '#ButtonNone', (e) => {
                this.None();
            });
            $("#AnimationButtonGroup").on('click touchend', '#ButtonSpin', (e) => {
                this.Spin();
            });
            $('#AnimationButtonGroup').on('click touchend', '#ButtonWobble', (e) => {
                this.Wobble();
            });
            $('#AnimationButtonGroup').on('click touchend', '#ButtonCover', (e) => {
                this.Cover();
            });
            $('#AnimationButtonGroup').on('click touchend', '#ButtonBounce', (e) => {
                this.Bounce();
            });
            $('#AnimationButtonGroup').on('click touchend', '#ButtonCrazy', (e) => {
                this.Crazy();
            });
            $('#AnimationButtonGroup').on('click touchend', '#ButtonShrink', (e) => {
                this.Shrink();
            });
            $('#HideMenu').on('click touchend', (e) => {
                $('#HideMenu').hide();
                $('#ShowMenu').show();
                $('#AnimationButtonGroup').slideUp();
            });
            $('#ShowMenu').on('click touchend', (e) => {
                $('#ShowMenu').hide();
                $('#HideMenu').show();
                $('#AnimationButtonGroup').slideDown();
            });
        }
        None() {
            this._bounceAnimList.forEach((anim) => {
                anim.stop();
            });
            this._bounceAnimList = [];
            this._crazyAnimList.forEach((anim) => {
                anim.stop();
            });
            this._crazyAnimList = [];
            this._layer1.removeChildren();
            this._shapeList = [];
            this._bounceList = [];
            this._layer1.add(this._memoryVerseKineticImage);
            this.StopAnimations();
        }
        Spin() {
            this._memoryVerseKineticImage.rotateDeg(-this._rotatedAngle);
            this._memoryVerseKineticImage.setOffset(400, 200);
            this._memoryVerseKineticImage.setPosition(400, 200);
            this._rotatedAngle = 0;
            this.StopAnimations();
            this._animSpin.start();
        }
        Wobble() {
            this._memoryVerseKineticImage.rotateDeg(-this._rotatedAngle);
            this._memoryVerseKineticImage.setOffset(0, 0);
            this._memoryVerseKineticImage.setPosition(0, 0);
            this._rotatedAngle = 0;
            this.StopAnimations();
            this._animWobble.start();
        }
        Shrink() {
            this._memoryVerseKineticImage.setOffset(0, 0);
            this._memoryVerseKineticImage.setPosition(0, 0);
            this.StopAnimations();
            this._animShrink.start();
            this._layer1.draw();
        }
        Cover() {
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
        }
        PickColor() {
            var colorArray = ['red', 'orange', 'yellow', 'blue', 'white'];
            var index = Math.floor(Math.random() * 4);
            return colorArray[index];
        }
        Bounce() {
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
            var amplitudeX = this._stage.getWidth();
            var amplitudeY = this._stage.getHeight();
            var counterX = 0;
            var counterY = 0;
            this._bounceList.forEach((circle) => {
                var anim = new Kinetic.Animation(function (frame) {
                    counterX = counterX + 50;
                    counterY = counterY + 20;
                    circle.setX(amplitudeX * Math.sin((frame.time + (150 * circle.getRadius())) * Math.PI / 10000));
                    circle.setY(amplitudeY * Math.cos((frame.time + (150 * circle.getRadius())) * Math.PI / (3000 + circle.getRadius())) + 200);
                }, this._layer1);
                this._bounceAnimList.push(anim);
            });
            this._bounceAnimList.forEach((anim) => {
                anim.start();
            });
        }
        Crazy() {
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
            this._shapeList.forEach((shape) => {
                var anim = new Kinetic.Animation(function (frame) {
                    counterX = counterX + 50;
                    counterY = counterY + 20;
                    counter = counter + 1;
                    shape.setX(amplitudeX * Math.sin((frame.time + (150)) * Math.PI / 1000 * shape.getAbsoluteOpacity()) + 400);
                    shape.setY(amplitudeY * Math.cos((frame.time + (140)) * Math.PI / (3000 * shape.getAbsoluteOpacity())) + 200);
                }, this._layer1);
                this._crazyAnimList.push(anim);
            });
            this._crazyAnimList.forEach((anim) => {
                anim.start();
            });
        }
        StopAnimations() {
            this._animShrink.stop();
            this._animSpin.stop();
            this._animWobble.stop();
            this._memoryVerseKineticImage.rotateDeg(-this._rotatedAngle);
            this._rotatedAngle = 0;
            this.SetSizes();
            this._layer1.draw();
        }
    }
    verseDisplay.verseDisplayAnimation = verseDisplayAnimation;
})(verseDisplay || (verseDisplay = {}));
//# sourceMappingURL=verseDisplay.js.map