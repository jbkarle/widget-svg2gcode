/* global requirejs cprequire cpdefine chilipeppr THREE */
// Defining the globals above helps Cloud9 not show warnings for those variables

// ChiliPeppr Widget/Element Javascript

requirejs.config({
    /*
    Dependencies can be defined here. ChiliPeppr uses require.js so
    please refer to http://requirejs.org/docs/api.html for info.
    
    Most widgets will not need to define Javascript dependencies.
    
    Make sure all URLs are https and http accessible. Try to use URLs
    that start with // rather than http:// or https:// so they simply
    use whatever method the main page uses.
    
    Also, please make sure you are not loading dependencies from different
    URLs that other widgets may already load like jquery, bootstrap,
    three.js, etc.
    
    You may slingshot content through ChiliPeppr's proxy URL if you desire
    to enable SSL for non-SSL URL's. ChiliPeppr's SSL URL is
    https://i2dcui.appspot.com which is the SSL equivalent for
    http://chilipeppr.com
    */
    paths: {
        // Example of how to define the key (you make up the key) and the URL
        // Make sure you DO NOT put the .js at the end of the URL
        // SmoothieCharts: '//smoothiecharts.org/smoothie',
    },
    shim: {
        // See require.js docs for how to define dependencies that
        // should be loaded before your script/widget.
    }
});

cprequire_test(["inline:com-zipwhip-widget-font2gcode"], function(myWidget) {

    // Test this element. This code is auto-removed by the chilipeppr.load()
    // when using this widget in production. So use the cpquire_test to do things
    // you only want to have happen during testing, like loading other widgets or
    // doing unit tests. Don't remove end_test at the end or auto-remove will fail.

    // Please note that if you are working on multiple widgets at the same time
    // you may need to use the ?forcerefresh=true technique in the URL of
    // your test widget to force the underlying chilipeppr.load() statements
    // to referesh the cache. For example, if you are working on an Add-On
    // widget to the Eagle BRD widget, but also working on the Eagle BRD widget
    // at the same time you will have to make ample use of this technique to
    // get changes to load correctly. If you keep wondering why you're not seeing
    // your changes, try ?forcerefresh=true as a get parameter in your URL.

    console.log("test running of " + myWidget.id);

    
    
    // load 3dviewer
    // have to tweak our own widget to get it above the 3dviewer
    $('#' + myWidget.id).css('position', 'relative');
    //$('#' + myWidget.id).css('background', 'none');
    $('#' + myWidget.id).css('width', '320px');
    $('body').prepend('<div id="3dviewer"></div>');
    chilipeppr.load(
      "#3dviewer",
      "http://raw.githubusercontent.com/chilipeppr/widget-3dviewer/master/auto-generated-widget.html",
      function() {
        cprequire(['inline:com-chilipeppr-widget-3dviewer'], function (threed) {
            threed.init({
                doMyOwnDragDrop: false
            });
            
            // hide toolbar for room
            $('#com-chilipeppr-widget-3dviewer .panel-heading').addClass("hidden");
            
            // only init eagle widget once 3d is loaded
            // init my widget
            myWidget.init();
        });
    });

    // load flash message
    $('body').prepend('<div id="testDivForFlashMessageWidget"></div>');
    chilipeppr.load(
        "#testDivForFlashMessageWidget",
        "http://fiddle.jshell.net/chilipeppr/90698kax/show/light/",
        function() {
            console.log("mycallback got called after loading flash msg module");
            cprequire(["inline:com-chilipeppr-elem-flashmsg"], function(fm) {
                //console.log("inside require of " + fm.id);
                fm.init();
            });
        }
    );
    
    $('#' + myWidget.id).css('margin', '20px');
    $('title').html(myWidget.name);

} /*end_test*/ );

