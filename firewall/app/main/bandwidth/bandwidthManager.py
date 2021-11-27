import os
from app.main.utils.custom_exception import CustomException
from flask_api import status

class Bandwidth():
    
    def init_tc(self):
        os.system('tc qdisc del dev wlp58s0 root')
        os.system('tc qdisc add dev wlp58s0 root handle 1: cbq avpkt 1000 bandwidth 20mbit')
    
    def rule_limit(self, number, classId):
        value = os.system('tc class add dev wlp58s0 parent 1: classid 1:%s cbq rate %smbit allot 1500 prio 5 bounded isolated'%(classId, number))
        if (value != 0):
            raise CustomException('Wrong Argument', status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def limit_mac(self, address, classId):
        array = address.split(':')
        os.system('tc filter add dev wlp58s0 parent 1: protocol ip prio 5 u32 match u16 0x0800 0xFFFF at -2 match u16 0x%s%s 0xFFFF at -4 match u32 0x%s%s%s%s 0xFFFFFFFF at -8 flowid 1:%s'%(array[4], array[5], array[0], array[1], array[2], array[3], classId))
        os.system('tc filter add dev wlp58s0 parent 1: protocol ip prio 5 u32 match u16 0x0800 0xFFFF at -2 match u32 0x%s%s%s%s 0xFFFFFFFF at -12 match u16 0x%s%s 0xFFFF at -14 flowid 1:%s'%(array[2], array[3], array[4], array[5], array[0], array[1], classId))
