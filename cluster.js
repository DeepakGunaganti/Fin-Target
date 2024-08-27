const cluster = require("cluster")
const numCpus = require("os").cpus().length;

if(cluster.isMaster){
    const numCpus = 2;
  console.log(`Master ${process.pid} is running`);
  for(let i = 0; i < numCpus; i++){
    cluster.fork()
  }
  cluster.on('exit', (worker, code, signal)=>{
     console.log(`worker ${worker.process.pid} died`)
     cluster.fork()
  })
} else{
    require('./server');
    console.log(`worker ${process.pid} started`)
}