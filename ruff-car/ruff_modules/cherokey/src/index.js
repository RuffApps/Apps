'use strict';

var driver = require('ruff-driver');
var direction = true;


module.exports = driver({
    attach: function (inputs) {
        //do init steps here
        //GPIO口控制小车左右轮子的方向
        this.m1_gpio = inputs.getRequired('gpio-m1');
        this.m2_gpio = inputs.getRequired('gpio-m2');
        //pwm口控制小车左右轮子的速度
        this.m1_pwm = inputs.getRequired('pwm-m1');
        this.m2_pwm = inputs.getRequired('pwm-m2');

        this.left_speed = 0;
        this.right_speed = 0;
    },
    exports: {
        //理应00后，11前，01左，10右
        // 实际情况00右，01前，11停，10后
        forward: function () {
            direction = true;
            this.m1_gpio.write(0);
            this.m2_gpio.write(1);


            this.m1_pwm.setDuty(this.left_speed);
            this.m2_pwm.setDuty(this.right_speed);
        },

        backward: function () {
            direction = false;
            this.m1_gpio.write(1);
            this.m2_gpio.write(0);

            this.m1_pwm.setDuty(this.left_speed);
            this.m2_pwm.setDuty(this.right_speed);
        },

        turnLeft: function () {
            // this.m1_gpio.write(0);
            // this.m2_gpio.write(1);

            this.m1_pwm.setDuty(10);
            this.m2_pwm.setDuty(this.right_speed);
        },

        turnRight: function () {
            this.m1_gpio.write(0);
            this.m2_gpio.write(0);

            this.m1_pwm.setDuty(this.left_speed);
            this.m2_pwm.setDuty(this.right_speed);
        },

        stop: function () {
            this.m1_gpio.write(1);
            this.m2_gpio.write(1);

            this.m1_pwm.setDuty(0);
            this.m2_pwm.setDuty(0);
        },

        accelerate: function (val) {
            var value = this.left_speed + val / 100;
            if (value <= 1) {
                this.left_speed = value;
                this.right_speed = value;
            }
        },

        getSpeed: function () {
            return {
                'left_speed': this.left_speed * 100,
                'right_speed': this.right_speed * 100
            };
        },

        recoverDirection: function () {
            if (direction) {
                this.m1_gpio.write(0);
                this.m2_gpio.write(1);
            } else {
                this.m1_gpio.write(1);
                this.m2_gpio.write(0);
            }

        },

        setSpeed: function (l, r) {
            if (checkSpeed(l, r)) {
                this.left_speed = l / 100;
                this.right_speed = r / 100;
                this.m1_pwm.setDuty(this.left_speed);
                this.m2_pwm.setDuty(this.right_speed);
            }
        },
        setStill: function () {
            this.m1_gpio.write(1);
            this.m2_gpio.write(1);
        }
    },



    detach: function () {
        //do clean work here
        this.left_speed = 0;
        this.right_speed = 0;
    }
});

function checkSpeed(l, r) {
    if (l >= 0 && l <= 100
        && r >= 0 && r <= 100) {
        return true;
    } else {
        console.log('speed must be non-negetive number and under 100');
        return false;
    }
}
