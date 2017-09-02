var {check, validationResult} = require('express-validator/check');
var express = require('express');

var router = express.Router();

router.use('/:documentId', function(req, res, next) {
  findDocumentById(req, res, req.params.documentId)
    .then((document) => {
      if (document.length === 0) {
        res.status(404).send('Dokument ne postoji!');
        return;
      } else {
        req.document = document[0];
        next();
      }
    }, (error) => {
      res.status(500).send(error);
      return;
    });
});

// Supports GET, POST
router.route('/')
  .get(
    retrieveDocuments
  )
  .post(
    inputValidators(createDocument)
  );

// Supports GET, PUT
router.route('/:documentId')
  .get(
    retrieveDocument
  )
  .put(
    inputValidators(replaceDocument)
  );

function retrieveDocuments(req, res) {
  var queryString = `
    SELECT *
    FROM AgendaDocuments
    WHERE AgendaItemId = ?
  `;

  req.connection.query(queryString, [req.agendaItemId], function(error, result) {
    if (error) {
      res.status(500).send(error);
      return;
    }

    res.status(200).send(result);
    return;
  });
}

function retrieveDocument(req, res) {
  res.status(200).send(req.document);
  return;
}

function createDocument(req, res) {
  var queryString = `
    INSERT INTO AgendaDocuments
    (
      Description,
      URL,
      AgendaItemId
    )
    VALUES (?, ?, ?)
  `;
  var values = [
    req.body.Description,
    req.body.URL,
    req.agendaItemId
  ];

  req.connection.query(queryString, values, function(error, result) {
    if (error) {
      res.status(500).send(error);
      return;
    }

    if (result.serverStatus !== 2) {
      res.status(500).send('Dokument nije dodan!');
      return;
    }

    findDocumentById(req, res, result.insertId)
      .then((document) => {
        document = document[0];
        var location =
          'Location: /api/meetings/' +
          req.meetingId +
          '/documents/' +
          document.AgendaDocumentId;
  
        res.set('Location', location);
        res.status(201).send(document);
        return;
      }, (error) => {
        res.status(500).send(error);
        return;
      });
  });
}

function replaceDocument(req, res) {
  var queryString = `
    UPDATE AgendaDocuments
    SET
      Description = ?,
      URL = ?
    WHERE AgendaDocumentId = ?
  `;
  var values = [
    req.body.Description,
    req.body.URL,
    req.params.documentId
  ];

  req.connection.query(queryString, values, function(error, result) {
    if (error) {
      res.status(500).send(error);
      return;
    }

    if (result.serverStatus !== 2) {
      res.status(500).send('Dokument nije spremljen!');
      return;
    }

    findDocumentById(req, res, req.params.documentId)
      .then((document) => {
        document = document[0];
        
        res.status(200).send(document);
        return;
      }, (error) => {
        res.status(500).send(error);
        return;
      });
  });
}

function findDocumentById(req, res, documentId) {
  return new Promise((resolve, reject) => {
    var queryString = `
      SELECT *
      FROM AgendaDocuments
      WHERE
        AgendaDocumentId = ? AND
        AgendaItemId = ?
    `;
    var values = [
      documentId,
      req.agendaItemId
    ];

    req.connection.query(queryString, values, function(error, result) {
      if (error) {
        reject(error);
      }
      
      resolve(result);
    });
  });
}

function inputValidators(func) {
  return [
    isAdmin,
    check('Description')
      .exists()
      .withMessage('Description is required')
      .isLength({ min: 0, max: 500})
      .withMessage('Description is too long'),
    check('URL')
      .exists()
      .withMessage('URL is required')
      .isURL()
      .withMessage('Invalid URL')
      .isLength({ min: 0, max: 50})
      .withMessage('URL is too long'),
    function(req, res, next) {
      var errors = validationResult(req);

      if (errors.isEmpty()) {
        next();
      } else {
        res.status(422).send(errors.mapped());
        return;
      }
    },
    func
  ];
}

function isAdmin(req, res, next) {
  if (req.decoded.RoleName === 'admin') {
    next();
  } else {
    res.status(403).send('Nisi admin!');
    return;
  }
}

module.exports = router;