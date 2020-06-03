function SwiperCreator() {
    var self = this;
    var configData = null;
    
    /**
     * 데이터를 서버로 부터 가져오는 공통 함수
     * 
     * @param {string} addr 
     * @param {function} success 
     * @param {string} errorMsg 
     */
    function getData( addr, successFunc, errorMsg ) {
        $.ajax({
            url: addr
            , method: "GET"
            , dataType: "json"
            , success: function( data, textStatus, jqXHR ) {
                successFunc( data ); // Ajax를 통해 들어온 데이터를 successFunc 콜백함수에 전달한다.
            }, error: function( jqXHR, textStatus, errorThrown ) {
                alert( errorMsg ); // 통신오류가 발생하면 전달받은 errorMsg를 alert을 통해 표시한다.
            }
        });
    }

    /**
     * 겔러리 목록을 만들어주는 메서드
     * @param {Array} dataList 
     */
    function displaySwiperList( template, dataList, targetSelector ) {
        $.tmpl(template, dataList).each( function( idx, element ){
            $(element).find("> div").css({
                "background-image" : dataList[idx].style
            });
        }).appendTo( targetSelector );
    }

    /**
     * Swiper를 생성해서 swiperList에 넣어주는 함수
     * 
     * @param {string} selector 
     * @param {object} options 
     */
    function createSwiper( selector, options ) {
        var mySwiper = new Swiper(selector, options);
        return mySwiper;
    }

    /**
     * 데이터를 성공적으로 로딩한 뒤 호출되는 콜백 함수
     * @param {object} data 
     */
    function getDataSuccessCallback( data ) {
        var targetSelector = configData.selector + " .swiper-wrapper"
        // jquery 템플릿을 통해 화면에 목록을 붙이는 함수를 호출한다.
        displaySwiperList( configData.name, data.data, targetSelector );

        // 스와이퍼 객체를 생성하고 swiper 변수에 대입한다.
        var swiper = createSwiper( configData.selector, configData.options );
        // 스와이퍼가 생성완료 되었음을 이벤트로 알려준다.
        $(self).trigger( "swiperCreationComplete", swiper ); 
    }

    self.init = function( config ) {
        configData = config

        // Template 등록을 한다.
        $.template( config.name, $( config.template ) );

        // 데이터를 가져와 처리한다.
        getData( config.url, getDataSuccessCallback, config.errorMessage );
    }
}