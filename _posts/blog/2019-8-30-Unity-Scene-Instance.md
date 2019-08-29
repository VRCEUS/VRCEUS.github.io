---
layout: post
title: Unity场景切换时的物体/数据持久化管理
category: blog
description: 让物体切换以及切回场景时都保持单例
---


距离上次博客更新大概过了两个星期，这段时间一方面是将CardGO的操作细节和美术UI方面进行一些优化，另外的时间主要是投入到了NewBorn(暂定名)的制作中。

经过这一周996强度的工作，今天正式把游戏基础玩法框架的Bug的修复了，取得了阶段性的成功orz。

以上是闲话，这篇博客主要是说明一个开发过程中写的小脚本。


#### 场景的切换与数据的保存：

大部分游戏为了功能实现的方便和模块化的设计，都会设计多个场景。

在Unity中使用SceneManagement下的方法，可以实现场景的切换。  
但有一个问题是，Unity加载进入新的场景时，会销毁上一个场景的所有物体，所以对于那些需要保存数据的物体，需要在其脚本中添加DontDestroyOnLoad()方法，来保证该物体切换场景后不会被销毁。

但是使用DontDestroyOnLoad()可能会有一个问题，当重新加载会原来的场景时，会出现两个相同的物体(其中的数据可能不同)。显然，在加载回到原来的场景时，原来场景的所有物体都会被重新生成，而由于DontDestroyOnLoad()的会让物体在场景切换时不会被销毁的原因，因此就同时出现了新旧两个物体(如果再次重复加载的话，还会生成新的)。

大部分情况，使用了DontDestroyOnLoad()的物体都是因为需要保存其中的数据(我还会用于维持协程的进行)，并且很可能是单例的。重复的物体极有可能造成数据的混乱。

Unity似乎并没有提供实用的方法来解决这个问题，因此我们需要通过一些手段来防止切回场景时这些不需要的重复物体的生成，或者说，销毁它们。


#### PermanentObject：

最后写了一个脚本来实现这样的功能，同时能设定所挂载的物体是否要在切换场景时自动隐藏(SetActive(false))，并在切换回原场景时自动激活(SetActive(true))。

对于需要的物体直接挂载该脚本即可。

```
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class PermanentObject : MonoBehaviour
{

    int thisSceneIndex;
    //如果切换隐藏
    public bool isHidden = false;

    //可以在面板自定义挂载物体的uniqueID
    public string uniqueID;

    public static Dictionary<string, PermanentObject> PermanentDictionary = new Dictionary<string, PermanentObject>();

    //挂载的GameObject如果有脚本进行单例设置，需要先使用if(instance!=null)进行判断，防止被重写覆盖

    void Start()
    {

        thisSceneIndex = SceneManager.GetActiveScene().buildIndex;


        if (uniqueID == "")
        {
            //默认ID等于物体名称
            uniqueID = this.gameObject.name;

            //Debug.Log(uniqueID);

        }


        //如果已经存在该物体
        if (PermanentDictionary.ContainsKey(uniqueID))
        {
            //Debug.Log(uniqueID);

            //切回场景时激活被自动隐藏的最初对应物体
            if (isHidden)
            {
                if (thisSceneIndex == SceneManager.GetActiveScene().buildIndex && PermanentDictionary[uniqueID].gameObject.activeSelf == false)
                {
                    PermanentDictionary[uniqueID].gameObject.SetActive(true);
                }
            }

            //销毁该物体
            Destroy(gameObject);

        }
        //如果当前场景没有该物体
        else
        {
            PermanentDictionary.Add(uniqueID, this);

            //DontDestroyOnLoad在Start中加载，该物体可在Awake中判断销毁
            //持久存储挂载物体
            GameObject.DontDestroyOnLoad(gameObject);

        }

    }


    void Update()
    {

        if (isHidden)
        {
            //切换场景时隐藏该物体
            if (thisSceneIndex != SceneManager.GetActiveScene().buildIndex)
            {
                gameObject.SetActive(false);
            }
        }

    }
}

```


#### 说明

在该脚本Inspector中，有两个可定义的属性。

isHidden默认值是false，意即不隐藏。该物体在场景切换后，activeSelf属性不变。  
如果在属性面板勾选为true，则挂载的物体在切换场景时会自动隐藏(SetActive(false))，并在切换回原场景时自动激活(SetActive(true))。

uniqueID默认值是物体的名称(在代码中获得值)，一般来说由于单例的GameObject的名字都是唯一的，所以无需设置。但是如果挂载的物体在场景中有多个是名称相同的，则需要手动分别为这些相同的uniqueID指定任意的不同值。

功能主要是利用一个静态全局字典来进行判断实现。

最后需要注意的是，挂载物体上的脚本在实现单例时，需要使用if(instance!=null)进行判断，防止被新的重复脚本重写覆盖。