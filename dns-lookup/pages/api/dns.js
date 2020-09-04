// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import dns from 'dns'
import { hostname } from 'os'

export default async (req, res) => {
  console.log(req.body)
  dns.lookupService(req.body.addr, 80, (err, hostname, service) => {
    if (err)
      res.send(500)
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.json({ hostname, service })
  })
}