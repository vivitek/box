#!/usr/bin/env python3

import json
from pynft import Executor

executor = Executor("", "")

output = executor.AddTable("ip", "foo")
executor.PrintCMDoutput(output)
output = executor.AddChain("ip", "foo", "bar")
executor.PrintCMDoutput(output)

executor.BanIpSaddr("vincipit.com")
executor.PrintRuleset()

output = executor.DeleteChain("ip", "foo", "bar")
executor.PrintCMDoutput(output)
output = executor.DeleteTable("ip", "foo")
executor.PrintCMDoutput(output)

output = executor.DeleteChain("ip", "foo", "bar")
executor.PrintCMDoutput(output)