// This is the main definition of your widget. Give it a unique name.
cpdefine("inline:com-zipwhip-widget-font2gcode", ["chilipeppr_ready", /* other dependencies here */ ], function() {
    return {
        /**
         * The ID of the widget. You must define this and make it unique.
         */
        id: "com-zipwhip-widget-font2gcode", // Make the id the same as the cpdefine id
        name: "Widget / Font2Gcode", // The descriptive name of your widget.
        desc: "This widget lets you type text, render it into the 3D viewer, and then generate the gcode for the font. If you want to mill/laser/print text this is a great way to do it programmatically.",
        url: "(auto fill by runme.js)",       // The final URL of the working widget as a single HTML file with CSS and Javascript inlined. You can let runme.js auto fill this if you are using Cloud9.
        fiddleurl: "(auto fill by runme.js)", // The edit URL. This can be auto-filled by runme.js in Cloud9 if you'd like, or just define it on your own to help people know where they can edit/fork your widget
        githuburl: "(auto fill by runme.js)", // The backing github repo
        testurl: "(auto fill by runme.js)",   // The standalone working widget so can view it working by itself
        /**
         * Define pubsub signals below. These are basically ChiliPeppr's event system.
         * ChiliPeppr uses amplify.js's pubsub system so please refer to docs at
         * http://amplifyjs.com/api/pubsub/
         */
        /**
         * Define the publish signals that this widget/element owns or defines so that
         * other widgets know how to subscribe to them and what they do.
         */
        publish: {
            // Define a key:value pair here as strings to document what signals you publish.
            //'/onExampleGenerate': 'Example: Publish this signal when we go to generate gcode.'
        },
        /**
         * Define the subscribe signals that this widget/element owns or defines so that
         * other widgets know how to subscribe to them and what they do.
         */
        subscribe: {
            // Define a key:value pair here as strings to document what signals you subscribe to
            // so other widgets can publish to this widget to have it do something.
            // '/onExampleConsume': 'Example: This widget subscribe to this signal so other widgets can send to us and we'll do something with it.'
        },
        /**
         * Document the foreign publish signals, i.e. signals owned by other widgets
         * or elements, that this widget/element publishes to.
         */
        foreignPublish: {
            // Define a key:value pair here as strings to document what signals you publish to
            // that are owned by foreign/other widgets.
            // '/jsonSend': 'Example: We send Gcode to the serial port widget to do stuff with the CNC controller.'
            "/com-chilipeppr-widget-3dviewer/request3dObject" : "This gives us back the 3d object from the 3d viewer so we can add Three.js objects to it."
        },
        /**
         * Document the foreign subscribe signals, i.e. signals owned by other widgets
         * or elements, that this widget/element subscribes to.
         */
        foreignSubscribe: {
            // Define a key:value pair here as strings to document what signals you subscribe to
            // that are owned by foreign/other widgets.
            // '/com-chilipeppr-elem-dragdrop/ondropped': 'Example: We subscribe to this signal at a higher priority to intercept the signal. We do not let it propagate by returning false.'
            "/com-chilipeppr-widget-3dviewer/recv3dObject" : "By subscribing to this we get the callback when we /request3dObject and thus we can grab the reference to the 3d object from the 3d viewer and do things like addScene() to it with our Three.js objects."
        },
        /**
         * All widgets should have an init method. It should be run by the
         * instantiating code like a workspace or a different widget.
         */
        init: function() {
            console.log("I am being initted. Thanks.");

            this.init3d();
            
            this.setupUiFromLocalStorage();
            this.btnSetup();
            this.forkSetup();

            console.log("I am done being initted.");
        },
        /**
         * Try to get a reference to the 3D viewer.
         */
        init3d: function () {
            this.get3dObj();
            if (this.obj3d == null) {
                console.log("loading 3d scene failed, try again in 1 second");
                var attempts = 1;
                var that = this;
                setTimeout(function () {
                    that.get3dObj();
                    if (that.obj3d == null) {
                        attempts++;
                        setTimeout(function () {
                            that.get3dObj();
                            if (that.obj3d == null) {
                                console.log("giving up on trying to get 3d");
                            } else {
                                console.log("succeeded on getting 3d after attempts:", attempts);
                                that.onInit3dSuccess();
                            }
                        }, 5000);
                    } else {
                        console.log("succeeded on getting 3d after attempts:", attempts);
                        that.onInit3dSuccess();
                    }
                }, 1000);
            } else {
                this.onInit3dSuccess();
            }

        },
        drawText: function() {
            console.log("doing drawText");
            
            var txt = "313-414-7502";
            this.createText(txt, {
                size: 10,
                height: 0
            }, function(txt3d) {
                console.log("text is created. txt3d:", txt3d);
                
            })
        },
        /**
         * Create text in Three.js using the Helvetiker font.
         * Params: createText(text, options)
         *   text - The text you want to render
         *   options - a set of options to tweak the rendering
         *      {
         *        fontName : helvetiker, optimer, gentilis, droid sans, droid serif
                  size: Float. Size of the text.
                  height: Float. Thickness to extrude text. Default is 50.
                  curveSegments: Integer. Number of points on the curves. Default is 12.
                  bevelThickness: Float. How deep into text bevel goes. Default is 10.
                  bevelSize: Float. How far from text outline is bevel. Default is 8.
                  bevelEnabled: Boolean. Turn on bevel. Default is False.
                  material:
                  extrudeMaterial:
                }
        **/
        createText: function(text, options, callback) {
            
            // taken from http://threejs.org/examples/webgl_geometry_text.html
            var fontMap = {

				"helvetiker": 0,
				"optimer": 1,
				"gentilis": 2,
				"droid/droid_sans": 3,
				"droid/droid_serif": 4

			};

			var weightMap = {

				"regular": 0,
				"bold": 1

			};
            
            // figure out defaults and overrides
            var opts = {

                font: null,
                
				size: options.size ? options.size : 20,
				height: options.height ? options.height : 10,
				curveSegments: options.curveSegments ? options.curveSegments : 4,

				bevelThickness: options.bevelThickness ? options.bevelThickness : 2,
				bevelSize: options.bevelSize ? options.bevelSize : 1.5,
				bevelEnabled: options.bevelEnabled ? options.bevelEnabled : false,

				material: 0,
				extrudeMaterial: 1

			}
			console.log("opts:", opts);
            
            var fontOpts = {
                fontName : options.fontName ? options.fontName : "helvetiker",
                fontWeight : options.fontWeight ? options.fontWeight : "bold",
            }
            console.log("fontOpts:", fontOpts);
            
            this.loadFont(fontOpts, function(font) {
                    
                // we have our font loaded, now we can render
                opts.font = font;
                
                var group = new THREE.Group();
    			//group.position.y = 100;
                
    			var textGeo = new THREE.TextGeometry( text, opts );
    
    			textGeo.computeBoundingBox();
    			textGeo.computeVertexNormals();
    
    			// "fix" side normals by removing z-component of normals for side faces
    			// (this doesn't work well for beveled geometry as then we lose nice curvature around z-axis)
    
    			if ( ! bevelEnabled ) {
    
    				var triangleAreaHeuristics = 0.1 * ( height * size );
    
    				for ( var i = 0; i < textGeo.faces.length; i ++ ) {
    
    					var face = textGeo.faces[ i ];
    
    					if ( face.materialIndex == 1 ) {
    
    						for ( var j = 0; j < face.vertexNormals.length; j ++ ) {
    
    							face.vertexNormals[ j ].z = 0;
    							face.vertexNormals[ j ].normalize();
    
    						}
    
    						var va = textGeo.vertices[ face.a ];
    						var vb = textGeo.vertices[ face.b ];
    						var vc = textGeo.vertices[ face.c ];
    
    						var s = THREE.GeometryUtils.triangleArea( va, vb, vc );
    
    						if ( s > triangleAreaHeuristics ) {
    
    							for ( var j = 0; j < face.vertexNormals.length; j ++ ) {
    
    								face.vertexNormals[ j ].copy( face.normal );
    
    							}
    
    						}
    
    					}
    
    				}
    
    			}
    
    			var centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
    
    			textMesh1 = new THREE.Mesh( textGeo, material );
    
    			textMesh1.position.x = centerOffset;
    			textMesh1.position.y = hover;
    			textMesh1.position.z = 0;
    
    			textMesh1.rotation.x = 0;
    			textMesh1.rotation.y = Math.PI * 2;
    
    			group.add( textMesh1 );
    
    			if ( mirror ) {
    
    				textMesh2 = new THREE.Mesh( textGeo, material );
    
    				textMesh2.position.x = centerOffset;
    				textMesh2.position.y = -hover;
    				textMesh2.position.z = height;
    
    				textMesh2.rotation.x = Math.PI;
    				textMesh2.rotation.y = Math.PI * 2;
    
    				group.add( textMesh2 );
    
    			}

                    
            });

		},
		loadFont: function(fontOpts, callback) {

			var loader = new THREE.FontLoader();
			// threejs.org/examples/fonts/helvetiker_bold.typeface.js
			// https://i2dcui.appspot.com/js/three/fonts/
			var url = 'https://i2dcui.appspot.com/js/three/fonts/' + 
			    fontOpts.fontName + '_' + 
			    fontOpts.fontWeight + '.typeface.js';
			loader.load( url, function ( response ) {
				var font = response;
				console.log("loaded font:", font);
				callback(font);
				//refreshText();
			});

		},
		
        /**
         * Pass in vals {
         *   color: 0xff0000, // default 0x999999
         *   text: "asdf",
         *   height: 10, // default 1
         *   size: 5, // default 10
         *   x: 0,
         *   y: 0,
         *   z: 0,
         * }
         */
        makeText: function(vals) {
            var shapes, geom, mat, mesh;
            
            console.log("Do we have the global ThreeHelvetiker font:", ThreeHelvetiker);
            console.log("THREE.FontUtils:", THREE.FontUtils);
            
            if (!THREE.FontUtils) {
                console.error("THREE.FontUtils not defined per bug in r73 of three.js. So not making text.");
                return;
            }
            
            THREE.FontUtils.loadFace(ThreeHelvetiker);
            shapes = THREE.FontUtils.generateShapes( vals.text, {
                font: "helvetiker",
                height: vals.height ? vals.height : 1,
                //weight: "normal",
                size: vals.size ? vals.size : 10
            } );
            geom = new THREE.ShapeGeometry( shapes );
            mat = new THREE.MeshPhongMaterial({
                color: vals.color ? vals.color : 0x999999,
                side: THREE.DoubleSide,
                // transparent: true,
                // opacity: vals.opacity ? vals.opacity : 0.5,
            });
            mesh = new THREE.Mesh( geom, mat );
            
            mesh.position.x = vals.x;
            mesh.position.y = vals.y;
            mesh.position.z = vals.z;
            
            return mesh;
            
        },
                drawtexterator: function() {
            // draw the major components of the beer bot
            var main = new THREE.Object3D();
            
            
            // create base box
            var baseGeo = new THREE.BoxGeometry( 500, 700, 20 );
            // var material = new THREE.MeshNormalMaterial({
            //         color: 0xd78356,
            //         transparent: true,
            //         opacity: 0.99,
            //         side: THREE.SingleSide,
            //         depthWrite: false
            //     });
            var baseMat = new THREE.MeshPhongMaterial({
                    color: 0xd5d3cb,
                    // transparent: true,
                    // opacity: 0.99,
                    // side: THREE.DoubleSide,
                    // shading: THREE.FlatShading,
                    // depthWrite: true
                });
            // var material = new THREE.MeshBasicMaterial({
            //         color: 0xd78356,
            //         transparent: true,
            //         opacity: 0.99,
            //         side: THREE.SingleSide,
            //         depthWrite: false
            //     });
            //var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
            var baseMesh = new THREE.Mesh( baseGeo, baseMat );
            baseMesh.position.setZ(-10);
            //main.add( baseMesh );
            
            // alternate drawing of box as extrude
            var rectLength = 500, rectWidth = 700;
			var rectShape = new THREE.Shape();
			rectShape.moveTo( 0,0 );
			rectShape.lineTo( 0, rectWidth );
			rectShape.lineTo( rectLength, rectWidth );
			rectShape.lineTo( rectLength, 0 );
			rectShape.lineTo( 0, 0 );
			var extrudeSettings = { 
                amount: 30, bevelEnabled: true, bevelSegments: 2, steps: 2, 
                bevelSize: 3, bevelThickness: 3 };
			var geometry = new THREE.ExtrudeGeometry( rectShape, extrudeSettings );

			var rectMesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { 
			    color: color,
			 //   side: THREE.SingleSide
		    } ) );
		    rectMesh.position.setX(-rectLength/2);
		    rectMesh.position.setY(-rectWidth/2);
		    rectMesh.position.setY(rectMesh.position.y + 100);
		    rectMesh.position.setZ(-15);
		    rectMesh.receiveShadow = true;
		    rectMesh.name = "Base Box";
		    main.add(rectMesh);
            
            // draw lazy susan group
            var lazySusanGroup = new THREE.Object3D();
            
            geometry = new THREE.CylinderGeometry( 450 / 2, 450 / 2, 20, 32 );
            var color = 0x938a79;
            var lazySusanMaterial = new THREE.MeshPhongMaterial({
                    color: color,
                    // transparent: true,
                    // opacity: 0.2,
                    // side: THREE.DoubleSide,
                    // polygonOffset: true,
                    // polygonOffsetFactor: 2,
                    // polygonOffsetUnits: 0.5,
                    // depthTest: false,
                    // depthWrite: false
                });
            // var cylinder = new THREE.Mesh( geometry, material );
            // cylinder.rotateX(Math.PI / 2);
            // cylinder.position.setZ(11);
            // cylinder.position.setY(-100);
            //main.add( cylinder );
            
            var shape = new THREE.Shape();
            shape.absellipse(0, 0, 450 / 2, 450 / 2, 0, Math.PI * 2);
            //shape.autoClose = true;
            
            // let's make a circle with 8 segments so we can extract the xy val for each vertex
            var radius = 350 / 2;
            var segments = 8;
            var holeCenterGeometry = new THREE.CircleGeometry( radius, segments );

            for (var hi = 0; hi < 8; hi++) {
                
                var pt = holeCenterGeometry.vertices[hi + 1]
                var hole = new THREE.Path();
                hole.absellipse(pt.x, pt.y, 85/2, 85/2, 0, Math.PI * 2, true);
                shape.holes.push(hole);
            }
            
            // var geometry = new THREE.ShapeGeometry( shape );

// 			var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { 
			 //   color: color, side: THREE.DoubleSide } ) );
// 			mesh.position.set( x, y, z - 125 );
// 			mesh.rotation.set( rx, ry, rz );
// 			mesh.scale.set( s, s, s );
// 			main.add( mesh );
            
            // extruded shape
            var extrudeSettings = { 
                amount: 30, bevelEnabled: true, bevelSegments: 2, steps: 2, 
                bevelSize: 2.5, bevelThickness: 2.5 };
			var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );

			var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { 
			    color: color,
			    depthTest: true, 
                depthWrite: true, 
                polygonOffset: true,
                polygonOffsetFactor: -4
			 //   side: THREE.SingleSide
		    } ) );
