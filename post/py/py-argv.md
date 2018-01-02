---
layout: page
title:
category: blog
description:
---
# Preface
- click
click 之于argparse/argv, 相当于requests 之于urllib

命令行程序开发

```
	asciimatics：跨平台，全屏终端包（即鼠标/键盘输入和彩色，定位文本输出），完整的复杂动画和特殊效果的高级API。官网
	cement：Python 的命令行程序框架。官网
	click：一个通过组合的方式来创建精美命令行界面的包。官网
	cliff：一个用于创建命令行程序的框架，可以创建具有多层命令的命令行程序。官网
	clint：Python 命令行程序工具。官网
	colorama：跨平台彩色终端文本。官网
	docopt：Python 风格的命令行参数解析器。官网
	Gooey：一条命令，将命令行程序变成一个 GUI 程序。官网
	python-prompt-toolkit：一个用于构建强大的交互式命令行程序的库。官网
	Pythonpy：在命令行中直接执行任何Python指令。官网
```
生产力工具
```
aws-cli：Amazon Web Services 的通用命令行界面。官网
bashplotlib：在终端中进行基本绘图。官网
caniusepython3：判断是哪个项目妨碍你你移植到 Python 3。官网
cookiecutter：从 cookiecutters（项目模板）创建项目的一个命令行工具。官网
doitlive：一个用来在终端中进行现场演示的工具。官网
howdoi：通过命令行获取即时的编程问题解答。官网
httpie：一个命令行HTTP 客户端，cURL 的替代品，易用性更好。官网
PathPicker：从bash输出中选出文件。官网
percol：向UNIX shell 传统管道概念中加入交互式选择功能。官网
SAWS：一个加强版的 AWS 命令行。官网
thefuck：修正你之前的命令行指令。官网
mycli：一个 MySQL 命令行客户端，具有自动补全和语法高亮功能。官网
pgcli：Postgres 命令行工具，具有自动补全和语法高亮功能。官网
try：一个从来没有更简单的命令行工具，用来试用python库。官网
```

# sys.argv

	from sys import argv
	script, arg1, arg2 = argv

# click 推荐

    import click
    @click.command()
    @click.option('-count', default=1, help='Number of greetings')
    @click.option('-name', prompt='Your name', help='The person to greet')
    def hello(name, count): # 没有位置先后
        for x in range(count):
            click.echo('Hello %s!' % name);

    if __name__ == '__main__':
        hello()

click.command 装饰使hello 能接收cli args
