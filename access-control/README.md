# access control

## 介绍

我们总是想，当有人拜访我们时，我在沙发就能按动开关打开门让客人进来，那该多好啊。

为了造福广大懒癌重度患者，同时提供人们的生活幸福感，我们发明了这套设备。

+首先，屋子外有一个红外传感器，实时监测有没有人

+当有人时，屋内的LCD显示屏提示屋外有人

+主人决定是否让客人进来

>如果主人愿意让客人进来，则按下手中的红色按钮开关
>>开关控制的继电器打开
>>>继电器控制门打开
>>>>主人松开红色按钮开关
>>>>>继电器关闭
>>>>>>门关闭

>如果主人不愿意让客人进来，则不按开关
>>继电器保持关闭
>>>门保持关闭

## 硬件要求

1.[LCD Display Module（Model:LCD1602-02)](https://rap.ruff.io/devices/lcd1602-pcf8574a-hd44780)

2.[Relay Module(Model:RELAY-1C)](https://rap.ruff.io/devices/RELAY-1C)

3.[Push Button Module(Model:CK002)](https://rap.ruff.io/devices/CK002)

4.[Infrared Induction Module(Model:HC-SR501)](https://rap.ruff.io/devices/HC-SR501)

5.[Ruff开发板](https://shop154924108.taobao.com/)

6.杜邦线等

## 软件需求

1.[Ruff SDK](https://ruff.io/zh-cn/docs/download.html)

2.[Ruff 固件](https://ruff.io/zh-cn/docs/download.html)

## 参考

Ruff应用开发请参见官网的[Getting started](https://ruff.io/zh-cn/docs/getting-started.html)