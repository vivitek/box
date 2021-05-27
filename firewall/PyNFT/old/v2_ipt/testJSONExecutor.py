#!/usr/bin/env python3

import json
from pyIP import Executor

# TESTS:

executor = Executor()

# 1)
output = executor.AddTable("ip", "foo")
executor.PrintCMDoutput(output)
output = executor.AddChain("ip", "foo", "bar")
executor.PrintCMDoutput(output)

# 2)
executor.BanIpSaddr("vincipit.com")
executor.PrintRuleset()

# 3)
output = executor.DeleteChain("ip", "foo", "bar")
executor.PrintCMDoutput(output)
output = executor.DeleteTable("ip", "foo")
executor.PrintCMDoutput(output)

# 4)
output = executor.DeleteChain("ip", "foo", "bar")
executor.PrintCMDoutput(output)
