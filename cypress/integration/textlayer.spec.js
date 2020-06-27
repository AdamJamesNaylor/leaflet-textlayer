describe("TextLayer", () => {
    const mapSelector = "#map";
  
    it("shows text layer when calling addLayer()", () => {
        cy.window().then(({ map, L }) => {

            let text = "Some Text";
            var textLayer = L.textLayer(text, [51.505, -0.09]);
            textLayer.addTo(map);
            
            assert.isTrue(textLayer.addedToMap);
            cy.contains(text);
        });
    });

    // it("applies options parameter when passed into constructor", () => {

    // });

    //it("enables and disables editing when enabled() and disable() are called", () => {
//also check .isEnabled
    //};
    
    //it("is read only when enabled is false", () => {
        
    //};

    //it("calls custom callbacks when provided", () => {
        
    //};

    //it("updates correctly when setText() is called", () => {
        //check text and sizes
    //};

    //it("updates correctly when setLatLng() is called", () => {
        //check text and sizes
    //};


});  