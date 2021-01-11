/* eslint-disable no-console */
import * as fs from 'fs'
import * as url from 'url'
import * as path from 'path'
import fetch from 'node-fetch'
import { execSync } from 'child_process';

import * as gcc from '../src/gcc'

function getExtension(s: string): string {
  return s.split('.').pop().toLowerCase()
}

function getFileName(s: string): string {
  return s.split('\\').pop().split('/').pop();
}

export async function install(release: string, directory: string, platform?: string): Promise<void> {
  const distUrl = gcc.distributionUrl(release, platform || process.platform)
  
  console.log(`downloading gcc ${release} from ${distUrl}`)
  const res = await fetch(distUrl)
  const fileStream = fs.createWriteStream(directory);
  await new Promise((resolve, reject) => {
    res.body.pipe(fileStream);
    res.body.on("error", reject);
    fileStream.on("finish", resolve);
  });

//  if (resp.status !== 200) {
//    throw new Error(`invalid HTTP response code ${resp.status}`)
  //}

//  console.log(`extracting to ${directory}`)
//  await fs.promises.mkdir(directory, {recursive: true})
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
//  let extractor: any
  switch (getExtension(distUrl)) {
    case 'run':
      const consolepath = path.join(directory, getFileName(distUrl))
      console.log(`executing ${consolepath}`)
      execSync(path.join(directory, getFileName(distUrl)))
      // stderr is sent to stderr of parent process
      // you can set options.stdio if you want it to go elsewhere
  //    let stdout = execSync('ls'); 
//      extractor = unzipper.Extract({path: directory})
//      resp.body.pipe(extractor)
      break
    default:
      throw new Error(`unknown extension ${getExtension(distUrl)}`)
  }

/*  await new Promise(function(resolve, reject) {
    // unzipper
    extractor.on('close', resolve)
    // tar
    extractor.on('end', resolve)
    extractor.on('error', reject)
  })*/
}
