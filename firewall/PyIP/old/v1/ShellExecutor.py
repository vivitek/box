#! /usr/bin/python3

import subprocess, shlex

class Executor:

	output = bytearray()

	def ExecuteNFTCommand(self, args, force = False):
		command_line = args if force else ("sudo iptables  " + args)
		args = shlex.split(command_line)
		try:
			self.output = subprocess.check_output(args, stderr=subprocess.STDOUT)
		except subprocess.CalledProcessError as err:
			print("Error in system call :  Command \'" + str(err.cmd) + "\' returned non-zero exit status " + str(err.returncode)
					+   "\nError message : " + err.output.decode())

	def PrintLSO(self):
		print(self.output.decode())
		return self.output


	###############################
	##                           ##
	##        (un)BAN IP         ##
	##                           ##
	###############################

	# iptables -A INPUT -s IP-ADDRESS -j DROP
	def BanIpSaddr(self, saddr, chain = "INPUT"):
		cmd = "-A " + chain + " -s " + saddr + " -j DROP"
		self.ExecuteNFTCommand(cmd)

	# iptables -D INPUT -s 209.175.453.23 -j DROP # service iptables save
	def UnbanIpSaddr(self, saddr, chain = "INPUT"):
		cmd = "-D " + chain + " -s " + saddr + ' -j DROP'
		self.ExecuteNFTCommand(cmd)
		cmd = "service iptables save"
		self.ExecuteNFTCommand(cmd, True)
