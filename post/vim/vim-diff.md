# diffget all file
1. delete all current content
2. :diffget 1
3. :diffupdate

all:
- :%diffput 3
- :%diffget 1

> help :help :diffget
