buildmypcn
==========

[MeanJS](http://meanjs.org/) application.

Prerequisites:

 - Node.js version 0.10.x
 - Node Package Manager (NPM)
 - MongoDB 2.6

For help installing MongoDB:

 - http://docs.mongodb.org/manual/tutorial/install-mongodb-on-windows/
 - http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/

### Run the App ###

Run the following commands:

          npm install
          npm start

That's all there is to it!

### Explanation ###

MeanJS is a framework for MongoDB, Express, AngularJS, and Node.js.
It scaffolds out the project nicely, brought in all our dependencies,
and has a working build process.

MeanJS has a lot of moving parts, but the system is very modular.

`app/` holds the Node.js Server code which runs Express.
`public/modules` holds our custom AngularJS code. 
`public/lib` holds our third-party JavaScript dependencies (e.g. jQuery)

The build process uses Grunt and Bower.  I configured our NPM scripts to use
local copies of them so you do not need to have them globally installed.

`npm start` runs default Grunt task.
`npm test` runs Grunt test task.
`npm run build` runs Grunt build task (only necessary for production deploys).
`npm run bower` runs Bower install to download third-party client dependencies.

### Troubleshooting ###

If you ever have a problem with outdated libraries used in the client or server,
I recommend destroying the `node_modules/` and `public/lib/` dirs and re-running
`npm install`:

          rm -rf node_modules/
          rm -rf public/lib/
          npm install

I am not a fan of how NPM or Bower handle updates and dependency resolution and
found that just blowing up the directories and re-installing them works 90% of
the time.

Let me know if you have problems!

Good Luck team!

