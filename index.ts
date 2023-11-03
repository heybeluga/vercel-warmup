import { Parser } from 'xml2js'

const BATCH_SIZE = 10 // How many URLs to fetch in parallel

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
    let j = 0
    let maxLength = 0
    for (let i = 0; i < locs.length; i += BATCH_SIZE) {
      await Promise.all(
        locs.slice(i, i + BATCH_SIZE).map(async (loc: string) => {
          await fetch(loc)
          const logline = `Fetched URL ${++j} of ${locs.length}: ${loc}`
          maxLength = Math.max(maxLength, logline.length)
          process.stdout.write(
            logline + ' '.repeat(maxLength - logline.length) + '\r'
          )
        })
      )
    }
  })
}

void run()
