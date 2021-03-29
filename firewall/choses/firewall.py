from pyptables import default_tables, restore
from pyptables.rules import Rule, Accept

def default_tables():
    """Generate a set of iptables containing all the default tables and chains"""

    return Tables(Table('filter',
                    BuiltinChain('INPUT', 'ACCEPT'),
                    BuiltinChain('FORWARD', 'ACCEPT'),
                    BuiltinChain('OUTPUT', 'ACCEPT'),
                ),
                Table('nat',
                    BuiltinChain('PREROUTING', 'ACCEPT'),
                    BuiltinChain('OUTPUT', 'ACCEPT'),
                    BuiltinChain('POSTROUTING', 'ACCEPT'),
                    ),
                Table('mangle',
                    BuiltinChain('PREROUTING', 'ACCEPT'),
                    BuiltinChain('INPUT', 'ACCEPT'),
                    BuiltinChain('FORWARD', 'ACCEPT'),
                    BuiltinChain('OUTPUT', 'ACCEPT'),
                    BuiltinChain('POSTROUTING', 'ACCEPT'),
                ),
    )

# get a default set of tables and chains
tables = default_tables()

# get the forward chain of the filter tables
forward = tables['filter']['FORWARD']

# any packet matching an established connection should be allowed
forward.append(Accept(match='conntrack', cstate='ESTABLISHED'))

# add rules to the forward chain for DNS, HTTP and HTTPS ports
forward.append(Accept(proto='tcp', dport='53'))
forward.append(Accept(proto='tcp', dport='80'))
forward.append(Accept(proto='tcp', dport='443'))

# any packet not matching a rules will be dropped
forward.policy = Rule.DROP
restore(tables)


# reject_ssh = Rule(proto='tcp', dport='22', jump='REJECT')
# tables['filter']['INPUT'].append(reject_ssh)