// 			mesh.position.set( x, y, z - 75 );
// 			mesh.rotation.set( rx, ry, rz );
// 			mesh.scale.set( s, s, s );
            mesh.position.setZ(40);
            //mesh.position.setY(-100);
            mesh.castShadow = true;
            mesh.name = "Lazy Susan";
			lazySusanGroup.add( mesh );
			
			// Red solo cups
			var redCupGroup = new THREE.Object3D();
			
			var redCupGeo = new THREE.CylinderGeometry( 45, 35, 100, 32 );
			var color = 0x8B0000;
            var redCupMat = new THREE.MeshPhongMaterial({
                    color: color,
                    // transparent: true,
                    // opacity: 0.2,
                    // side: THREE.DoubleSide,
                    // polygonOffset: true,
                    // polygonOffsetFactor: 2,
                    // polygonOffsetUnits: 0.5,
                    // depthTest: false,
                    // depthWrite: false
                });
                
            var ptZero = new THREE.Vector3(0,0,0);
            for(var i in holeCenterGeometry.vertices) {
                if (i == 0 || i == 9) continue;
                var pt = holeCenterGeometry.vertices[i];
                var redCupMesh = new THREE.Mesh( redCupGeo, redCupMat );
                redCupMesh.rotateX(Math.PI / 2);
                redCupMesh.position.set(pt.x, pt.y, 0);
                redCupGroup.add(redCupMesh);
                
                // add cup numbers
                var numMesh = this.makeText(
                    {text:i, height:3, x:pt.x, y:pt.y, z:80, size:30}
                );
                // need to center
                
                numMesh.rotateX(Math.PI / 2);
                
                // create grp cuz i don't know how to apply 2 rotations
                // but the group does it for me
                var numGrp = new THREE.Object3D();
                numGrp.add(numMesh);
                
                //var pt2 = new THREE.Vector2(pt.x, pt.y);
                // computes the angle in radians with respect to the positive x-axis
        		var angleto = Math.atan2( pt.y, pt.x );
        		if ( angleto < 0 ) angleto += 2 * Math.PI;
                //numMesh.rotateZ(angle);
                var pt3 = new THREE.Vector3(pt.x, pt.y, 0);
                pt3.normalize();
                console.log("pt3:", pt3, "ptZero:", ptZero);
                //var v = ptZero;
                //var theta = pt3.dot( v ) / ( Math.sqrt( pt3.lengthSq() * v.lengthSq() ) );
                //var angleto = theta; //pt3.angleTo(ptZero);
                //var angleto = ptZero.angleTo(pt3);
                console.log("angleto:", angleto);
                //numGrp.rotateZ(angleto);
                //numGrp.rotateZ(Math.PI / 2);
                //numGrp.position.set(pt.x, pt.y, 0);
                
                redCupGroup.add(numGrp);
            }
            redCupGroup.position.setZ(70);
            lazySusanGroup.add( redCupGroup );
            
			
			main.add(lazySusanGroup);
			
            // var extrudeSettings = { amount: 18, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
            // var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
            // var lazysusan = new THREE.Mesh( geometry, lazySusanMaterial );
            // lazysusan.position.setZ(10);
            // lazysusan.position.setY(-100);
            //main.add(lazysusan);

            // remove the grid
            this.obj3dmeta.widget.gridTurnOff();
            
            this.mySceneGroup = main;
            this.sceneReAddMySceneGroup();
            this.obj3dmeta.camera.far = 5000;
            this.obj3dmeta.camera.near = 10;
            console.log("texterator three obj:", this.obj3d, "objmeta:", this.obj3dmeta);
            
            chilipeppr.publish('/com-chilipeppr-widget-3dviewer/viewextents' );
            
        },

        onInit3dSuccess: function () {
            console.log("onInit3dSuccess. That means we finally got an object back.");
            this.clear3dViewer();
            
            // open the last file
            //var that = this;
            //setTimeout(function () {
                //that.open();
            //}, 1000);
            //this.drawtexterator();
            this.drawText();
        },
        obj3d: null, // gets the 3dviewer obj stored in here on callback
        obj3dmeta: null, // gets metadata for 3dviewer
        userCallbackForGet3dObj: null,
        get3dObj: function (callback) {
            this.userCallbackForGet3dObj = callback;
            chilipeppr.subscribe("/com-chilipeppr-widget-3dviewer/recv3dObject", this, this.get3dObjCallback);
            chilipeppr.publish("/com-chilipeppr-widget-3dviewer/request3dObject", "");
            chilipeppr.unsubscribe("/com-chilipeppr-widget-3dviewer/recv3dObject", this.get3dObjCallback);
        },
        get3dObjCallback: function (data, meta) {
            console.log("got 3d obj:", data, meta);
            this.obj3d = data;
            this.obj3dmeta = meta;
            if (this.userCallbackForGet3dObj) {
                //setTimeout(this.userCallbackForGet3dObj.bind(this), 200);
                //console.log("going to call callback after getting back the new 3dobj. this.userCallbackForGet3dObj:", this.userCallbackForGet3dObj);
                this.userCallbackForGet3dObj();
                this.userCallbackForGet3dObj = null;
            }
        },
        is3dViewerReady: false,
        clear3dViewer: function () {
            console.log("clearing 3d viewer");
            chilipeppr.publish("/com-chilipeppr-widget-3dviewer/sceneclear");
            //if (this.obj3d) this.obj3d.children = [];            
            /*
            this.obj3d.children.forEach(function(obj3d) {
                chilipeppr.publish("/com-chilipeppr-widget-3dviewer/sceneremove", obj3d);
            });
            */
            this.is3dViewerReady = true;
            
            // this should reset the 3d viewer to resize to high dpi displays
            $(window).trigger("resize");
        },
        mySceneGroup: null,
        sceneReAddMySceneGroup: function() {
            if (this.obj3d && this.mySceneGroup) {
                this.obj3d.add(this.mySceneGroup);
            }
            this.obj3dmeta.widget.wakeAnimate();
        },
        sceneRemoveMySceneGroup: function() {
            if (this.obj3d && this.mySceneGroup) {
                this.obj3d.remove(this.mySceneGroup);
            }
            this.obj3dmeta.widget.wakeAnimate();
        },
        /**
         * Call this method from init to setup all the buttons when this widget
         * is first loaded. This basically attaches click events to your 
         * buttons. It also turns on all the bootstrap popovers by scanning
         * the entire DOM of the widget.
         */
        btnSetup: function() {

            // Chevron hide/show body
            var that = this;
            $('#' + this.id + ' .hidebody').click(function(evt) {
                console.log("hide/unhide body");
                if ($('#' + that.id + ' .panel-body').hasClass('hidden')) {
                    // it's hidden, unhide
                    that.showBody(evt);
                }
                else {
                    // hide
                    that.hideBody(evt);
                }
            });

            // Ask bootstrap to scan all the buttons in the widget to turn
            // on popover menus
            $('#' + this.id + ' .btn').popover({
                delay: 1000,
                animation: true,
                placement: "auto",
                trigger: "hover",
                container: 'body'
            });

            // Init Say Hello Button on Main Toolbar
            // We are inlining an anonymous method as the callback here
            // as opposed to a full callback method in the Hello Word 2
            // example further below. Notice we have to use "that" so 
            // that the this is set correctly inside the anonymous method
            $('#' + this.id + ' .btn-sayhello').click(function() {
                console.log("saying hello");
                // Make sure popover is immediately hidden
                $('#' + that.id + ' .btn-sayhello').popover("hide");
                // Show a flash msg
                chilipeppr.publish(
                    "/com-chilipeppr-elem-flashmsg/flashmsg",
                    "Hello Title",
                    "Hello World from widget " + that.id,
                    1000
                );
            });

            // Init Hello World 2 button on Tab 1. Notice the use
            // of the slick .bind(this) technique to correctly set "this"
            // when the callback is called
            $('#' + this.id + ' .btn-helloworld2').click(this.onHelloBtnClick.bind(this));

        },
        /**
         * onHelloBtnClick is an example of a button click event callback
         */
        onHelloBtnClick: function(evt) {
            console.log("saying hello 2 from btn in tab 1");
            chilipeppr.publish(
                '/com-chilipeppr-elem-flashmsg/flashmsg',
                "Hello 2 Title",
                "Hello World 2 from Tab 1 from widget " + this.id,
                2000 /* show for 2 second */
            );
        },
        /**
         * User options are available in this property for reference by your
         * methods. If any change is made on these options, please call
         * saveOptionsLocalStorage()
         */
        options: null,
        /**
         * Call this method on init to setup the UI by reading the user's
         * stored settings from localStorage and then adjust the UI to reflect
         * what the user wants.
         */
        setupUiFromLocalStorage: function() {

            // Read vals from localStorage. Make sure to use a unique
            // key specific to this widget so as not to overwrite other
            // widgets' options. By using this.id as the prefix of the
            // key we're safe that this will be unique.

            // Feel free to add your own keys inside the options 
            // object for your own items

            var options = localStorage.getItem(this.id + '-options');

            if (options) {
                options = $.parseJSON(options);
                console.log("just evaled options: ", options);
            }
            else {
                options = {
                    showBody: true,
                    tabShowing: 1,
                    customParam1: null,
                    customParam2: 1.0
                };
            }

            this.options = options;
            console.log("options:", options);

            // show/hide body
            if (options.showBody) {
                this.showBody();
            }
            else {
                this.hideBody();
            }

        },
        /**
         * When a user changes a value that is stored as an option setting, you
         * should call this method immediately so that on next load the value
         * is correctly set.
         */
        saveOptionsLocalStorage: function() {
            // You can add your own values to this.options to store them
            // along with some of the normal stuff like showBody
            var options = this.options;

            var optionsStr = JSON.stringify(options);
            console.log("saving options:", options, "json.stringify:", optionsStr);
            // store settings to localStorage
            localStorage.setItem(this.id + '-options', optionsStr);
        },
        /**
         * Show the body of the panel.
         * @param {jquery_event} evt - If you pass the event parameter in, we 
         * know it was clicked by the user and thus we store it for the next 
         * load so we can reset the user's preference. If you don't pass this 
         * value in we don't store the preference because it was likely code 
         * that sent in the param.
         */
        showBody: function(evt) {
            $('#' + this.id + ' .panel-body').removeClass('hidden');
            $('#' + this.id + ' .panel-footer').removeClass('hidden');
            $('#' + this.id + ' .hidebody span').addClass('glyphicon-chevron-up');
            $('#' + this.id + ' .hidebody span').removeClass('glyphicon-chevron-down');
            if (!(evt == null)) {
                this.options.showBody = true;
                this.saveOptionsLocalStorage();
            }
        },
        /**
         * Hide the body of the panel.
         * @param {jquery_event} evt - If you pass the event parameter in, we 
         * know it was clicked by the user and thus we store it for the next 
         * load so we can reset the user's preference. If you don't pass this 
         * value in we don't store the preference because it was likely code 
         * that sent in the param.
         */
        hideBody: function(evt) {
            $('#' + this.id + ' .panel-body').addClass('hidden');
            $('#' + this.id + ' .panel-footer').addClass('hidden');
            $('#' + this.id + ' .hidebody span').removeClass('glyphicon-chevron-up');
            $('#' + this.id + ' .hidebody span').addClass('glyphicon-chevron-down');
            if (!(evt == null)) {
                this.options.showBody = false;
                this.saveOptionsLocalStorage();
            }
        },
        /**
         * This method loads the pubsubviewer widget which attaches to our 
         * upper right corner triangle menu and generates 3 menu items like
         * Pubsub Viewer, View Standalone, and Fork Widget. It also enables
         * the modal dialog that shows the documentation for this widget.
         * 
         * By using chilipeppr.load() we can ensure that the pubsubviewer widget
         * is only loaded and inlined once into the final ChiliPeppr workspace.
         * We are given back a reference to the instantiated singleton so its
         * not instantiated more than once. Then we call it's attachTo method
         * which creates the full pulldown menu for us and attaches the click
         * events.
         */
        forkSetup: function() {
            var topCssSelector = '#' + this.id;

            $(topCssSelector + ' .panel-title').popover({
                title: this.name,
                content: this.desc,
                html: true,
                delay: 1000,
                animation: true,
                trigger: 'hover',
                placement: 'auto'
            });

            var that = this;
            chilipeppr.load("http://fiddle.jshell.net/chilipeppr/zMbL9/show/light/", function() {
                require(['inline:com-chilipeppr-elem-pubsubviewer'], function(pubsubviewer) {
                    pubsubviewer.attachTo($(topCssSelector + ' .panel-heading .dropdown-menu'), that);
                });
            });

        },

    }
});