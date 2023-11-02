import { Parser } from 'xml2js'

interface Url {
  loc: string[]
}

async function run(): Promise<void> {
  const res = await fetch('https://heybeluga.com/sitemap-0.xml')
  const sitemap = await res.text()
  const parser = new Parser()

  parser.parseString(sitemap, async (err, result) => {
    if (err != null) {
      throw err
    }

    const locs = result.urlset.url.map((url: Url) => url.loc[0])
    let i = 0
    let maxLength = 0
    for (const loc of locs) {
      await fetch(loc)
      const logline = `Fetched URL ${++i} of ${locs.length}: ${loc}`
      maxLength = Math.max(maxLength, logline.length)
      process.stdout.write(
        logline + ' '.repeat(maxLength - logline.length) + '\r'
      )
    }
  })
}

void run()
