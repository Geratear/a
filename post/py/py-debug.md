---
layout: page
title: py-debug
category: blog
description: 
date: 2018-09-28
---
# Preface
1. exception
2. 调试包括print, assert, 
3. 使用logging/sentry/q(强烈推荐)
4. pdb/ipdb
3. perf 性能
1. 抛异常。在想要的位置异常，比如Flask的DEBUG的模式下，werkzeug里面的DebuggedApplication: 会把Web页面渲染成一个可调试和可执行的环境，直接到上面调试

## trace
```
import sys
def debug_info():
    return {
        'file':sys._getframe().f_code.co_filename,
        'fileno':sys._getframe().f_lineno,
        'funcname':sys._getframe(0).f_code.co_name,
        'caller':sys._getframe(1).f_code.co_name,
    }
```
或者：

    import sys
    def foo(exctype, value, tb):
        print('My Error Information')
        print('Type:', exctype)
        print('Value:', value)
        print('Traceback:', tb)
        print('tb_frame', tb.tb_frame)
        import code
        code.interact(local=locals())

    sys.excepthook = foo

## 异常调用栈
    try:
        a=1/0
    except Exception as e:
        print(e)
        import traceback
        tb = traceback.format_exc()

## For More
Python 代码调试技巧: \
    https://www.ibm.com/developerworks/cn/linux/l-cn-pythondebugger/

# 异常

## exception

    BaseException
     +-- SystemExit
     +-- KeyboardInterrupt
     +-- GeneratorExit
     +-- Exception
          +-- StopIteration

try catch

	try:
		do sth.
    except ZeroDivisionError as e:
        print(e)
	except ValueError:
		raise
		raise ValueError('sth error!')
    except (RuntimeError, TypeError, NameError):
        print("Unexpected error:", sys.exc_info()[0])
        pass
	else:
		return None
	finally:
		do sth.

else 仅当没有异常或者没有被捕获的异常时, 才生效. 当有未捕获的异常出现时，finally 也会执行, 然后才抛出异常中断执行

### SystemExit
exit(n), quit(n), sys.exit(n)都是一个东西: SystemExit(n); 
不影响 不影响finnaly 或者 catch BaseException; 

    1. SystemExit is raised by the `sys.exit()` function. 
    2. not accidentally caught by code that *catches Exception*.
    5. 不影响finnaly 或者 except BaseException
    3. When it is not handled, the Python *interpreter exits; no stack traceback* is printed. 

而`os._exit(n)` 直接调用C `_exit(n)` 直接中断！
1. The constructor accepts the same optional argument passed to sys.exit(). 
    1. If an integer,passed to C’s exit() function;
    2. if it is None, the exit status is zero;
    3. if it has another type (such as a string), the object’s value is printed and the exit status is one.

### debug mode

    PYTHONASYNCIODEBUG=1 python3 a.py

## raise异常
More: raise语句如果不带参数，就会把当前错误原样抛出

    class FooError(ValueError):
        pass

    try:
        print('try...')
        r = 10 / int('2')
        print('result:', r)
    except ValueError as e:
        print('ValueError:', e)
    except ZeroDivisionError as e:
        print('ZeroDivisionError:', e)
    except:
        print('no error!')
        raise FooError('invalid value:')
    finally:
        print('finally...')
    print('END')


Exception:

    raise Exception(*args)
    e.args

### 记录异常错误

	import logging

    try:
    	10 / 0
    except Exception as e:
        logging.exception(e)

通过配置，logging还可以把错误记录到日志文件里，方便事后排查。


	logging.basicConfig(filename='example.log',level=logging.DEBUG)
	logging.basicConfig(filename=logname,
                            filemode='a',
                            format='%(asctime)s,%(msecs)d %(name)s %(levelname)s %(message)s',
                            datefmt='%H:%M:%S',
                            level=logging.DEBUG)

logging file path(default by current path):

	logging.getLoggerClass().root.handlers[0].baseFilename

### 抛出异常

	raise TypeError('invalid value: %s' % s)
	# 或
	except ValueError as e:
        print('ValueError!')
        raise

# 调试
调试包括print, assert, logging, pdb,ipdb,...

## assert 断言

	def foo(n):
		assert n != 0, 'n is zero!'
		return 10 / n

	foo(0)

如果断言失败，assert语句本身就会抛出AssertionError：

	AssertionError: n is zero!

Python解释器时可以用-O参数来关闭assert：

	$ python3 -O test.py

## gdb

    $ gdb python3 <pid>
    > bt
    > info threads


好像失效了: If you have Python extensions installed, you can enter:
https://wiki.python.org/moin/DebuggingWithGdb
On linux, you can attach gdb to the process and get a python stack trace with some gdb macros. Put http://svn.python.org/projects/python/trunk/Misc/gdbinit in ~/.gdbinit, then

    (gdb) py-bt
    (gdb) py-list
    (gdb) pystack

## pdb
py/py-debug-pdb.md

## signal(when exec)
https://stackoverflow.com/questions/132058/showing-the-stack-trace-from-a-running-python-application

    import code, traceback, signal

    def debug(sig, frame):
        """Interrupt running process, and provide a python prompt for
        interactive debugging."""
        d={'_frame':frame}         # Allow access to frame object.
        d.update(frame.f_globals)  # Unless shadowed by global
        d.update(frame.f_locals)

        i = code.InteractiveConsole(d)
        message  = "Signal received : entering python shell.\nTraceback:\n"
        message += ''.join(traceback.format_stack(frame))
        i.interact(message)

    def listen():
        signal.signal(signal.SIGUSR1, debug)  # Register handler

To use, just call the listen() function at some point when your program starts up, and let it run. At any point, send the process a SIGUSR1 signal, using kill, or in python:

    os.kill(pid, signal.SIGUSR1)

This will cause the program to break to a python console at the point it is currently at, 
1. showing you the stack trace, and letting you manipulate the variables. 
2. Use control-d (EOF) to continue running (though note that you will probably interrupt any I/O etc at the point you signal, so it isn't fully non-intrusive.