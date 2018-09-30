---
title: C futex 同步机制
date: 2018-09-27
---
# C futex 同步机制
Futex 是快速用户空间互斥体, Fast Userspace muTexes的缩写

在传统的Unix系统中，System V IPC(inter process communication)，如 semaphores, msgqueues, sockets还有文件锁机制(flock())等进程间同步机制都是`对一个内核对象操作`来完成的.

当进程间要同步的时候必须要通过系统调用(如semop())在内核中完成。

可是经研究发现，很多同步是无竞争的，即某个进程进入互斥区，到再从某个互斥区出来这段时间，常常是没有进程也要进这个互斥区或者请求同一同步变量的。
但是在这种情况下，这个进程也要陷入内核去看看有没有人 和它竞争，退出的时侯还要陷入内核去看看有没有进程等待在同一同步变量上。
这些不必要的系统调用(或者说内核陷入)造成了大量的性能开销。

为了解决这个问 题，Futex就应运而生，Futex是一种用户态和内核态混合的同步机制。
1. 首先，同步的进程间通过mmap共享一段内存，futex变量就位于这段共享的内存中且操作是原子的
2. 当进程尝试进入互斥区或者退出互斥区的时候，先去查看共享内存中的futex变量，
    1. 如果没有竞争发生，则只修改futex,而不 用再执行系统调用了。
    2. 当通过访问futex变量告诉进程有竞争发生，则还是得执行系统调用去完成相应的处理(wait 或者 wake up)。
简单的说，futex就是通过在用户态的检查，（motivation）如果了解到没有竞争就不用陷入内核了，大大提高了low-contention时候的效率。

这里的原子性加减通常是用CAS(Compare and Swap)完成的，与平台相关。CAS的基本形式是：CAS(addr,old,new),当addr中存放的值等于old时，用new对其替换。在x86平台上有专门的一条指令来完成它: cmpxchg。

## 进/线程利用futex同步
进程或者线程都可以利用futex来进行同步。
对于线程，情况比较简单，因为线程共享虚拟内存空间，虚拟地址就可以唯一的标识出futex变量，即线程用同样的虚拟地址来访问futex变量。
对于进程，情况相对复杂，因为进程有独立的虚拟内存空间，只有通过mmap()让它们共享一段地址空间来使用futex变量。每个进程用来访问futex的 虚拟地址可以是不一样的，只要系统知道所有的这些虚拟地址都映射到同一个物理内存地址，并用物理内存地址来唯一标识futex变量。

## Reference
- https://blog.csdn.net/jianchaolv/article/details/7544316