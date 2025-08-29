;(function () {
    "use strict"
    var animationControllerPlugin = document.getElementById(
        "animation-controller-plugin"
    )
    var controllers = []
    require.config({
        paths: {
            CerosSDK: "//sdk.ceros.com/standalone-player-sdk-v5.min",
        },
    })
    require(["CerosSDK"], function (CerosSDK) {
        CerosSDK.findExperience()
            .fail(function (error) {
                console.error(error)
            })
            .done(function (experience) {
                window.myExperience = experience
                var animationControllers = experience.findLayersByTag(
                    "animation-controller"
                ).layers
                function pageChangedCallback() {
                    controllers = []
                    for (let i = 0; i < animationControllers.length; i++) {
                        let mainGroup = document.getElementById(
                            animationControllers[i].id
                        )
                        if (!mainGroup) continue
                        controllers.push({
                            object: animationControllers[i],
                            node: mainGroup,
                        })
                        let hotspots = Array.from(
                            mainGroup.querySelectorAll(".hotspot")
                        )
                        for (let hots of hotspots) {
                            hots.addEventListener("pointerenter", function () {
                                controllAnimation(i)
                            })
                            hots.addEventListener("pointerup", function () {
                                controllAnimation(i, false)
                            })
                            hots.addEventListener("pointerleave", function () {
                                controllAnimation(i, false)
                            })
                            hots.addEventListener("pointerout", function () {
                                controllAnimation(i, false)
                            })
                            hots.addEventListener("pointercancel", function () {
                                controllAnimation(i, false)
                            })
                        }
                    }
                }
                const controllAnimation = (num, isSequenceRunning = true) => {
                    if (!animationControllers[num]) return
                    for (let cont of controllers) {
                        if (
                            cont.object.payload ===
                            animationControllers[num].payload
                        ) {
                            let classesArray = Array.from(cont.node.classList)
                            let isSequenceActive = classesArray.some((clas) =>
                                clas.includes("sequenceRun")
                            )
                            if (isSequenceActive) {
                                if (isSequenceRunning) {
                                    cont.node.classList.add("pause-animation")
                                } else {
                                    cont.node.classList.remove(
                                        "pause-animation"
                                    )
                                }
                            }
                        }
                    }
                }
                experience.on(CerosSDK.EVENTS.PAGE_CHANGED, pageChangedCallback)
                pageChangedCallback()
            })
    })
})()
