///<reference path="../typings/jquery/jquery.d.ts"/>
///<reference path="../typings/kineticjs/kinetic.d.ts"/>
///<reference path="../typings/bootstrap/bootstrap.d.ts"/>

module verseDisplay {
    export class verseDisplayAnimation {
        public BaseUrl: string;
        public ImageUrl: string;
        private _stage: Kinetic.Stage = null;
        private _memoryVerseKineticImage: Kinetic.Image = null;
        private _layer1: Kinetic.Layer = null;
        private _animSpin: Kinetic.Animation;
        private _animWobble: Kinetic.Animation;
        private _animShrink: Kinetic.Animation;
        private _bounceAnimList = new Array<Kinetic.Animation>();
        private _crazyAnimList = new Array<Kinetic.Animation>();
        private _bounceList = new Array<Kinetic.Circle>();        
        private _shapeList = new Array<Kinetic.Shape>();        
        private _rotatedAngle: number = 0; 
        private _plusRotate: boolean = true;
        private _scale: number = 1;
        private _shrinking: boolean = true;
        // for rotation
        private _rotateSpeed(): number {
            var rangeElement = <HTMLInputElement> document.getElementById('rangeSpeed');
            var rangeSpeed: number = +rangeElement.value;
            return rangeSpeed;
        }
        constructor(baseUrl: string, imageUrl: string) {
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
        private SetSizes() {
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
        private InitializeStage() {
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
                } else {
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
                } else {
                    this._memoryVerseKineticImage.rotateDeg(-angleDiff);
                    this._rotatedAngle = this._rotatedAngle - angleDiff;
                }
                if (Math.abs(this._rotatedAngle) >= 45) {
                    this._plusRotate = !this._plusRotate;
                }
            }, this._layer1);
        }
        private HookControls() {
            $("#AnimationButtonGroup").on('click touchend', '#ButtonNone', (e: JQueryEventObject) => {
                this.None();
            });
            $("#AnimationButtonGroup").on('click touchend', '#ButtonSpin', (e: JQueryEventObject) => {
                this.Spin();
            });
            $('#AnimationButtonGroup').on('click touchend', '#ButtonWobble', (e: JQueryEventObject) => {
                this.Wobble();
            });
            $('#AnimationButtonGroup').on('click touchend', '#ButtonCover', (e: JQueryEventObject) => {
                this.Cover();
            });
            $('#AnimationButtonGroup').on('click touchend', '#ButtonBounce', (e: JQueryEventObject) => {
                this.Bounce();
            });
            $('#AnimationButtonGroup').on('click touchend', '#ButtonCrazy', (e: JQueryEventObject) => {
                this.Crazy();
            });
            $('#AnimationButtonGroup').on('click touchend', '#ButtonShrink', (e: JQueryEventObject) => {
                this.Shrink();
            });
            $('#HideMenu').on('click touchend', (e: JQueryEventObject) => {
                $('#HideMenu').hide();
                $('#ShowMenu').show();
                $('#AnimationButtonGroup').slideUp();
            });
            $('#ShowMenu').on('click touchend', (e: JQueryEventObject) => {
                $('#ShowMenu').hide();
                $('#HideMenu').show();
                $('#AnimationButtonGroup').slideDown();
            });
        }
        public None() {
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
        public Spin() {
            this._memoryVerseKineticImage.rotateDeg(-this._rotatedAngle);
            this._memoryVerseKineticImage.setOffset(400, 200);
            this._memoryVerseKineticImage.setPosition(400, 200);
            this._rotatedAngle = 0;

            this.StopAnimations();
            this._animSpin.start();
        }
        public Wobble() {
            this._memoryVerseKineticImage.rotateDeg(-this._rotatedAngle);
            this._memoryVerseKineticImage.setOffset(0, 0);
            this._memoryVerseKineticImage.setPosition(0, 0);
            this._rotatedAngle = 0;

            this.StopAnimations();
            this._animWobble.start();
        }
        public Shrink() {
            this._memoryVerseKineticImage.setOffset(0, 0);
            this._memoryVerseKineticImage.setPosition(0, 0);            

            this.StopAnimations();
            this._animShrink.start();
            this._layer1.draw();
        }
        public Cover() {
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
        private PickColor() {
            var colorArray = ['red', 'orange', 'yellow', 'blue', 'white'];
            var index: number = Math.floor(Math.random() * 4);
            return colorArray[index];
        }
        public Bounce() {
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
            };

            // Add animations
            var amplitudeX: number = this._stage.getWidth();
            var amplitudeY: number = this._stage.getHeight();
            var counterX: number = 0;
            var counterY: number = 0;
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
        public Crazy() {
            for (var i = 0; i < 25; i++) {
                var shape;
                switch (i % 3)
                {
                    case 0:
                        shape = new Kinetic.Circle({
                            x: this._stage.getWidth(),
                            y: this._stage.getHeight(),
                            radius: i * 7,
                            fill: this.PickColor(),
                            stroke: 'black',
                            strokeWidth: 4,
                            opacity: i/25
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
            };

            // Add animations
            var amplitudeX: number = this._stage.getWidth() / 2;
            var amplitudeY: number = this._stage.getHeight() / 2;
            var counterX: number = 0;
            var counterY: number = 0;
            var counter: number = 7;
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
        private StopAnimations() {
            this._animShrink.stop();
            this._animSpin.stop();
            this._animWobble.stop();
            this._memoryVerseKineticImage.rotateDeg(-this._rotatedAngle);
            this._rotatedAngle = 0;            
            this.SetSizes();
            this._layer1.draw();
        }
    }
} 