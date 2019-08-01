const fs = require('fs');
const settings = require('../settings');

class DbHandler {
  constructor() {
    this._clusters;
  }
  set clusters(value) {
    this._clusters = value;
  }
  get clusters() {
    if (this._clusters) {
      return this._clusters;
    } else {
      let rawdata = fs.readFileSync(settings.DATA_FILE);
      const data = JSON.parse(rawdata);
      this.clusters = data;
      return this.clusters;
    }
  }
  init() {
    // console.log(this.clusters);
  }

  getDistinctOutcomes() {
    // console.log(this.clusters);
    const outcomes = [];
    this.clusters.forEach(c => {
      // console.log(`Cluster: ${c['cluster_uuid']}`)
      //cluster level
      c['systems'].forEach(s => {
        //system level
        // console.log(`System: ${s['sys_serial_number']}`)
        s['hosts'].forEach(h => {
          //host level
          // console.log(`Hostname: ${h['hostname']}`)
          h['aggregates'].forEach(a => {
            //aggregate level
            // console.log(`Aggregate: ${a['aggr_name']}`)
            a['outcomes'].forEach((o, i) => {
              const outcome = {
                cluster_uuid: c['cluster_uuid'],
                sys_serial_number: s['sys_serial_number'],
                hostname: h['hostname'],
                aggr_name: a['aggr_name'],
                rec: o['rec'],
                id: i
              };
              outcomes.push(outcome.rec);
            });
          });
        });
      });
    });

    return this.getOutcomesByGroup(outcomes);
  }

  getOutcomesByGroup(outcomes) {
    const result = { Outcomes: [], size: 0 };
    const oc = [...new Set(outcomes)];
    oc.forEach(outcome => {
      result.Outcomes.push({
        rec: outcome,
        size: outcomes.filter(e => e === outcome).length
      });
    });
    result.size = outcomes.length;
    return result;
  }

  getHostsWithMatchingOutcome(rec) {
    const hostList = [];
    // const systems: Array<any> = [];

    this.clusters.forEach(c => {
      //cluster level
      c['systems'].forEach(s => {
        //system level
        s['hosts'].forEach(h => {
          //host level
          h['aggregates'].forEach(a => {
            //aggregate level
            a['outcomes'].forEach((o, i) => {
              if (o['rec'] === rec) {
                const host = {
                  cluster_uuid: c['cluster_uuid'],
                  sys_serial_number: s['sys_serial_number'],
                  hostname: h['hostname'],
                  aggr_name: a['aggr_name'],
                  customer: c['customer'],
                  cluster_name: c['cluster_name'],
                  sys_model: s['sys_model'],
                  reviewed: a['reviewed']
                };
                hostList.push(host);
              }
              // outcomes.push(outcome.rec);
            });
          });
        });
      });
    });
    return hostList;
  }

  getReportDetails(cluster_uuid, sys_serial_number, hostname) {
    let host = {};
    this.clusters.forEach(c => {
      //cluster level
      if (c['cluster_uuid'] === cluster_uuid) {
        c['systems'].forEach(s => {
          if (s['sys_serial_number'] == sys_serial_number) {
            s['hosts'].forEach(h => {
              if (h['hostname'] === hostname) {
                host = h;
                host['cluster_name'] = c['cluster_name'];
                host['sys_serial_number'] = s['sys_serial_number'];
                host['sys_model'] = s['sys_model'];
                host['recomendations'] = s['recomendations'];
                host['parts'] = s['parts'];
                return;
              }
            });
          }
        });
      }
    });
    return host;
  }

  updateReview(data) {
    const host = this.getReportDetails(data.uuid, data.serial, data.hostname);
    host['aggregates'].forEach(a => {
      if (a['aggr_name'] === data.aggr) {
        a['reviewed'] = true;
        return;
      }
    });
  }
}

module.exports = new DbHandler();
