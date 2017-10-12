var express = require('express');
var router = express.Router();
var fs = require('fs');
var mongoose = require('mongoose');
var Upload = mongoose.model('Upload');

router.get('/:name', function(req, res, next) {
    Upload.findOne({
        'name': req.params.name
    }, function(err, upload) {
        if (err) {
            next(err);
        } else {
            if (!upload) {
                res.sendStatus(404);
            } else {
                var disposition;
                if (upload.file.mimetype.split('/')[0] === 'image')
                    disposition = 'inline';
                else
                    disposition = 'attachment; filename="' + upload.oname + '"';

                res.set({
                    "Content-Disposition": disposition,
                    "Content-Type": upload.file.mimetype
                });
                fs.createReadStream(upload.file.path).pipe(res);
            }
        }
    });
});

module.exports = router;