$( function() {
    var pictures = [],
        $pointer = $( '#pointer' ),
        $thumbnails = $( '#thumbnails' ),
        $title = $( '#title' ),
        $pause = $( '#pause' ),
        $flash = $( '#flash' ),
        $volume = $( '#volume' );

    // Buzz audio library

    buzz.defaults.formats = [ 'mp3' ];

    var music = new buzz.sound( 'sounds/music' );

    if ( !buzz.isSupported() ) {
        $volume.hide();    
    }

    music.loop().play().fadeIn( 5000 );

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

        $flash.show().fadeOut( 1000 );

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
        autoplay: true,
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
});