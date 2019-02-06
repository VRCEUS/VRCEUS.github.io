---
layout: post
title: Anaconda and ShadowsocksR
category: blog
description: 安装与部署
---

### Anaconda

这两天在安装Anaconda时，遇到了一些坑，没有解决。大概率应该还是其版本的问题。  
其实安装倒是挺顺利的，就是后面需要进行创建新的虚拟环境和升级包时，出现了无法连接的问题。
一开始提示是:
`CondaHTTPError: HTTP 000 CONNECTION FAILED for url `  
查了说问题是默认的国外镜像连接不上，需要更换成国内的。跟着网上的教程更换成国内清华的镜像url后，发现问题同样存在。自然想着是不是清华的镜像也出了问题，于是又花了很多的时间，找到了包括中科大的许多镜像，依次更换，一个个试下来问题照旧。  
突然想着，会不会不是镜像url出的问题？  
于是单独把那些url通过网页打开，结果发现是都能打开的。何其郁闷，一开始方向就出错了。  
那么问题究竟是出在哪里呢？  
我又仔细查看了报错信息，发现在`CondaHTTPError`的跟着的一长串错误信息后面，有一行写着`SSLError`，最后说`ssl module in Python is not available`。那好，终于找到了问题所在，ssl模块不可用，不过接下来问题是，先是在百度上搜索这个问题，发现并没有找到Anaconda安装出现SSLError的问题，只有关于python如pip之类安装出现ssl module in Python is not available。
显然这个问题是比较新的又或者比较少见的。那么再去问谷歌，终于找到了一点线索，然也也仅仅是线索，在.condarc文件添加了ssl_verify: true，发现这个问题还是存在。不过作者提供了另外一种解决办法，在Anaconda Navigator通过界面去添加对应的虚拟环境。
最终在GitHub上找到了一个最简单有效的方法:使用自带的**Anaconda Prompt**，接近完美终结此问题。
* 优先谷歌
* 报错信息务必仔细查看

---

### ShadowsocksR

说起谷歌，之前一直用的免费的梯子，速度太慢，于是想着要不买一个好用点的。网上找了好几个对比看了价格，都还行，GitHub上也看到了shadowsocks的仓库，又查了下，刚好找到自建ssr的教程，发现操作并不复杂，vps的价格也挺合适。那么，就决定自己搭吧。  
Vultr注册，充值，购买，部署。Xshell安装，SSR设置，搭建。下载安装ssr软件，配置好信息。飞跃长城，结果发现，速度好慢。。。  
只好换个节点的服务器重新部署试试。安装SSR时，提示`wget: unable to resolve host address`。查阅后说是DNS的问题，需要添加更换DNS，只好去找Linux的教程，`vi /etc/resolv.conf` 跟着换了DNS，问题解决。
接下来网速稍有提升，不过测试了下最后发现网速和自己运营商网络的关系也很大，那勉强用着就好吧。  
安卓SSR的配置也很简单，不过一开始配置信息的时候，密码输错连接不上，还以为是软件的问题，于是弄了挺久。手机用的是另一个运营商的卡，速度还不错。
