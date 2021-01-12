const versions: {[key: string]: string} = {
  '8.3.0.202004': 'https://gcc-renesas.com/downloads/get.php?f=rx/8.3.0.202004-gnurx/gcc-8.3.0.202004-GNURX-ELF.${EXT}',
}

export function availableVersions(): string[] {
  return Object.keys(versions)
}

// Version must have the form major[._minor]-YYYY-qZ
export function distributionUrl(version: string, platform: string): string {
  let ext: string

  switch (platform) {
    case 'linux':
      ext = 'run'
      break
    default:
      throw new Error(`platform ${platform} is not supported`)
  }

  const url = versions[version]
  if (!url) {
    throw new Error(`gcc version ${version} is not supported`)
  }

  return url.replace(/\$\{(.*?)\}/g, (_, p1) => {
    switch (p1) {
      case 'EXT':
        return ext
    }
    throw new Error(`unknown replacement ${p1}`)
  })
}
