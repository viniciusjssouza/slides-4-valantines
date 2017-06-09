$( function() {

    this.afterLoad = function() {
        $('#loading').fadeOut(3000);
        this.start();
    }

    var pictures = [],
        $pointer = $( '#pointer' ),
        $thumbnails = $( '#thumbnails' ),
        $title = $( '#title' ),
        $pause = $( '#pause' ),
        $volume = $( '#volume' );

    // Buzz audio library

    buzz.defaults.formats = [ 'mp3' ];

    var music = new buzz.sound( 'sounds/music' );

    if ( !buzz.isSupported() ) {
        $volume.hide();
    }

    // jScrollPane

    $thumbnails.find( 'ul' ).width( function() {
        var totalWidth = 0;
        $( this ).find( 'li' ).each( function() {
            totalWidth += $( this ).outerWidth( true );
        });
        return totalWidth;
    });

    $thumbnails.jScrollPane();

    var jScrollPaneApi = $thumbnails.data( 'jsp' );

    $( window ).bind( 'resize', function() {
        jScrollPaneApi.reinitialise();
    });

    // Vegas Background

    $thumbnails.find( 'a' ).each( function() {
        pictures.push({
            src: $( this ).attr( 'href' ),
            title: $( this ).find( 'img' ).attr( 'title' ),
            valign: $( this ).find( 'img' ).data( 'valign' )
        });
    });

    $thumbnails.find( 'a' ).click( function() {
        var idx = $( this ).parent( 'li' ).index();
        $('#slide-container').vegas( 'jump', idx );
        //$('.jspPane').animate({top:'0px'});
        return false;
    });

    var onChangeSlide = function(index, img) {
        var src = $( img ).attr( 'src' ),
            idx = $( 'a[href="' + src + '"]' ).parent( 'li' ).index();

        var pointerPosition = $thumbnails.find( 'li' ).eq( idx ).position().left;

        $pointer.animate({
            left: pointerPosition
        }, 500, 'easeInOutBack' );

        if ( ( pointerPosition > $thumbnails.width() || pointerPosition < jScrollPaneApi.getContentPositionX() ) && !$thumbnails.is( ':hover' ) ) {
            jScrollPaneApi.scrollToX( pointerPosition, true );
        }

        $pointer.click( function() {
            $thumbnails.find( 'a' ).eq( idx ).click()
        });
    };

    $('#slide-container').vegas({
        slides: pictures,
        delay: 4000,
        animation: 'random',
        autoplay: false,
        loop: true,
        cover: false,
        color: '#000',
        transition: 'random',
        walk: onChangeSlide
     });

    // Volume button
    $volume.click( function() {
        if ( $( this ).hasClass( 'all' ) ) {
            music.mute();
            $( this ).removeClass( 'all' ).addClass( 'none' );
        } else {
            music.unmute();
            $( this ).removeClass( 'none' ).addClass( 'all' );
        }
        return false;
    });

    // Photograph
    $('#slide-container').click( function() {
        $('#slide-container').vegas('pause')

        $pause.show();
        $pointer.hide();

        $volume.animate( { top: '20px' });
        $thumbnails.animate( { top: '-90px' });
        $title.animate( { bottom: '-90px' });

        return false;
    });

    $pause.click( function() {
        $pause.hide();
        $pointer.show();

        $volume.animate( { top:'100px' });
        $title.animate( { bottom:'0px' });
        $thumbnails.animate( { top:'0px' });

        $('#slide-container').vegas('play')

        return false;
    });
    var musicOk = false;
    var minTimeOk = false;

    music.bind("canplay", function () {
        musicOk = true;
    });

    setTimeout(function() {
      minTimeOk = true;
    }, 4000);

    var main = this;
    this.start = function () {
        if (musicOk && minTimeOk) {
            $('#loading').fadeOut(500, function () {
                music.loop().play().fadeIn(5000);
                $('#slide-container').vegas('play');
                $('#r2').fadeIn();
            });
        } else {
            setTimeout(main.start, 500);
        }
    };
    this.start();

});