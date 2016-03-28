# How can I tell how large a Node module is, though?

That's what [amjith](https://github.com/amjith) kept asking me and I didn't have a good answer.

## So here is a questionably unreliable way to find out.

This package is a work in progress and comes with the beginning of a server to make an easy web-based service. For right now you can clone this repo, `npm i` inside of it, then use its npm scripts.

## Which script

There's really only the one.

## Yeah, but which one?

`npm run size` is the one. You'll need to pass a package name to the script with the `--` argument. So if you'd like to know how big classnames is you could go `npm run size -- --package=classnames`

## What do I get?

The script will pull down the specified package, build it with browserify and webpack, then compare the bytes of each. Pretty neat.

## That's what it does, but not really what I "get"

Easy, there, Nerdmeier. The script will give you a handy little object like:

```javascript
{ name: 'classnames',
  version: '2.2.3',
  license: 'MIT',
  webpack: '3.05 kB',
  browserify: '1.69 kB' }
```

## What's next?

Letting people execute arbitrary scripts on my server. I mean, building a little UI that'll let folks use the script from anywhere on the Internet they want. Especially the former Soviet states.
