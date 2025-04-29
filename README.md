## Getting Started

- Copy env-sample to `.env`
- Provide `BROWSERLESS_TOKEN` at `.env` file
- Install dependency
`yarn install`
- Run developer mode
`yarn dev`

## Test

### UI
- Open your browser and go to localhost:3000 or vercel deployment URL below

### API
- Test with API tool like Postman or similar
- Available endpoint
  - URL: ~/api/webpage 
  - Method: [POST]
  - Body: `{"url": string}`

## Stack
- [Next.Js](https://nextjs.org/)
- [Browserless](https://www.browserless.io/)
- [Puppetteer](http://pptr.dev/)
- [Tailwind](https://tailwindcss.com/) 
- [Yup](https://github.com/jquense/yup)
- [Vercel](https://vercel.com/)

## Vercel Deployment

[https://pdf-generator-puce-mu.vercel.app/](https://pdf-generator-puce-mu.vercel.app/)
It is using free tier plan so it would only has 1 concurrency.