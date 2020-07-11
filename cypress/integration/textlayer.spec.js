describe("TextLayer", () => {

    // it("doesn't propogate click events from text layer to map", () => {
    //     cy.window().then(({ map, L }) => {
    //         let options = {
    //             tooltip: {
    //                 className: "tooltip"
    //             },
    //         };
            
    //         L.textLayer("Stuff", [51.505, -0.09], options)
    //             .addTo(map);

    //         let propogated = false;
    //         map.on("click", () => { propogated = true; });

    //         cy.get(".tooltip")
    //             .click();
    //     });
    // });

    it("doesn't add a classname if none is provided", () => {
        cy.window().then(({ map, L }) => {
            L.textLayer("Stuff", [51.505, -0.09])
                .addTo(map);

            cy.get(".undefined").should("not.exist");
        });
    });

    it("updates text property when editor is updated", () => {
        cy.window().then(({ map, L }) => {
            let options = {
                tooltip: {
                    className: "tooltip"
                },
            };

            let textLayer = L.textLayer("Stuff", [51.505, -0.09], options)
                .addTo(map);

            cy.get(".tooltip")
                .click()
                .type("{backspace}{backspace}{backspace}{backspace}{del}") //clear the original text
                .type("Some other stuff")
                .then(() => {
                    assert.isTrue(textLayer.text == textLayer.editor.getContent());
                });
        });
    });

    it("creates correct geoJson when toGeoJson() is called", () => {
        cy.window().then(({ map, L }) => {
            let textLayer = L.textLayer("geo json layer", [51.505, -0.09]);
            let geoJson = textLayer.toGeoJSON();
            assert.isTrue(geoJson.type == "Feature");
            assert.isTrue(geoJson.geometry.type == "Point");
            assert.isTrue(geoJson.geometry.coordinates[0] == textLayer.getLatLng().lng);
            assert.isTrue(geoJson.geometry.coordinates[1] == textLayer.getLatLng().lat);
            assert.isTrue(geoJson.properties.text == textLayer.text);
        });
    });

    it("creates correct TextLayer from FeatureLayer", () => {
        cy.window().then(({ map, L }) => {
            let marker = L.marker([10,10]);
            marker.feature = marker.toGeoJSON();
            marker.feature.properties.text = "Some text";

            let textlayer = L.TextLayer.fromFeatureLayer(marker);

            assert.isTrue(marker.feature.properties.text == textlayer.text);
            assert.isTrue(marker.getLatLng() == textlayer.getLatLng());
        });
    });

    it("updates correctly when setText() is called", () => {
        cy.window().then(({ map, L }) => {
            let options = {
                    tooltip: {
                        className: "tooltip"
                    },
                    divIcon: {
                        className: "divicon"
                    }
                };
        
            let textLayer = L.textLayer("Stuff", [51.505, -0.09], options)
                .addTo(map);

            let longText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ridiculus mus mauris vitae ultricies leo integer malesuada. Egestas pretium aenean pharetra magna. Pharetra magna ac placerat vestibulum. Tincidunt ornare massa eget egestas purus viverra accumsan in. Netus et malesuada fames ac. Massa eget egestas purus viverra accumsan in nisl nisi scelerisque. Arcu cursus euismod quis viverra nibh cras pulvinar. Et netus et malesuada fames ac turpis egestas maecenas. Pulvinar neque laoreet suspendisse interdum consectetur libero id faucibus. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis enim ut tellus elementum sagittis vitae et leo duis. Sit amet purus gravida quis blandit turpis.";
            textLayer.setText(longText);

            cy.contains(longText);

            //this doesn't work 🤷
            //cy.sameSize(".tooltip", ".divicon")
        });
    });

    it("shows text layer when calling addTo(map)", () => {
        cy.window().then(({ map, L }) => {

            let text = "Some Text";
            let textLayer = L.textLayer(text, [51.505, -0.09]);
            textLayer.addTo(map);
            
            assert.isTrue(textLayer.addedToMap);
            cy.contains(text);
        });
    });

    it("applies options parameter when passed into constructor", () => {
        cy.window().then(({ map, L }) => {

            let options = {
                tooltip: {
                    className: "tooltip"
                },
                divIcon: {
                    className: "divIcon"
                }
            };
            let textLayer = L.textLayer("Some Text", [51.505, -0.09], options)
                .addTo(map);
            
            cy.get(".leaflet-marker-pane > .divIcon");
            cy.get(".leaflet-tooltip-pane > .tooltip");
        });        
    });

    it("is editable", () => {
        cy.window().then(({ map, L }) => {
            let options = {
                tooltip: {
                    className: "tooltip"
                }
            };

            let textLayer = L.textLayer("Some Text", [51.505, -0.09], options)
                .addTo(map);

                cy.isEditable(textLayer)
            });
    });

    it("enables and disables editing when enable() and disable() are called", () => {
        cy.window().then(({ map, L }) => {
            let options = {
                tooltip: {
                    className: "tooltip"
                },
                enabled: false
            };
            let textLayer = L.textLayer("Some Text", [51.505, -0.09], options)
                .addTo(map);

            assert.isFalse(textLayer.isEnabled);
            cy.isNotEditable(textLayer)
                .then(() => {
                    textLayer.enable();
                    assert.isTrue(textLayer.isEnabled);
                    cy.isEditable(textLayer)
                        .then(() => {
                            textLayer.disable();
                            assert.isFalse(textLayer.isEnabled);
                            cy.isNotEditable(textLayer)
                        });
                });
        });
    });
    
    it("is read only when enabled is false", () => {
        cy.window().then(({ map, L }) => {
            let options = {
                tooltip: {
                    className: "tooltip"
                },
                enabled: false
            };
            let textLayer = L.textLayer("Some Text", [51.505, -0.09], options)
                .addTo(map);

                cy.isNotEditable(textLayer)
            });
    });

    it("calls custom callbacks when provided", () => {
        cy.window().then(({ map, L }) => {
            let addCalled = false;
            let onAdd = (map) => {
                addCalled = true;
            };
            let removeCalled = false;
            let onRemove = (map) => {
                removeCalled = true;
            };

            let options = {
                onAddCallback: onAdd,
                onRemoveCallback: onRemove
            };
            let textLayer = L.textLayer("Some Text", [51.505, -0.09], options)
                .addTo(map);
            
            assert.isTrue(addCalled);

            map.removeLayer(textLayer);

            assert.isTrue(removeCalled);
            assert.isFalse(textLayer.addedToMap);
        });
    });
});  