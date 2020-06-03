var swiperTarget = [
    {
        name : "gallery",
        url: '/data/gallery.json',
        errorMessage: "겔러리 데이터를 가져오는데 실패하였습니다.",
        template: "#galleryTemplate",
        selector: '.gallery-box .swiper-container',
        options: {
            spaceBetween: 20,
            slidesPerView: 3,
            loop: true
        }
    }, {
        name: "update",
        url: '/data/update.json',
        errorMessage: "업데이트 데이터를 가져오는데 실패하였습니다.",
        template: "#updateTemplate",
        selector: '.update-box .swiper-container',
        options: {
            spaceBetween: 20,
            slidesPerView: 2,
            loop: true
        }
    }
];

var swiperList = [];

// HTML 문서의 준비가 완료되면 파라미터로 전달된 function을 실행한다.
$(document).ready(function() {
    configuration(); // 이벤트 등록 메서드
    createSwiper();

    $(document).trigger("scroll"); // 
});

/**
 * 화면 내 객체 또는 엘리먼트에 이벤트를 처리할 수 있도록
 * 설정하는 함수
 */
function configuration() {
    $(window).resize( function() {
        var slidesPerView = 0;

        if( $(window).width() <= 800 && $(window).width() > 600 ) {
            slidesPerView = 2;
        } else if( $(window).width() <= 600 ) {
            slidesPerView = 1;
        } else {
            slidesPerView = 3;
        }

        $( swiperList ).each( function( idx, item ){
            item.params.slidesPerView = slidesPerView;
            item.update();
        });
    });

    $(document).scroll( function() {
        $("#home nav a").each( function( idx, element ){
            var selector = $(element).attr("href");
            var target = $( selector );

            var startPosition = target.offset().top;
            var boxHeight = parseInt( target.css("height").replace("px", "") );
            var endPosition = startPosition + boxHeight;
            var currentPosition = $(document).scrollTop();

            if( currentPosition >= startPosition && currentPosition < endPosition ) {
                $("li a[href='" + selector + "']").addClass("active");
            } else {
                $("li a[href='" + selector + "']").removeClass("active");
            }
        });
    });

    $("#btnMenu").click(function() {
        $(".mobile-nav").toggleClass("active");
    });
}

/**
 * 스와이퍼 만들기
 */
function createSwiper() {
    $(swiperTarget).each( function( idx, data) {
        var creator = new SwiperCreator();
        $(creator).on("swiperCreationComplete", function( event, swiper ){
            swiperList.push( swiper );
        });

        creator.init( data );
    });
}