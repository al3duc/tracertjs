const { exec } = require("child_process");
var geoip = require('geoip-lite');    

function tracert(host, callback) {
  
  var isWin = process.platform === "win32";
  
    if(isWin) {
        exec(`tracert ${host}`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            
            var lines= stdout.split("\r\n").filter(line => line!='');
            var hosts=[];

            for (let i = 2; i < lines.length-1; i++) {
                const line = lines[i].split("  ");
                var host=(line[line.length-1]).trim().split(" "); 
        
                for (let j = 0; j < host.length; j++) {
                    host[j] = host[j].replace('\[','').replace('\]','');            
                } 
                
                hosts.push(
                    {
                        index: parseInt(line[1]), 
                        host: host,
                        geo_info: geoip.lookup(host[host.length-1])
                    });    
            }
            callback(hosts);
        });
    } else {
        exec(`traceroute ${host}`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            
            var lines= stdout.split("\r\n").filter(line => line!='');
            var hosts=[];

            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].split("  ");
                var host=(line[2]).trim().replace('\(','').replace('\)','');
        
                hosts.push(
                    {
                        index: parseInt(line[0]), 
                        host: host,
                        geo_info: geoip.lookup(host)
                    });    
            }
            callback(hosts);
        });
    }


}

tracert('www.google.com', function(hosts){
    console.log(JSON.stringify(hosts));
});