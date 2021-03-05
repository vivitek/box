#!/usr/bin/env python
import dbus, uuid

## Change these values
SSID="ViviHostspot"
PASSWORD="Vivi2021Test"
##

s_con = dbus.Dictionary({
    'type': '802-11-wireless',
    'uuid': str(uuid.uuid4()),
    'id': SSID,
})

s_wifi = dbus.Dictionary({
    'ssid': dbus.ByteArray(SSID.encode()),
    'mode': 'infrastructure',
    'hidden': dbus.Boolean(True),
})

s_wsec = dbus.Dictionary({
    'key-mgmt': 'wpa-psk',
    'auth-alg': 'open',
    'psk': PASSWORD,
})

s_ip4 = dbus.Dictionary({'method': 'auto'})
s_ip6 = dbus.Dictionary({'method': 'auto'})

con = dbus.Dictionary({
    'connection': s_con,
    '802-11-wireless': s_wifi,
    '802-11-wireless-security': s_wsec,
    'ipv4': s_ip4,
    'ipv6': s_ip6,
})


bus = dbus.SystemBus()

proxy = bus.get_object("org.freedesktop.NetworkManager", "/org/freedesktop/NetworkManager/Settings")
settings = dbus.Interface(proxy, "org.freedesktop.NetworkManager.Settings")

settings.AddConnection(con)