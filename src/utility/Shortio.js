const shortioURL = process.env.NEXT_PUBLIC_SHORTIO_API_URL
const PUBLIC_API_KEY = process.env.NEXT_PUBLIC_SHORTIO_API_KEY
const DOMAIN = process.env.NEXT_PUBLIC_SHORTIO_DOMAIN

export const createShortLink = async (originalLink) => {
  try {
    const data = {
      domain: DOMAIN,
      originalURL: originalLink
    }
    const result = await fetch(shortioURL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: PUBLIC_API_KEY
      },
      body: JSON.stringify(data)
    })

    return (await result.json()).shortURL
  } catch (err) {
    console.log("Can't create short link", err)
    return originalLink
  }
}
