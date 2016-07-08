#Minibots Controller

This controller is designed to control a robot with a mobile device over Wi-Fi!

## To test it:

These commands tested with node v5.10.0 and npm 3.8.5. (Use *node -v* to find out which version you have).

```
git clone https://github.com/Minibots/minibotsController.git

cd minibotsController/

npm install

npm start
```

Then navigate to http://localhost:5005 in your web browser.

## To build an HTML file for uploaded to robot:

The robot requires a single file webpage. The code will be minified and combined into a single HTML file. To build this, you need to have both Python and Node.js.

Download and install [html-muncher](http://htmlmuncher.com/). This requires Python.

Make sure you have run the install command:

```
npm install
```

Then you can create the compressed file by running:
```
node compress.js
munch --html compressed.html
```

or Unix users can use the bash script ```compress.sh```

Note, the good version is **compressed.opt.html**

## Troubleshooting

Note that on some machines, the ``` node ``` command may not work properly. It may be that you have a different version of Node.js installed. Try running ``` nodejs ``` instead.

## Acknowledgments
This project used jQuery at one point in time. It does not anymore however. You can see their license at http://jquery.org/license.
