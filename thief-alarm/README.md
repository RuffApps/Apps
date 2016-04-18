# thief alarm

##介绍

当你不

##硬件要求

1.[LCD Display Module(Model:lcd1602-pcf8574-hd44780)](https://rap.ruff.io/raps/58)

2.[Temperature Humidity Sensor(Model:DHT11)](https://rap.ruff.io/devices/DHT11)

3.[Relay Module(Model:RELAY-1C)](https://rap.ruff.io/devices/RELAY-1C)*2

3.Ruff开发板

4.杜邦线等

##软件需求

1.[Ruff SDK](https://ruff.io/zh-cn/docs/download.html)

2.[Ruff 固件](https://ruff.io/zh-cn/docs/download.html)

3.[软件包仓库](https://rap.ruff.io/)

##让我们开始吧

###第一步：下载安装 Ruff 开发包

+你可以到[这里](https://ruff.io/zh-cn/docs/download.html)下载 Ruff 的开发包。

+解压缩安装包，假定路径为 your-ruff-directory

+添加环境变量，设置 RUFF_HOME 和 PATH 。

如果你使用的是Windows 系统(推荐Win10），可以这样做

    +使用小娜搜索“编辑系统环境变量"，回车

    +点击“环境变量”

    +新建RUFF_HOME环境变量，地址为你解压的ruff sdk的文件夹

    +新建PATH环境变量，地址为解压的ruff sdk的文件夹下的bin文件夹

如果你使用的是 Linux 或 Mac 系统，可以这样做：

    export RUFF_HOME=your-ruff-directory

    export PATH="$PATH:$RUFF_HOME/bin"

在命令行里，键入如下命令

    rap version

如果你能看到 rap 的版本信息，恭喜你，设置成功了！

Ruff 开发包主要提供了如下命令：

+ruff，Ruff 运行时环境，可以执行 JavaScript 程序。

+rap，一个生产力提升工具，提供了从包管理到应用部署等方面的支持。

###第二步：创建项目

在你希望创建项目的目录下，使用 rap 创建项目

    rap init app

根据提示，填写相应内容，一切顺利的话，一个新的目录就创建出来了，我们的项目就在其中，rap 还会为我们下载
开发板的配置信息，并生成缺省的硬件配置信息。
进入到新建的目录中，我们的 Ruff 之旅将正式开始。

###第三步：连接硬件

+将 Ruff 开发板接上电源

+硬件启动需要一段时间，大约30秒左右，请耐心等待。如果你是第一次使用，则会看到红灯闪烁，它表示等待网络配置中。

+配置网络连接，这里采用的是无线网络配置的方式

    rap wifi
填写好 WiFi 的 SSID 和密码，一切顺利的话，我们会看到蓝灯常亮，这表明 Ruff 开发板已经接入到我们的无线网络里。
更多细节，请参考[网络配置](https://ruff.io/zh-cn/docs/network-configuration.html)。

需要注意的是，开发板目前仅支持2.4GHz 的 WiFi 频段，所以请使用2.4GHz 连接。

+扫描开发板地址，运行下面的命令

    rap scan

你会看到开发板的地址显示在命令行里，假定为 your_hareware_ip 。

    Scanning (this will take 10 seconds)...
    *[unnamed] - your-hareware-ip

如果有多个设备，选择一个其中一个， rap 会记住这个地址，便于后续操作。根据 rap 的提示，你可以给开发板设置一个 ID ，
做后续的标识。使用下面这个命令，就可以设置开发板的 ID 了。

    rap rename your-hardware-id

###第四步：添加外设

添加LCD ，运行如下命令：

    rap add device LCD

这里的 LCD 就是我们在应用中用以操作设备的 ID，该命令会提示我们输入设备型号。根据标签上的信息，
LED模块的型号是 lcd1602-pcf8574-hd44780。然后，rap 会根据外设型号，去寻找相应的驱动。

    ? model: (lcd) lcd1602-pcf8574-hd44780
    ? model: lcd1602-pcf8574-hd44780
    Searching supported drivers from Rap registry...
    ? select a driver for device "lcd"(lcd1602-pcf8574-hd44780): lcd1602-pcf8574-hd44780@0.1.1
    Installing driver...
    Downloading package "lcd1602-pcf8574-hd44780"...
    Extracting package "lcd1602-pcf8574-hd44780" (0.1.1)...
    Downloading package "hd44780"...
    Extracting package "hd44780" (0.1.2)...
    Downloading package "pcf8574"...
    Extracting package "pcf8574" (1.0.2)...
    - lcd1602-pcf8574-hd44780@0.1.1
    - hd44780@0.1.2
    - pcf8574@1.0.2
    Adding device "lcd" to application configuration...
    Done.

我们需要选择自己用到的驱动，如果有多个可以选项，请用上下箭头键进行选择，回车后，确认选择。之后，rap 会帮我们安装对应的驱动。

这里，我们选择了 lcd1602-pcf8574-hd44780@0.1.1，可以到[软件包仓库](https://rap.ruff.io/)搜索 lcd1602-pcf8574-hd44780@0.1.1，
查看这个驱动如何在程序中使用。

如上，继续添加Temperature Humidity Sensor，这里我们使用dht作为它的ID

    rap device add dht

添加控制空调的继电器
    rap device add temprature-relay
添加控制加湿器的继电器
    rap device add humidity-relay

###第五步：硬件布局

有了外设的相关信息，我们要完成硬件布局以及连接的工作。

+硬件布局，运行如下命令：

    rap layout

rap 会给我们自动计算出硬件的布局，也就是连接方式。

我们也可以使用图形化的版本，运行如下命令：

    rap layout --visual

请根据给出的布局方式进行硬件连接。

*注意：请在断掉电源的情况下完成硬件连接，之后，再重新插上电源。*

###第六步：编写代码

+按照 src 目录下的 index.js编写代码

###第七步：日志与部署

为了更好地了解应用的运行状态，我们可以查看日志。

+打开另外一个窗口，进入应用所在的目录，启动日志，运行如下命令：

    rap log

 接下来，就要部署应用了。如前所示，我们可以用 deploy 和 start 命令将应用运行在开发板上。我们也可以使用一个简化的命令，一次完成这个操作。
+部署并启动应用，运行如下命令：

    rap deploy -s

从应用部署到开发板到稳定运行可能还需要有一段时间。稍等一下，就可以尝试击打震动传感器，看看RGB LED 是否点亮。如果出现任何问题，可以查看日志定位问题。

怎么样，有趣吗？想了解更多 Ruff 开发的细节，请到[这里](https://ruff.io/zh-cn/docs/development-steps.html)。
















