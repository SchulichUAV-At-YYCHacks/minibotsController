#Minibots Controller

This controller is designed to control a robot with a mobile device over Wi-Fi!

## To run:

These commands tested with node v5.10.0 and npm 3.8.5. (Use *node -v* to find out).

```
git clone https://github.com/Minibots/minibotsController.git

cd minibotsController/

npm install

npm start
```

Then navigate to http://localhost:5005 in your web browser.

## To build an HTML file for uploaded to robot:

The robot requires a single file webpage. The code will be minified and combined into a single HTML file.

Make sure you have run the install command:

```
npm install
```

Then you can create the compressed file by running:
```
node compress.js
```

## Troubleshooting

Note that on some machines, the ``` node ``` command may not work properly. It may be that you have a different version of Node.js installed. Try running ``` nodejs ``` instead.

## Acknowledgments
This project uses jQuery. You can see their license at http://jquery.org/license.
