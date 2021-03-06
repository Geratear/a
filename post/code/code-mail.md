---
layout: page
title:	mail 工具推荐
category: blog
description:
---
# Preface
本文介绍一下我常用的mail工具。

# pop3,imap,exchange
pop3, 邮件download 到本地后，远程服务器会删除文件（除非特殊配置）
imap, online 在线编辑，读取后服务器端不会删除。
Exchange主要是微软公司的一套电子邮件服务组件


# 网易企业邮箱
http://qiye.163.com/mail/help-client.htm#contentTab=client

imap:

	imap.qiye.163.com
		143 or 993+SSL
	smtp.qiye.163.com
		选择“使用默认端口（25，465，597）。
		or 994+SSL
	必须勾选“发送服务器需要身份验证”

pop:
	pop.qiye.163.com
		110 or 995+SSL

## qq server:
接收邮件服务器：imap.qq.com
发送邮件服务器：smtp.qq.com
账户名：您的QQ邮箱账户名（如果您是VIP邮箱，账户名需要填写完整的邮件地址）
密码：您的QQ邮箱密码
电子邮件地址：您的QQ邮箱的完整邮件地址

如何设置IMAP服务的SSL加密方式？
使用SSL的通用配置如下：
接收邮件服务器：imap.qq.com，使用SSL，端口号993
发送邮件服务器：smtp.qq.com，使用SSL，端口号465或587
账户名：您的QQ邮箱账户名（如果您是VIP帐号或Foxmail帐号，账户名需要填写完整的邮件地址）
密码：您的QQ邮箱密码
电子邮件地址：您的QQ邮箱的完整邮件地址

# mutt
mutt 支持强大的交互，功能完备。

On Mac OS X:

	brew  intall mutt

