// TODO: process.env doesn't work with fastify, I should use fastify-env instead

export function initEnvVars() {
  return {
    NODE_ENV: process.env.NODE_ENV || "development",
    DB_NAME: process.env.DB_NAME || "youwise",
    DB_HOST: process.env.DB_HOST || "localhost",
    DB_USER: process.env.DB_USER || "postgres",
    DB_PASSWORD: process.env.DB_PASSWORD || "postgres",
    DB_PORT: Number(process.env.DB_PORT) || 5432,
    JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY || JWT_PRIVATE_KEY,
    JWT_PUBLIC_KEY: process.env.JWT_PUBLIC_KEY || JWT_PUBLIC_KEY,
    NATIVE_GOOGLE_ID_CLIENT:
      process.env.NATIVE_GOOGLE_ID_CLIENT || NATIVE_GOOGLE_ID_CLIENT,
  };
}

export type EnvVars = ReturnType<typeof initEnvVars>;

const NATIVE_GOOGLE_ID_CLIENT =
  "835524820983-nlqq9pme2t88rtjft5v2tu2c3j99d52o.apps.googleusercontent.com";

const JWT_PRIVATE_KEY =
  "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC0liTOKzXHqrP9\n2hKKgbITN4ZYkAzoc9C1q5kaXwnjx3FQz21QfRWXQY3fbVmVbaxetEeicmnW6O3h\nsILRKi73gsFiShYYXls3r2UF9+E1h3uPY3goNckduGG6I09Ragt/Oh5QoQ5kxEh9\nPg8CpBOkeen7ZtQJfZszCgYYfnaQ0tR5keHRO/KeV9WWE2G9R8WkFPywHIEHSRPK\nsj7F0LWA3lqpTBPSMv5RENPFEvFHJpDgDiwSSn3hZ3ihrrqt/2NDQRSzQU/WxUCu\nE9+uqXEBqe/owM93xTMHgkjLgMhm1DmYvTfUIcjvnJ+68BZfwpYWWVa0YoJ2plWH\nTGZMPpJ9AgMBAAECggEAEktcnqtHdzsOoXKoarIxZ1t6Z3nuaNUkyWbBK6gBoTr4\n+pIM9bi6SXi5Ze9WwjnaWrzCPg1/tecihDjkw8pVeDsdmra9LspOTOGepyBhxxG6\n3X+a8l3iijl94wTFOg73a7PoUsxCIEi3PELfc+nJ2KGGJ/MWm4CHSsAi9nPHUKvz\nHp8WbRvZhNTNce9/aJiW1lS6gW/HexA8OioeIYqZDXIObVhEdoNR2KbddrDllHA/\noDPGVa+ya/3wtScMztJXPWuY9BDIatdT+pe72vYIg3Lp14QWPk/AGRLGPN4pxRZc\ndXPxAopadBQsSp1FI34xJTWUNJYpbASO5aRu/OVVEQKBgQD3Y1nx+f8UwVYAchC1\nj2w9KwGItonyO3BUn6oPH2pDi6fHZi3ffyWKsjeWOCVyrjYlRx2VDm1NiNDwHABg\nhelyhzv0ohjc1ezGed7fnL/W/P0UMFxcJAsPBG8cF2gvugJN5gnZdePk+Pk6BXwi\n4Khr+latiTGPLyRCSTY+S9okcQKBgQC633oDyYnwuJroupfwVmH4Wo3pZg5Bwycs\nXq1ySGA7zPkeJ2pxLaZDwsH8M4GRemrBKSmPC2uXVCZDJtiQ0Xyv2/ZhqJP66GjH\ntbArAc8X9fy7FUrY5O3mP3tZD0WKbXuEz8mNBlLnt0MrdHq305we7mWHPYzatell\naaoNYiekzQKBgAybl53pa8KXB9cF+SwHnzCO3IknJGif9t2ZNYWHyFag63ASGQxm\n4nbrFkIlomLx1fiYYz2ReqiU7HEQPESvDnKzya5yBGpczLBgzab/yhce1ZcNz+cy\nPw4I39DCsKCeDjgCHUZj57Vnquv2E5mDcZHvNDOr5kax1Fs8d/M80mVBAoGBAK5K\n4x2HKs3HEEyCRFYX63Zc10FaO2/gmbfLclBF6uO7sJoMPz3iStGmY5FbZLyQBeO1\nBZryFt5k0O8O2yxvBrFrIehB+AssGxYxgmcKX+JEPv0qxc13798xVFVjZgPPS0Y7\nGwwaWtbd2Zs9H3w2tMUwqqcxpB8VTeOVYtLqunj9AoGBAI4XeJGtlVZNJ5mtVUOu\nH3ma/jhpbTAWxR1anVKTCEHYyrJ9Nm1xXj+KaPyeL7Q5nowL1zdXIYWycO+6szPG\nIOqjM7tl03+rIq+tQYWHzZ2c1WMNxh4EBDyldRYji3HNQVPPp/1GJwidUGXuH9XS\ngtpUobVGVMtgR8rjVui0S6zh\n-----END PRIVATE KEY-----\n";

const JWT_PUBLIC_KEY =
  "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtJYkzis1x6qz/doSioGy\nEzeGWJAM6HPQtauZGl8J48dxUM9tUH0Vl0GN321ZlW2sXrRHonJp1ujt4bCC0Sou\n94LBYkoWGF5bN69lBffhNYd7j2N4KDXJHbhhuiNPUWoLfzoeUKEOZMRIfT4PAqQT\npHnp+2bUCX2bMwoGGH52kNLUeZHh0TvynlfVlhNhvUfFpBT8sByBB0kTyrI+xdC1\ngN5aqUwT0jL+URDTxRLxRyaQ4A4sEkp94Wd4oa66rf9jQ0EUs0FP1sVArhPfrqlx\nAanv6MDPd8UzB4JIy4DIZtQ5mL031CHI75yfuvAWX8KWFllWtGKCdqZVh0xmTD6S\nfQIDAQAB\n-----END PUBLIC KEY-----\n";
