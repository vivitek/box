#!/usr/bin/env python3

import unittest
from pynft import Executor, FWManager


executor = Executor()
fwm = FWManager()

#
#	Executor Tests
#

class ExecutorTests(unittest.TestCase):

	def something(self):
		self.assertEqual(1, 1)


#
#	NFT_OBJ Tests
#

class ObjectTests(unittest.TestCase):

	def something(self):
		self.assertEqual(1, 1)