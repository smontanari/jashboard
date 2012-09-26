steal.dev.log("Loading 3rd party assets");
// 3rd party assets
steal(
  { src: "css/bootstrap.min.css", packaged: false },
  { src: "css/jquery-ui/jquery.ui.all.css", packaged: false },
  'jquery'
).then(
  { src: 'lib/jquery-ui-1.8.23.custom.min.js', packaged: false },
  { src: 'lib/bootstrap.min.js', packaged: false }
);

steal.dev.log("Loading application files");
// application files
steal('steal/less')
.then("css/jashboard.less")
.then('jashboard/init-layout.js');
