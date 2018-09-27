---
title: Number of processes for user
date: 2018-09-27
---
# Number of processes for user
Default limit for number of user's processes to prevent
```
$ cat /etc/security/limits.d/20-nproc.conf
*          soft    nproc     4096
root       soft    nproc     unlimited
```