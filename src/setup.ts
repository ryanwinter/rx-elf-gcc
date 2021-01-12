/* eslint-disable no-console */
import * as fs from 'fs'
import * as url from 'url'
import * as path from 'path'
import fetch from 'node-fetch'
import * as child from 'child_process'
import * as gcc from '../src/gcc'

function getExtension(s: string): string {
  const u = url.parse(s)
  const components = u.path?.split('.')

  if (components && components?.length > 0) {
    return components[components?.length - 1].toLowerCase()
  }

  return ''
}

function getFileName(s: string): string {
  const u = url.parse(s)
  const components = u.path?.split('/')

  if (components && components?.length > 0) {
    return components[components?.length - 1]
  }

  return ''
}

export async function install(release: string, directory: string, platform?: string): Promise<void> {
  const distUrl = gcc.distributionUrl(release, platform || process.platform)
  const filePath = path.join(directory, getFileName(distUrl))

  console.log(`downloading gcc ${release} from ${distUrl}`)

  await fs.promises.mkdir(directory, {recursive: true})

  const res = await fetch(distUrl)
  const fileStream = fs.createWriteStream(filePath)
  await new Promise((resolve, reject) => {
    res.body.pipe(fileStream)
    res.body.on('error', reject)
    fileStream.on('finish', resolve)
  })

  fs.chmodSync(filePath, '755')

  switch (getExtension(distUrl)) {
    case 'run':
      console.log('executing', filePath)
      child.execSync(`${filePath} -y -p ${directory}`)
      break
    default:
      throw new Error(`unknown extension ${getExtension(distUrl)}`)
  }
}
