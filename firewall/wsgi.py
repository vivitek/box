from manage import app, firewall_init 

if __name__ == "__main__":
    firewall_init.init_firewall()
    app.run(host="0.0.0.0")
