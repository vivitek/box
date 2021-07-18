#! /usr/bin/python3

import shlex
from ShellExecutor import Executor

###############################
##                           ##
##       RULE SWITCHER       ##
##                           ##
###############################

def RuleActionSwitcher(args, pyip):
    switcher = {
        "add" : pyip.AddRule,
        "insert" : pyip.InsertRule,
        "replace" : pyip.ReplaceRule,
        "delete" : pyip.DeleteRule,
    }

    if (len(args) < 2):
        print("[] => Invalid Rule Action\n")
        return 

    cmd = args[1]
    del args[:2]

    func = switcher.get(cmd, RuleActionErr)
    return func(args, cmd)

def RuleActionErr(args, cmd):
    print("[" + cmd + "] => Invalid Rule Action\n")
    return -1


###############################
##                           ##
##       CHAIN SWITCHER      ##
##                           ##
###############################

def ChainActionSwitcher(args, pyip):
    switcher = {
        "add" : pyip.AddChain,
        "create" : pyip.CreateChain,
        "delete" : pyip.DeleteChain,
        "list" : pyip.ListChain,
        "flush" : pyip.FlushChain,
        "rename" : pyip.RenameChain,
    }

    if (len(args) < 2):
        print("[] => Invalid Chain Action\n")
        return 

    cmd = args[1]
    del args[:2]

    func = switcher.get(cmd, ChainActionErr)
    return func(args, cmd)

def ChainActionErr(args, cmd):
    print("[" + cmd + "] => Invalid Chain Action\n")
    return -1


###############################
##                           ##
##      TABLE SWITCHER       ##
##                           ##
###############################

def TableActionSwitcher(args, pyip):
    switcher = {
        "add" : pyip.AddTable,
        "delete" : pyip.DeleteTable,
        "list" : pyip.GetTable,
        "flush" : pyip.FlushTable,
    }

    if (len(args) < 2):
        print("[] => Invalid Table Action\n")
        return

    cmd = args[1]
    del args[:2]

    func = switcher.get(cmd, TableActionErr)
    return func(args, cmd)

def TableActionErr(args, cmd):
    print("[" + cmd + "] => Invalid Table Action\n")
    return -1



###############################
##                           ##
##       NFT SWITCHER        ##
##                           ##
###############################

def ActionSwitcher(args, pyip):
    switcher = {
        "table" : TableActionSwitcher,
        "chain" : ChainActionSwitcher,
        "rule" : RuleActionSwitcher,
        "print" : PrintLSOFence,
    }

    func = switcher.get(args[0], ActionErr)
    return func(args, pyip)

def ActionErr(args, pyip):
    print("[" + args[0] + "] => Invalid Action\n")
    return -1

def PrintLSOFence(args, pyip):
    pyip.PrintLSO()


###############################
##                           ##
##           MAIN            ##
##                           ##
###############################

def InputErrorManagement(args):
    if (len(args) == 0):
        return 84
    elif (args[0] == "quit"):
        return -1
    elif (args[0] == "exit"):
        return -1
    elif (args[0] == "stop"):
        return -1
    return 0

def main():

    pyip = Executor()

    isRunning = True
    i = 0
    while (isRunning):

        # Get Input
        user_input = input("pyip> ")
        args = shlex.split(user_input)

        # Basic Input Error Management
        errManagement = InputErrorManagement(args)
        if (errManagement == -1):
            print("Quitting pyip\n")
            return 0
        elif (errManagement == 84):
            print("Invalid Command, please try again\n")
            continue

        # Actions to Take
        ActionSwitcher(args, pyip)

main()

#   Note :
#
#       pyip is a python script executable in shell
#       it should be integrated to the python hooks that Remy Bouvard created to allow router NetFilter modification inputs from Server
#
#   pyip syntax :
#
#       -   "sudo nft" is automatically added to the command
#
#       -   actions and objects are reversed
#           normal nft table command example    =>     $> nft add table ip filter
#           same command using pyip (in shell) =>     $> python3 pyip.py table add ip filter
