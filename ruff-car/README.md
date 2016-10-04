# Ruff Car

##介绍

在我很小很小的时候,看到其他家孩子有遥控汽车玩,我就十分羡慕。现在我走上了创客的旅途，当我跑通了“Blinking LED”的项目后，做一辆自己的玩具车的想法就一直占据我的脑海。

因此，当我在拿到 Ruff 1.0 开发套件后，我就打算用 Ruff 试一试开发玩具车的项目。

玩具车上有两个gpio口,分别控制两边轮子的转动方向。还有两个pwm口,控制两边轮子的转动速度。

为了达到车子转向的功能，有两种方法。

1.在车的转向的过程中，比如实现右转的话，就需要让右边的轮子向后走,左边的轮子向前走。反之则可实现左转，这样玩具车就可以实现转向了。

2.让左边的速度大于右边的速度,这样也可以让玩具车右转 。

我们在玩具车上搭建一个http服务器,我们通过App发送指令,玩具车上的 服务器收到指令之后操作玩具车。

##硬件要求

1.[Cherokey 4WD Mobile Car(Model cherokey)](https://rap.ruff.io/raps/cherokey)

2.5节5号电池（用于小车的供电），移动电源（用于ruff开发板的供电）

3.Ruff开发板

4.杜邦线等

##软件需求

1.[Ruff SDK](https://ruff.io/zh-cn/docs/download.html)

2.[Ruff 固件](https://ruff.io/zh-cn/docs/download.html)

3.[软件包仓库](https://rap.ruff.io/)

## 参考

Ruff应用开发请参见官网的[Getting started](https://ruff.io/zh-cn/docs/getting-started.html)

## 注意事项

这个应用还需要安装官网的home组件

    rap install home