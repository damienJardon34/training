const Thing = require('../models/thing');
const fs = require('fs');

exports.createThing = (req, res, next) => {
    console.log(req.body);
    const thingObject = JSON.parse(req.body.thing);
    delete thingObject._id;
    delete thingObject._userId;

    const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;

    const thing = new Thing({
        ...thingObject,
        imageUrl: imageUrl,
        userId: req.auth.userId
    });
    thing.save()
        .then(() => { res.status(201).json({ message: 'Post saved successfully!' }) })
        .catch((error) => { res.status(400).json({ error: error }) })
};

exports.getAllStuff = (req, res, next) => {
    Thing.find()
        .then(things => res.status(200).json(things))
        .catch(error => res.status(400).json({ error }));
};
exports.getOneThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
        .then(thing => res.status(200).json(thing))
        .catch(error => res.status(404).json({ error }));
};
exports.modifyThing = (req, res, next) => {
    const thingObject = req.file ? {
        ...JSON.parse(req.body.thing),
        imageURL: `${req.protocol}://${req.get('host')}/images/${req.file.filename}}`
    } : { ...req.body };

    delete thingObject._userId;
    Thing.findOne({ _id: req.params.id })
        .then((thing) => {
            if (thing.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                Thing.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: "Object modifié" }))
                    .catch(error => res.status(401).json({ error }));
            }

        })
        .catch(error => { res.status(400).json({ error }) });
};
exports.deleteThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
        .then(thing => {
            if (thing.userId != req.auth.userId) {
                res.status(401).json({ message: "Not authorized" });
            } else {
                const filename = thing.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Thing.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                        .catch(error => res.status(400).json({ error }));
                });
            };
        })
        .catch(error => res.status(500).json({ error }));
};