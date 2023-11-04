describe('File Upload Form', () => {
  it('validates form, uploads a file, and clears it', () => {

    cy.visit('http://localhost:3000'); 

    cy.get('input[type="file"]').should('not.have.property', 'files');

  const fileInput = cy.get('#uploadFile');

  cy.fixture('avatar.png').then((fileContent) => {
    fileInput.attachFile({
      fileContent: fileContent.toString(),
      fileName: 'avatar.png',
      mimeType: 'text/plain'
    });
  });

  cy.get('form').submit();
  });

  it('should handle invalid file submissions', () => {
  
    cy.visit('http://localhost:3000');

    cy.get('form').submit();
    cy.get('#error-message').should('contain', 'Please select a file to upload.');

    cy.fixture('size.jpg').then((fileContent) => {
      cy.get('#uploadFile').attachFile({
        fileContent: fileContent,
        fileName: 'size.jpg',
        mimeType: 'image/jpeg'
      });
    });

    cy.get('form').submit();
    cy.get('#error-message').should('contain', 'File size exceeds the limit (5MB).');
   

    cy.fixture('format.avif').then((fileContent) => {
      cy.get('#uploadFile').attachFile({
        fileContent: fileContent,
        fileName: 'format.avif',
        mimeType: 'image/avif'
      });
    });


    cy.get('form').submit();
    cy.get('#error-message').should('contain', 'Only JPG, PNG, and JPEG files are allowed.');

  });

  it('should clear the file input', () => {

    cy.visit('http://localhost:3000');


    cy.fixture('avatar.png').then((fileContent) => {
      cy.get('#uploadFile').attachFile({
        fileContent: fileContent.toString(),
        fileName: 'avatar.png',
        mimeType: 'text/plain'
      });
    });

    cy.get('input[type="button"]').click();

    cy.get('#uploadFile').should('have.value', '');

  });

});
