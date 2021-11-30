import app.main.bandwidth.shell as shell
from app.main.bandwidth.globals import BIN_TC, BIN_IPTABLES
import subprocess
import os

DEVNULL = open(os.devnull, 'w')


interface = 'wlp58s0'


class Limiter:

    def execute(self, command):
        subprocess.call(command, shell=True)

    def init_tc(self):
        self.execute('{} qdisc del dev {} root'.format(BIN_TC, interface))
        self.execute('{} qdisc add dev {} root handle 1:0 cbq avpkt 1000 bandwidth 10000mbit'.format(BIN_TC, interface))

    def limit(self, host, rate, host_id):
        self.execute('{} class add dev {} parent 1:0 classid 1:{} cbq rate {}mbit allot 1500 prio {} bounded isolated'.format(BIN_TC, interface, host_id, rate, host_id))
        self.execute('{} filter add dev {} parent 1:0 protocol ip prio {id} handle {id} fw flowid 1:{id}'.format(BIN_TC, interface, id=host_id))
        self.execute('iptables -t mangle -A PREROUTING -d {} -j MARK --set-mark {}'.format(host, host_id))

    def unlimit(self, host, host_id):
        self.execute('{} filter del dev {} parent 1:0 prio {}'.format(BIN_TC, interface, host_id))
        self.execute('{} class del dev {} parent 1:0 classid 1:{}'.format(BIN_TC, interface, host_id))
        self.execute('{} -t mangle -D PREROUTING -d {} -j MARK --set-mark {}'.format(BIN_IPTABLES, host, host_id))

    def replace(self, host, host_id, rate):
        self.unlimit(host, host_id)
        self.limit(host, rate, host_id)
