---
layout: post
title: 机器学习实战
category: blog
description: python环境配置
---


今天主要开始看机器学习实战。

因为这本书是2013年出的，使用的语言还是python2.7。和现在的版本有一些不同。所以在这方面有一些问题，不过好在都能查到解决。  
以往虽然学了一点python，但是没有正式的使用过。今天第一次使用，还是出现了很多问题。很多时间都花在环境的配置上。不过收获还是很多。  
配置python开发环境时，用的vs code写python，提示要装pylint，但安装不上，因为pip版本太低。然后转去升级pip，结果pip也升级不上，原来是安装时没有配置环境变量。弄了好一会儿，弄好pip。然后又遇到点小问题，才把pylint装上。然后配置了一下，vs code中git的路径。重新打开后，发现numpy居然不知道怎么没了，只好再重新装上。后面要绘图又装了matplotlib。kNN算法这一章实现了大半，因为之前看过相关公开课，算法理解没什么问题。实践和理论确实有挺大的鸿沟。  

一些新知：
1. Python 中的IDLE(shell)，是进行交互式开发的。（交互式shell）
即写一行代码，就可以立刻被运行（方便查看结果）。
2. 统计学的重要性。解释数据，处理数据，抽取有价值的数据。
3. 机器学习应用开发步骤。搜集数据，准备输入数据及分析输入数据，训练算法，测试算法，使用算法。
4. python被称作可执行伪代码。其在机器学习中运行的性能问题，通过调用C语言来解决效率问题。（使用一些工具和库来转换）
5. NumPy矩阵中matrix和数组array相似但有所不同。mat()函数将数组转化为矩阵。.I 操作符实现矩阵求逆。eye() 创建单位矩阵。
