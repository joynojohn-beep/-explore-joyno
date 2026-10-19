import {spawnSync} from 'node:child_process';

// Normalize the legacy cache-dir setting before npm reads its environment.
// Keep npm's actual cache setting and all unrelated configuration intact.
const env={...process.env};
for(const key of Object.keys(env)){
 if(/^npm_config_cache[-_]dir$/i.test(key)){
  if(!Object.keys(env).some(name=>/^npm_config_cache$/i.test(name))&&env[key])env.npm_config_cache=env[key];
  delete env[key];
 }
}
const args=process.argv.slice(2);
if(!((args.length===1&&args[0]==='ci')||(args.length===2&&args[0]==='run'&&args[1]==='build')))throw new Error('Expected ci or run build');
const result=spawnSync(process.platform==='win32'?'npm.cmd':'npm',args,{env,stdio:'inherit',shell:process.platform==='win32'});
if(result.error){console.error(result.error.message);process.exit(1)}
process.exit(result.status??1);
