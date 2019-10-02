---
layout: post
title: Sprite的不规则点击
category: blog
description: 一些实现方法
---

这篇文章内容主要是实现Unity中，3D空间内的Sprite不规则点击。

所有的Sprite，都是默认在一个方形的Rect中的。假如一个Sprite具有透明度，也就是说这个Sprite是不规则形状的，通常情况下，即使点击的是这个Rect中的空白区域，那么也会进行响应。
显然，在一些情况下，这种体验并不是很好。

网上有一些文章提供了解决思路，但之所以写这篇文章，是因为并没有在网上找到比下面要说明的更简单有效的方案。

---

首先Sprite的不规则点击分为了两种情况，一个是在2D空间中的Sprite，另一个是在3D空间中的Sprite。

### 2D空间中的不规则Sprite

实现2D空间中的不规则Sprite的点击比较简单。只需要添加一个自带的PolygonCollider2D脚本就可以了。这个Collider会同时自动判别生成包围这个Sprite的Mesh。
然后再添加EventTrigger控件，利用EventSystem就可以实现了。

通过这个方法，实际也可以替代UI中的不规则点击。


### 3D空间中的不规则Sprite

要触发事件，
就需要使用EventSystem，或者利用射线检测，并且3D空间中的物体必须要带有Collider。
Unity中基本上所有的3D Collider都具有固定的形状，也并没有能够自动生成3D物体形状Mesh的Collider控件。但是却有能够根据物体Mesh生成特定形状的MeshCollider。

所以解决思路是生成和Sprite形状一样的Mesh，再利用这个Mesh，加载MeshCollider，这样就能够实现不规则点击了。

有两种Mesh生成手段：

第一个是使用代码生成，

```private Mesh SpriteToMesh(Sprite sprite)
{
    Mesh mesh = new Mesh();
    mesh.SetVertices(Array.ConvertAll(sprite.vertices, i => (Vector3)i).ToList());
    mesh.SetUVs(0,sprite.uv.ToList());
    mesh.SetTriangles(Array.ConvertAll(sprite.triangles, i => (int)i),0);

    return mesh;
}
```

首先给物体挂载上MeshCollider，然后调用这个方法，输入Sprite，返回对应形状的mesh，并赋值给MeshCollider中的Mesh。

这个方法虽然简单，但缺点是生成的Mesh会与实际的Sprite形状具有误差，并且难以调整。用于对点击精确度要求不高的场景中是可行的。


第二个是使用Sprite Editor进行定义，

对于这个Sprite，除了必要的SpriteRenderer外，和上面一样再添加MeshCollider控件。
对于这个显示的Sprite，在Sprite Editor中，进行Custom Outline的定义，方法可见官方文档<https://docs.unity3d.com/Manual/SpriteOutlineEditor.html>。

在Custom Outline中定义好满足精度要求的边界，然后再使用第一个的方法步骤，
`g.GetComponent<MeshCollider>().sharedMesh = SpriteToMesh(g.GetComponent<SpriteRenderer>().sprite);
`
将定义好的sprite的Mesh赋值给MeshCollider的Mesh。就能过生成准确形状和大小的MeshCollider了。

