---
layout: post
title: Unity Sprite的小Bug
category: blog
description: 解决和学习
---

今天在做卡牌的显示的时候，因为使用的Sprite，出现了一个问题。  
大体来说，Sprite的Material因为Shader的缘故，摄像机在一定角度下，和其他物体的渲染的层次可能会进行穿透，导致错误的显示效果。

本来想编写一个新的Shader来解决这个问题，emmm，结果最后还是通过直接更换另一个Shader来解决了...

**Unity对于Sprite的渲染顺序很奇怪，是相机当前位置，到Sprite中心点的直线距离。距离越近，就越后渲染。**

#### 关于sprite
sprite默认是个3D空间的物体，就算把它放到一个屏幕空间的canvas上，它仍然是3D空间的物体，只遵循3D空间的规则：总是会被UI挡住。

* 同时具有sorting layer, order in layer的对象：sprite, 世界空间的canvas
* 仅具有sort order的对象：屏幕空间的canvas
* 只具有sorting layer的对象：不存在
* 只具有order in layer 的对象：不存在

来自 <https://blog.csdn.net/leansmall/article/details/66478412> 


#### Unity：物体的渲染顺序

决定Unity渲染关系的层级顺序是：
>1. Camera 
>2. sorting layer
>3. sorting order


1. Camera Depth  
相机组件上设置的相机深度，深度越大越靠后渲染。
2. Sorting Layer  
在Tags & Layers设置中可见
3. Order In Layer  
相对于Sorting Layer的子排序，用这个值做比较时只有都在同一层时才有效。
4. RenderQueue  
Shader中对Tags设置的“Queue”。


#### 当Sorting Layer和Order In Layer不相同时

1. 当两个材质使用了不同的RenderQueue，且这两个RenderQueue都在[0~2500]或[2501~5000]时，SortingOrder的排序生效。
2. 当两个材质使用了不同的RenderQueue，且这两个RenderQueue分别在[0~2500]和[2501~5000]时，则一定会按照RenderQueue绘制，无视SortingOrder的排序。  
推测是因为2500为Unity作为Opacity和Transparent的分界线，因此如果两个材质的Queue分别在分界线的两边，也就是一个不透明一个透明，则Unity一定会先把不透明的物体送进渲染管线，无论SortingOrder到底怎么排序。

两个Camera进行渲染时，Depth值越大，那么渲染的物体就会在更上面。

同一个camera下，如果两个物体的shader的深度写入(ZWrite On)和深度比较(ZTest)都是开启的，那么距离camera更近的将会渲染在更上面。

#### 关于RenderQueue：
同一个camera下，RenderQueue决定了渲染物体的顺序，RenderQueue值小的先渲染，RenderQueue大的后渲染。

来自 <https://blog.csdn.net/qweewqpkn/article/details/79656263> 

#### 关于渲染流程：

对任何物体的渲染，我们需要先准备好相关数据（顶点、UV、贴图数据和shader参数等等），然后调用GPU的渲染接口进行绘制，这个过程称作Draw Call。GPU接收到DrawCall指令后，通过一系列流程生成最终要显示的内容并进行渲染，其中大致的步骤包括：

	1. CPU发送Draw Call指令给GPU；
	2. GPU读取必要的数据到自己的显存；
	3. GPU通过顶点着色器（vertex shader）等步骤将输入的几何体信息转化为像素点数据；
	4. 每个像素都通过片段着色器（fragment shader）处理后写入帧缓存；
	5. 当全部计算完成后，GPU将帧缓存内容显示在屏幕上。

在2D游戏开发中，游戏场景中的元素，应该尽量使用它去渲染。而Image应该仅用于UI显示（实际上即使不考虑性能原因，由于屏幕分辨率的变化，Image可能会被Canvas改变显示位置和实际大小，如果用于游戏内元素的显示，可能会造成跟预期设计不一致的显示结果，也应该避免使用）。

来自 <https://blog.csdn.net/zhaoguanghui2012/article/details/54089355> 