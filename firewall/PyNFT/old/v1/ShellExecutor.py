#! /usr/bin/python3

import subprocess, shlex


class Executor:

	output = bytearray()

	def ExecuteNFTCommand(self, args):
		command_line = "sudo nft " + args
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
	##       TABLE ACTIONS       ##
	##                           ##
	###############################

	def GetTable(self, args, cmd = None):
		if (len(args) == 0):
			self.ExecuteNFTCommand("list tables")
		elif (len(args) == 1):
			self.ExecuteNFTCommand("list tables " + args[0])
		elif (len(args) == 2):
			self.ExecuteNFTCommand("list table " + args[0] + " " + args[1])
		else:
			print("Error :  incorrect parameter amount in GetTable()\n")
			return 'Error'

		return self.PrintLSO()

	def AddTable(self, args, cmd = None):
		if (len(args) != 2):
			print("Error :  incorrect parameter amount in AddTable()\n")
			return 'Error'

		self.ExecuteNFTCommand("add table " + args[0] + " " + args[1])
		return 'Table created'

	def DeleteTable(self, args, cmd = None):
		if (len(args) != 2):
			print("Error :  incorrect parameter amount in DeleteTable()\n")
			return 'Error'

		self.ExecuteNFTCommand("delete table " + args[0] + " " + args[1])
		return 'Table delete'

	def FlushTable(self, args, cmd = None):
		if (len(args) != 2):
			print("Error :  incorrect parameter amount in FlushTable()\n")
			return 'Error'

		self.ExecuteNFTCommand("flush table " + args[0] + " " + args[1])



	###############################
	##                           ##
	##       CHAIN ACTIONS       ##
	##                           ##
	###############################

	def AddChain(self, args, cmd = None):
		if (len(args) == 3):
			self.ExecuteNFTCommand("add chain " + args[0] + " " + args[1] + " " + args[2])
			return 'chain created'

		elif (len(args) == 8):
			args[3] = "type " + args[3]
			args[4] = "hook " + args[4]
			args[5] = " " if args[5] == "null" else "device " + args[5]
			args[6] = "priority " + args[6]
			args[7] = " " if args[7] == "null" else "policy " + args[7] + " ;"

			self.ExecuteNFTCommand("add chain " + args[0] + " " + args[1] + " " + args[2] + " { " + args[3] + " " + args[4] + " " + args[5] + " " + args[6] + " ; " + args[7] + " }")
			return 'Chains created'

		else:
			print("Error :  incorrect parameter amount in AddChain()\n")
			return 'Error'

	def CreateChain(self, args, cmd = None):
		if (len(args) == 3):
			self.ExecuteNFTCommand("create chain " + args[0] + " " + args[1] + " " + args[2])

		elif (len(args) == 8):
			args[3] = "type " + args[3]
			args[4] = "hook " + args[4]
			args[5] = " " if args[5] == "null" else "device " + args[5]
			args[6] = "priority " + args[6]
			args[7] = " " if args[7] == "null" else "policy " + args[7] + " ;"

			self.ExecuteNFTCommand("add chain " + args[0] + " " + args[1] + " " + args[2] + " { " + args[3] + " " + args[4] + " " + args[5] + " " + args[6] + " ; " + args[7] + " }")

		else:
			print("Error :  incorrect parameter amount in CreateChain()\n")

	def DeleteChain(self, args, cmd = None):
		if (len(args) != 3):
			print("Error :  incorrect parameter amount in DeleteChain()\n")
			return 'Error'

		self.ExecuteNFTCommand("delete chain " + args[0] + " " + args[1] + " " + args[2])

	def ListChain(self, args, cmd = None):
		if (len(args) != 3):
			print("Error :  incorrect parameter amount in ListChain()\n")
			return 'Error'

		self.ExecuteNFTCommand("list chain " + args[0] + " " + args[1] + " " + args[2])
		return self.PrintLSO()

	def FlushChain(self, args, cmd = None):
		if (len(args) != 3):
			print("Error :  incorrect parameter amount in FlushChain()\n")
			return 'Error'

		self.ExecuteNFTCommand("flush chain " + args[0] + " " + args[1] + " " + args[2])

	def RenameChain(self, args, cmd = None):
		if (len(args) != 4):
			print("Error :  incorrect parameter amount in RenameChain()\n")
			return 'Error'

		self.ExecuteNFTCommand("rename chain " + args[0] + " " + args[1] + " " + args[2] + " " + args[3])
		


	###############################
	##                           ##
	##       RULE ACTIONS        ##
	##                           ##
	###############################

	def AddRule(self, args, cmd = None):
		if (len(args) != 5):
			print("Error :  incorrect parameter amount in AddRule()\nargs are : " + str(args) + "\n")
			return 'Error'

		self.ExecuteNFTCommand("add rule " + args[0] + " " + args[1] + " " + args[2] + " " + args[3] + " " + args[4])
		return 'Added rule'

	def InsertRule(self, args, cmd = None):
		if (len(args) != 6):
			print("Error :  incorrect parameter amount in InsertRule()\n")
			return 'Error'
		
		args[3] = " " if args[3] == "null" else "position " + args[3]

		self.ExecuteNFTCommand("insert rule " + args[0] + " " + args[1] + " " + args[2] + " " + args[3] + " " + args[4] + " " + args[5])

	def ReplaceRule(self, args, cmd = None):
		if (len(args) != 6):
			print("Error :  incorrect parameter amount in ReplaceRule()\n")
			return 'Error'
		
		args[3] = " " if args[3] == "null" else "handle " + args[3]

		self.ExecuteNFTCommand("add rule " + args[0] + " " + args[1] + " " + args[2] + " " + args[3] + " " + args[4] + " " + args[5])

	def DeleteRule(self, args, cmd = None):
		if (len(args) != 4):
			print("Error :  incorrect parameter amount in DeleteRule()\n")
			return 'Error'

		args[3] = " " if args[3] == "null" else "handle " + args[3]

		self.ExecuteNFTCommand("delete rule " + args[0] + " " + args[1] + " " + args[2] + " " + args[3])
