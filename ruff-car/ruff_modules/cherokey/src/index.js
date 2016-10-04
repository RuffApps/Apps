'use strict';

var driver = require('ruff-driver');
var direction = true;


module.exports = driver({
    attach: function (inputs) {
        //do init steps here
        //GPIO口控制小车左右轮子的方向
        this.m1_gpio = inputs['gpio-m1'];
        this.m2_gpio = inputs['gpio-m2'];
        //pwm口控制小车左右轮子的速度
        this.m1_pwm = inputs['pwm-m1'];
        this.m2_pwm = inputs['pwm-m2'];

        this.left_speed = 0;
        this.right_speed = 0;
    },
    exports: {
        // cherokey小车的文档中
        // m1_gpio低电平,m2_gpio高电平，小车向前行
        forward: function () {
            try {
                this.m1_gpio.write(0);
                this.m2_gpio.write(1);

                this.m1_pwm.setDuty(this.left_speed);
                this.m2_pwm.setDuty(this.right_speed);
            } catch (error) {
                console.log(error);
            }
        },
        backward: function () {
            try {
                this.m1_gpio.write(1);
                this.m2_gpio.write(0);

                this.m1_pwm.setDuty(this.left_speed);
                this.m2_pwm.setDuty(this.right_speed);
            } catch (error) {
                console.log(error);
            }

        },

        turnLeft: function () {
            try {
                this.m1_pwm.setDuty(10);
                this.m2_pwm.setDuty(this.right_speed);
            } catch (error) {
                console.log(error);
            }

        },
        turnRight: function () {
            try {
                this.m1_gpio.write(0);
                this.m2_gpio.write(0);

                this.m1_pwm.setDuty(this.left_speed);
                this.m2_pwm.setDuty(this.right_speed);
            } catch (error) {
                console.log(error);
            }
        },
        stop: function () {
            try {
                this.m1_gpio.write(1);
                this.m2_gpio.write(1);
            } catch (error) {
                console.log(error);
            }
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
        setSpeed: function (l, r) {
            if (null == r) {
                r = l;
            }
            if (checkSpeed(l, r)) {
                this.left_speed = l / 100;
                this.right_speed = r / 100;
                try {
                    this.m1_pwm.setDuty(this.left_speed);
                    this.m2_pwm.setDuty(this.right_speed);
                } catch (error) {
                    console.log(error);
                }

            }
        },
        init: function () {
            try {
                this.m1_gpio.write(1);
                this.m2_gpio.write(1);
            } catch (error) {
                console.log(error);
            }

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
