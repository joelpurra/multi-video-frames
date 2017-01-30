(function(window, $) {
    $.fn.extend({
        scrollToTop: function() {
            $("html, body").animate({
                scrollTop: Math.max(0, $(this).offset().top),
            });
        },
    });

    $(function() {
        function addUrlInput() {
            var $urlInput = $("<input />", {
                "type": "url",
                "placeholder": "https://... -- copy and paste URL here",
            })
                .data("random", getRandom())
                .appendTo($controls);

            return $urlInput;
        }

        function getRandom() {
            return Math.floor(Math.random() * 100000) + 100000;
        }

        function addVideoPanel($urlInput) {
            var $videoPanel = $("<iframe />").addClass("videoPanel")
            .data("$urlInput", $urlInput)
            .appendTo($videos);

            $urlInput.data("$videoPanel", $videoPanel).focus();
            setVideoSizes();

            return $videoPanel;
        }

        function updateVideoPanels() {
            var $videoPanels = $videos.find(".videoPanel"),
                videoPanelCount = $videoPanels.length,

                // TODO: make horizontal/vertical video panel count a setting.
                videoPanelsHorizontalMax = 3,
                videoPanelsVerticalMax = 3,
                videoPanelsHorizontal = Math.min(Math.ceil(Math.sqrt(videoPanelCount)), videoPanelsHorizontalMax),
                videoPanelsVertical = videoPanelsHorizontal === 0 ? 0 : Math.min(Math.ceil(videoPanelCount / videoPanelsHorizontal), videoPanelsVerticalMax);

            // Clear all classes.
            $controls
                .attr("class", "")
                .addClass("urlInputs-" + videoPanelsHorizontal)
                .scrollToTop();

            // Clear all classes.
            $videos
                .attr("class", "")
                .addClass("videoPanelsHorizontal-" + videoPanelsHorizontal)
                .addClass("videoPanelsVertical-" + videoPanelsVertical);
        }

        function setVideoSizes() {
            updateVideoPanels();
        }
        var $window = $(window),
            $controls = $("#controls"),
            $addUrl = $("#addUrl"),
            $videos = $("#videos"),
            loaded = [];

        $controls.scrollToTop();

        updateVideoPanels();

        $addUrl.click(function(evt) {
            var $target = $(evt.target),
                $urlInput = addUrlInput(),
                $videoPanel = addVideoPanel($urlInput);
        });

        $window.on("change", function(evt) {
            var $target = $(evt.target),
                random = $target.data("random"),
                url = $target.val(),
                $videoPanel = $target.data("$videoPanel");

            $videos.scrollToTop();

            $videoPanel.attr("src", url);
        });
    });
}(window, window.jQuery));
