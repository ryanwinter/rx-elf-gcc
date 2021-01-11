import * as fs from 'fs'
import * as path from 'path'

import fetch from 'node-fetch'
import tmp from 'tmp'

import * as gcc from '../src/gcc'
import * as setup from '../src/setup'

test('count gcc versions', () => {
  expect(gcc.availableVersions().length).toBeGreaterThan(0)
})

test('test url', () => {
  expect(gcc.distributionUrl('8.3.0.202004', 'linux')).toStrictEqual(
    'https://gcc-renesas.com/downloads/get.php?f=rx/8.3.0.202004-gnurx/gcc-8.3.0.202004-GNURX-ELF.run'
  )
})

test('test url response', async () => {
  const url = gcc.distributionUrl('8.3.0.202004', 'linux')
  const resp = await fetch(url)
  expect(resp.status).toStrictEqual(200)
  expect(Number(resp.headers.get('Content-Length'))).toEqual(104170189)
})

function hasGcc(dir: string): boolean {
  for (const filename of ['rx-elf-gcc', 'rx-elf-gcc.exe']) {
    const exe = path.join(dir, 'rx-elf', 'rx-elf', 'bin', filename))
    if (fs.existsSync(exe)) {
      console.log(`bin exists`)
      return true
    
    }
  }
  return false
}

async function tmpInstall(release: string, platform?: string): Promise<void> {
  const dir = tmp.dirSync()
  const gccDir = path.join(dir.name, `gcc-${release}`)
  await setup.install(release, gccDir, platform)
  // make sure there's a bin/arm-none-eabi-gcc[.exe] at gccDir
  expect(hasGcc(gccDir)).toEqual(true)
  dir.removeCallback()
}

test(
  'install',
  async () => {
    await tmpInstall('8.3.0.202004', 'linux')
  },
  40 * 60 * 1000
)
