describe("File Upload Test", () => {
  it("uploads a valid image file successfully", () => {
    cy.visit("http://localhost:3000");

    cy.window().then((win) => {
      win.testToken = "your_test_token";
    });

    const fileToUpload = "avatar.png";
    const uniqueName = "avatar.png";
    const aliasName = "fileUpload";

    cy.fixture(fileToUpload).then((fileContent) => {
      cy.intercept("POST", "/upload").as(aliasName);

      const blob = Cypress.Blob.binaryStringToBlob(fileContent, "image/png");

      const data = new FormData();
      data.append("hasHeader", "true");
      data.append("name", uniqueName);
      data.append("uploadFile", blob, fileToUpload, { type: "image/png" });

      cy.window().then((win) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/upload");
        xhr.setRequestHeader("Authorization", `Bearer ${win.testToken}`);
        xhr.send(data);
      });

      cy.wait(`@${aliasName}`).then((interception) => {
        expect(interception.response.statusCode).to.equal(200);
      });
    });
  });

  it("fails to upload an invalid file type", () => {
    cy.visit("http://localhost:3000");

    const fileToUpload = "format.avif";
    const aliasName = "fileUploadInvalid";

    cy.fixture(fileToUpload).then((fileContent) => {
      cy.intercept("POST", "/upload").as(aliasName);

      const binaryString = unescape(encodeURIComponent(fileContent));

      const blob = Cypress.Blob.binaryStringToBlob(binaryString, "text/plain");

      const data = new FormData();
      data.append("hasHeader", "true");
      data.append("name", "format.avif");
      data.append("uploadFile", blob, fileToUpload, { type: "text/plain" });

      cy.window().then((win) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/upload");
        xhr.setRequestHeader("Authorization", `Bearer ${win.testToken}`);
        xhr.send(data);
      });

      cy.wait(`@${aliasName}`).then((interception) => {
        expect(interception.response.statusCode).not.to.equal(200);
      });
    });
  });

  it("fails to upload the file because the size was more", () => {
    cy.visit("http://localhost:3000");

    const fileToUpload = "filesize.jpg";
    const aliasName = "fileUploadInvalid";

    cy.fixture(fileToUpload).then((fileContent) => {
      cy.intercept("POST", "/upload").as(aliasName);

      const binaryString = unescape(encodeURIComponent(fileContent));

      const blob = Cypress.Blob.binaryStringToBlob(binaryString, "image/jpeg");

      const data = new FormData();
      data.append("hasHeader", "true");
      data.append("name", "filesize.jpg");
      data.append("uploadFile", blob, fileToUpload, { type: "image/jpeg" });

      // Send the request
      cy.window().then((win) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/upload");
        xhr.setRequestHeader("Authorization", `Bearer ${win.testToken}`);
        xhr.send(data);
      });

      cy.wait(`@${aliasName}`).then((interception) => {
        expect(interception.response.statusCode).to.not.equal(500);
      });
    });
  });
});
