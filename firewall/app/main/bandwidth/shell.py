import subprocess
import os

DEVNULL = open(os.devnull, 'w')


def output_suppressed(command, root=True):
    return subprocess.check_output('sudo ' + command if root else command, shell=True, stderr=DEVNULL).decode(
        'utf-8')


def locate_bin(name):
    try:
        return output_suppressed('which {}'.format(name)).replace('\n', '')
    except subprocess.CalledProcessError:
        print('missing util: {}, check your PATH'.format(name))

