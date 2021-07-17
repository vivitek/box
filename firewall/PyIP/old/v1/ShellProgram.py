#! /usr/bin/python3

import shlex
from ShellExecutor import Executor

###############################
##                           ##
##       RULE SWITCHER       ##
##                           ##
###############################

def RuleActionSwitcher(args, pynft):
    switcher = {
        "add" : pynft.AddRule,
        "insert" : pynft.InsertRule,
        "replace" : pynft.ReplaceRule,
        "delete" : pynft.DeleteRule,
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

def ChainActionSwitcher(args, pynft):
    switcher = {
        "add" : pynft.AddChain,
        "create" : pynft.CreateChain,
        "delete" : pynft.DeleteChain,
        "list" : pynft.ListChain,
        "flush" : pynft.FlushChain,
        "rename" : pynft.RenameChain,
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

def TableActionSwitcher(args, pynft):
    switcher = {
        "add" : pynft.AddTable,
        "delete" : pynft.DeleteTable,
        "list" : pynft.GetTable,
        "flush" : pynft.FlushTable,
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

def ActionSwitcher(args, pynft):
    switcher = {
        "table" : TableActionSwitcher,
        "chain" : ChainActionSwitcher,
        "rule" : RuleActionSwitcher,
        "print" : PrintLSOFence,
    }

    func = switcher.get(args[0], ActionErr)
    return func(args, pynft)

def ActionErr(args, pynft):
    print("[" + args[0] + "] => Invalid Action\n")
    return -1

def PrintLSOFence(args, pynft):
    pynft.PrintLSO()


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
    pynft = Executor()
    isRunning = True
    i = 0

    while (isRunning):
        # Get Input
        user_input = input("pynft> ")
        args = shlex.split(user_input)

        # Basic Input Error Management
        errManagement = InputErrorManagement(args)
        if (errManagement == -1):
            print("Quitting pynft\n")
            return 0
        elif (errManagement == 84):
            print("Invalid Command, please try again\n")
            continue

        # Actions to Take
        ActionSwitcher(args, pynft)

main()