## Conf
参考[mutt faq](http://dev.mutt.org/trac/wiki/MuttFaq/Header)

	vim ~/.muttrc
		set realname="Joe User"
	 	set from="user@host"
		set from = "username@gmail.com"
		set use_from=yes

		set imap_user=your.username@gmail.com
		set imap_pass = "password"

		set smtp_pass = "password"
		set smtp_url = "smtp://username@smtp.gmail.com:587/"

## Usage:

	 mutt -s "Test mail" -a /tmp/file.tar.gz 'a132811@gmail.com,ahuigo@qq.com' < /tmp/mailmessage.txt
	 echo 'msg' |  mutt -s "Test mail" -a /tmp/file.tar.gz 'a132811@gmail.com'

# mail
Usage:

	mail [-EiInv] [-s subject] [-c cc-addr] [-b bcc-addr] [-F] to-addr ... [-sendmail-option ...]
	$msg = escapeshellarg($msg);
	echo 'body'|  mail -s 'subject msg' 'a132811@gmail.com,xuehui1@staff.com'

## config

	$ cat ~/.msmtprc
	defaults
	logfile ~/.msmtp.log
	account hilojack
	tls off
	auth off
	host mail.ahuigo.github.io
	port 587
	from admin@ahuigo.github.io
	tls_certcheck off
	user hilo@ahuigo.github.io
	password your_password
	account default : hilo

> for `php.ini` sendmail_path = "/usr/bin/msmtp -C /path/to/msmtprc -t"

    $ vim /etc/mail.rc

## Send file

	uuencode -m /path/to/a.txt a.txt |  mail -s 'subject msg' 'a132811@gmail.com,xuehui1@stff.com' #附件通过uuencode base64编码
	uuencode /path/to/a.txt a.txt |  mail -s 'subject msg' 'a132811@gmail.com,xuehui1@stff.com' #附件通过uuencode编码
	//-m encode file as base64
	uuencode -m /path/to/a.txt a.txt |  mail -s 'subject msg' 'a132811@gmail.com,xuehui1@stff.com' #附件通过uuencode base64编码

> uuencode infile remotefile

## mail交互
在mac中, 你收到的邮件内容默认会放置在/var/mail/UserName下, 比如我的 /var/mail/hilojack
输入mail就可以查看来信了. 退出后, 未读消息会放置到$HOME/mbox

	➜  ~  mail
	Mail version 8.1 6/6/93.  Type ? for help.
	"/var/mail/hilojack": 14 messages 14 new
	>N  1 MAILER-DAEMON@hiloja  Mon May  5 11:37  69/2673  "Undelivered Mail Returned to Sender"
	 N  2 MAILER-DAEMON@hiloja  Mon May  5 11:37  69/2729  "Undelivered Mail Returned to Sender"
	 N  3 MAILER-DAEMON@hiloja  Mon May  5 11:44  75/2881  "Undelivered Mail Returned to Sender"
		.......
			Mail   Commands
	t <message list>		type messages
	n				goto and type next message
	e <message list>		edit messages
	f <message list>		give head lines of messages
	d <message list>		delete messages
	s <message list> file		append messages to file
	u <message list>		undelete messages
	R <message list>		reply to message senders
	r <message list>		reply to message senders and all recipients
	pre <message list>		make messages go back to /var/mail
	m <user list>			mail to specific users
	q				quit, saving unresolved messages in mbox
	x				quit, do not remove system mailbox
	h				print out active message headers
	!				shell escape

# mail postfix
postfix是Wietse Venema在IBM的GPL协议之下开发的MTA（邮件传输代理）软件。下面一段话摘自postfix的官方站点（http://www.postfix.org）：“postfix是Wietse Venema想要为使用最广泛的sendmail提供替代品的一个尝试。Postfix试图更快、更容易管理、更安全，同时还与sendmail保持足够的兼容性。”

	configuration /etc/postfix

# mail log
mac 下, 所有的mail tool的mail log默认是在:

	cat /var/log/mail.log

可以看到postfix/master pickup cleanup qmgr smtp qmgr 等相关日志

	May  5 14:37:23 hilojack.local postfix/master[74700]: daemon started -- version 2.9.4, configuration /etc/postfix
	May  5 14:37:23 hilojack.local postfix/pickup[74701]: 7AA3415BCBD6: uid=501 from=<hilojack>
	May  5 14:37:23 hilojack.local postfix/cleanup[74703]: 7AA3415BCBD6: message-id=<20140505063723.7AA3415BCBD6@hilojack.local>
	May  5 14:37:23 hilojack.local postfix/qmgr[74702]: 7AA3415BCBD6: from=<hilojack@hilojack.local>, size=1158, nrcpt=2 (queue active)
	May  5 14:37:23 hilojack.local postfix/smtp[74706]: 7AA3415BCBD6: to=<xuehui1@staff.sina.com.cn>, relay=staffmx1.staff.sina.com.cn[10.210.101.78]:25, delay=1.1, delays=0.69/0.01/0.04/0.4, dsn=2.0.0, status=sent (250 2.0.0 s456bLjM011011-s456bLjN011011 Message accepted for delivery)
	May  5 14:37:26 hilojack.local postfix/smtp[74705]: 7AA3415BCBD6: to=<a132811@gmail.com>, relay=gmail-smtp-in.l.google.com[74.125.129.27]:25, delay=3.3, delays=0.69/0.01/1.1/1.5, dsn=2.0.0, status=sent (250 2.0.0 OK 1399271845 yb4si7426842pab.21 - gsmtp)
	May  5 14:37:26 hilojack.local postfix/qmgr[74702]: 7AA3415BCBD6: removed

## 550
如果发现`log`中有550 log, 可能是[群发垃圾拒绝](http://service.mail.qq.com/cgi-bin/help?subtype=1&&id=20022&&no=1000726):

	550 Mail content denied "对于具有群发性质的邮件，如果出现用户普遍表示反感或集中投诉的情况，腾讯邮箱将禁止类似此邮件内容继续发送。

# perl mail

	#!/usr/bin/perl
	use MIME::Entity;

	$message = MIME::Entity->build(
		Type    => "multipart/mixed",
		From    => "hilo\@google2.com",
		To      => "hilo\@baidu.cn,test\@sina.cn",
		Subject => "perl mail" );

	$message->attach(Data=>"perl mail data");

	$message->attach(
		Path     => "./a.pdf",
		Type     => "application/a.pdf",
		Encoding => "base64");

	open MAIL, "| /usr/sbin/sendmail -t -oi";
	$message->print(\*MAIL);
	close MAIL;

# Mac Mail
Mac mail 有个地址薄, 查看方法为：`Select Window | Previous Recipients `from the menu in Mac OS X Mail.

如果你不想要某个`Recipients`, 你也可以在地址栏选择`Recipients`, 然后删除它

# php mail
> http://stackoverflow.com/questions/12301358/send-attachments-with-php-mail

## mail()

	$file = './a.txt';
	$from_name = 'hilojack';
	$from_mail = 'hilojack@ahuigo.github.io';
	$subject = 'subject--';
	$replyto = 'replyto@qq.com';
	$mail_to = 'xx@xx.com';
	$body = 'message body--';

	$filename = basename($file);
	$content = file_get_contents($file);

	$content = chunk_split(base64_encode($content));
	$uid = md5(uniqid(time()));

	$eol = PHP_EOL;

	$header = "From: ".$from_name." <".$from_mail.">".$eol;
	$header .= "Reply-To: ".$replyto.$eol;
	$header .= "MIME-Version: 1.0\r\n";
	$header .= "Content-Type: multipart/mixed; boundary=\"".$uid."\"";
	$message = "--".$uid.$eol;
	$message .= "Content-Type: text/html; charset=ISO-8859-1".$eol;
	$message .= "Content-Transfer-Encoding: 8bit".$eol.$eol;
	$message .= $body.$eol;
	$message .= "--".$uid.$eol;
	$message .= "Content-Type: application/pdf; name=\"".$filename."\"".$eol;
	$message .= "Content-Transfer-Encoding: base64".$eol;
	$message .= "Content-Disposition: attachment; filename=\"".$filename."\"".$eol;
	$message .= $content.$eol;
	$message .= "--".$uid."--";

	if (mail($mail_to, $subject, $message, $header)) {
		return "mail_success";
	} else {
		return "mail_error";
	}

## PHPMailer
https://github.com/PHPMailer/PHPMailer

    require 'PHPMailerAutoload.php';

    $mail = new PHPMailer;

    iconv_set_encoding("internal_encoding", "UTF-8");
    $mail->CharSet = 'UTF-8';// do not use 'utf8'

    //$mail->SMTPDebug = 3;                               // Enable verbose debug output
    $mail->isSMTP();                                      // Set mailer to use SMTP
    $mail->SMTPAuth = true;                               // Enable SMTP authentication

    $mail->Host = 'smtp1.example.com;smtp2.example.com';  // Specify main and backup SMTP servers
    $mail->Username = 'user@example.com';                 // SMTP username
    $mail->Password = 'secret';                           // SMTP password
    $mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
    $mail->Port = 587;                                    // TCP port to connect to

    $mail->setFrom('from@example.com', 'Mailer');
    $mail->addAddress('joe@example.net', 'Joe User');     // Add a recipient
    $mail->addAddress('ellen@example.com');               // Name is optional
    $mail->addReplyTo('info@example.com', 'Information');
    $mail->addCC('cc@example.com');
    $mail->addBCC('bcc@example.com');

    $mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
    $mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name
    $mail->isHTML(true);                                  // Set email format to HTML

    $mail->Subject = 'Here is the subject';
    $mail->Body    = 'This is the HTML message body <b>in bold!</b>';
    $mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

    if(!$mail->send()) {
        echo 'Message could not be sent.';
        echo 'Mailer Error: ' . $mail->ErrorInfo;
    } else {
        echo 'Message has been sent';
    }

### local mail

    require 'PHPMailerAutoload.php';

    $mail = new PHPMailer;

    # important !
    iconv_set_encoding("internal_encoding", "UTF-8");
    $mail->CharSet = 'UTF-8';// do not use 'utf8'
    # $mail->SMTPDebug = 3; //不能用

    $mail->Host = 'my_hostname';  // Specify main and backup SMTP servers
    $mail->SMTPAuth = false;                               // Enable SMTP authentication
    $mail->Username = 'hdp@my_hostname';                 // SMTP username

    $mail->setFrom('fakename@my_hostname', 'hilojack');
    $mail->addAddress('hilojack@huajiao.tv');     // Add a recipient
    $mail->isHTML(true);                                  // Set email format to HTML

    $mail->Subject = 'Here is the subject';
    $mail->Body    = 'This is the HTML message body <b>in bold!</b>';
    $mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

    if(!$mail->send()) {
        echo 'Message could not be sent.';
        echo 'Mailer Error: ' . $mail->ErrorInfo;
    } else {
        echo 'Message has been sent';
    }

# qq mail
qq 邮件可以将特殊的邮件，转发到自己的备用邮箱中去： 设置-收信规则
