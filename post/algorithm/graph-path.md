---
title: 图的路径问题
date: 2019-02-17
---
# 图的路径问题
主要包含这么几个问题
1. 最短路径
2. 一笔画问题
    1. 一笔画的充要条件：奇顶点（连接的边数量为奇数的顶点）的数目等于0(任意起点)或者2(奇顶点为起点)
    2. 如果连通无向图 G 有2k 个奇顶点，那么它可以用k 笔画成，并且至少要用 k 笔画成

#　最短路径问题
## 无权图最短路径：
BFS：时间复杂度O(E*V) 顶点个数(顶点只遍历1次) 
>下面的算法不是最优的，最优解需要一个节点被遍历多次：$单节点的边数^顶点数=E^V$

    def getShortPath(graph, start, end):
        start.color = black
        if start == end:
            return [], True

        nodes = [V for V in start.getConnections() if V.color!='black']
        for node in nodes:
            path, status = getShortPath(graph, node, end)
            if status:
                return [start]+path
        return [], False

DFS：时间复杂度O(V) 用队列

## 有权图最短路径
(路径带权重)：
![](/img/algo/graph-path-eg.1.png)

# 一笔画问题
从一个起点一笔画成: 如果路线走入死胡同（not done）就需要backtrack

    from pythonds.graphs import Graph, Vertex
    def knightTour(n,path,u,limit):
        u.setColor('gray')
        path.append(u)
        if n < limit:
            nbrList = list(u.getConnections())
            i = 0
            done = False
            while i < len(nbrList) and not done:
                if nbrList[i].getColor() == 'white':
                    done = knightTour(n+1, path, nbrList[i], limit)
                i = i + 1
            if not done:  # prepare to backtrack
                path.pop()
                u.setColor('white')
        else:
            done = True
        return done

所有起点

    from pythonds.graphs import Graph
    class DFSGraph(Graph):
        def __init__(self):
            super().__init__()
            self.time = 0

        def dfs(self):
            for aVertex in self:
                aVertex.setColor('white')
                aVertex.setPred(-1)
            for aVertex in self:
                if aVertex.getColor() == 'white':
                    self.dfsvisit(aVertex)

        def dfsvisit(self,startVertex):
            startVertex.setColor('gray')
            self.time += 1
            startVertex.setDiscovery(self.time)
            for nextVertex in startVertex.getConnections():
                if nextVertex.getColor() == 'white':
                    nextVertex.setPred(startVertex)
                    self.dfsvisit(nextVertex)
            startVertex.setColor('black')
            self.time += 1
            startVertex.setFinish(self.time)

剪枝

# Refer
- 通用深度优先搜索 https://facert.gitbooks.io/python-data-structure-cn/7.%E5%9B%BE%E5%92%8C%E5%9B%BE%E7%9A%84%E7%AE%97%E6%B3%95/7.15.%E9%80%9A%E7%94%A8%E6%B7%B1%E5%BA%A6%E4%BC%98%E5%85%88%E6%90%9C%E7%B4%A2/