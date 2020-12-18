require('dotenv').config();
const express = require('express')
const app = express()
const port = 3000;
const axios = require('axios').default;
const bodyParser = require('body-parser')
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const fs = require("fs");



let subscriptionKey = process.env.FACE_SUBSCRIPTION_KEY
let endpoint = process.env.FACE_ENDPOINT + '/face/v1.0/detect'
//let imageUrl = 'https://raw.githubusercontent.com/Azure-Samples/cognitive-services-sample-data-files/master/ComputerVision/Images/faces.jpg'
//let imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/c/c3/RH_Louise_Lillian_Gish.jpg'
app.use(bodyParser.json())

const options = {
    swaggerDefinition: {
        info: {
            title: 'Face Detection and Recognition API',
            version: '1.0.0',
            description: 'Face detection is the action of locating human faces in an image and optionally returning different kinds of face-related data. This API returns a faceId and faceRectanlge. The faceRectangle fields consists of set of pixel coordinates for the left, top, width, and height which mark the located face. The faces are listed in size order from largest to smallest. The faceId is used in Face recognition API. Face recognition describes the work of comparing two different faces to determine if they re similar or belong to the same person. \r\n This API is currently available in: EAST US.'
        
        },
        host: "134.122.17.137:3000",
        basePath: "/",
    },
    apis: ["./index.js"],
};

const specs = swaggerJsdoc(options);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

app.get('/', (req, res) => {
    res.send('Hello! This is face detection API.')
})
  
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

//Detect Face Model 02
/**
 * @swagger
 * definitions:
 *   Detect faces in an image:
 *     properties:
 *       imageURL:
 *         type: string
 */
/**
 * @swagger
 * /detectfaces:
 *    post:
 *      description: Detects a face and returns position of face rectangles. The dection model used in this API has a better accuracy for on small, side and blurry faces.  
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: A successful call returns an array of face entries ranked by face rectangle size in descending order. An empty response indicates no faces detected.
 *          400:
 *              description: An error occus if the body is invalid. 
 *      parameters:
 *          - name: imageURL
 *            description: This is the image url for face detection. <br> -The supported image formats are JPEG, PNG, and GIF. <br> -The allowed image file size is from 1KB to 6MB. <br> -The minimum detectable face size is 36x36 pixels in an image no larger than 1920x1080 pixels. Images with dimensions higher than 1920x1080 pixels will need a proportionally larger minimum face size. <br> -Up to 100 faces can be returned for an image. Faces are ranked by face rectangle size from large to small.
 *            in: body
 *            required: true
 *            schema:
 *              $ref: '#/definitions/Detect faces in an image'
 *
 */
app.post('/detectfaces', async (req, res) => {
    try{
        axios({
            method: 'post',
            url: endpoint,
            params : {
                detectionModel: 'detection_02',
                returnFaceId: true
            },
            data: {
                url: req.body.imageURL,
            },
            headers: { 'Ocp-Apim-Subscription-Key': subscriptionKey }
            }).then(function (response) {
                console.log('Status text: ' + response.status)
                console.log('Status text: ' + response.statusText)
                // console.log()
                // console.log(response.data)
                res.status(200).send(response.data);
            }).catch(function (error) {
                console.log(error)
                res.status(400).send();
        });
    }
    catch{
        res.status(400).send();
    }
    
})

function storeImage(req){
    var tmp_path = req.file.path;
    var target_path = 'images/' + req.file.originalname;
    console.log(target_path);
    var src = fs.createReadStream(tmp_path);
    var dest = fs.createWriteStream(target_path);
    src.pipe(dest);
    src.on('end', function() { 
    imageUrl = target_path; 
    //res.send('complete'); 
    console.log(imageUrl);
    return;
    });
    src.on('error', function(err) { res.send('error'); }); 
}




//Detect Face Model 01
/**
 * @swagger
 * definitions:
 *   Detect faces in an image and returns addition data:
 *     properties:
 *       imageURL:
 *         type: string
 *       age:
 *         type: boolean
 *       gender:
 *         type: boolean
 *       headPose:
 *         type: boolean
 *       smile:
 *         type: boolean
 *       facialHair:
 *         type: boolean
 *       glasses:
 *         type: boolean
 *       emotion:
 *         type: boolean
 *       hair:
 *         type: boolean
 *       makeup:
 *         type: boolean
 *       occlusion:
 *         type: boolean
 *       accessories:
 *         type: boolean
 *       blur:
 *         type: boolean
 *       exposure:
 *         type: boolean
 *       noise:
 *         type: boolean
 */
/**
 * @swagger
 * /getfaceattributes:
 *    post:
 *      description: Detects human faces in an image with faceIds and attributes. This API is recommend for near frontal face detection. For small, side and blurry faces the first API is recommended. However this API returns attributes which include age, gender, headPose, smile, facialHair, glasses, emotion, hair, makeup, occlusion, accessories, blur, exposure and noise. Some of the results returned for specific attributes may not be highly accurate.
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Successful detection of the face and selected attributes
 *          400:
 *              description: An error occus if the body is invalid. 
 *      parameters:
 *          - name: Image URL and Attributes
 *            description: This is the imageurl for dectection. These are the attributes you want results for. <br> -The supported image formats are JPEG, PNG. <br> -The allowed image file size is from 1KB to 6MB. <br> -The minimum detectable face size is 36x36 pixels in an image no larger than 1920x1080 pixels. Images with dimensions higher than 1920x1080 pixels will need a proportionally larger minimum face size. <br> -Up to 100 faces can be returned for an image. Faces are ranked by face rectangle size from large to small.
 *            in: body
 *            required: true
 *            schema:
 *              $ref: '#/definitions/Detect faces in an image and returns addition data'
 *
 */
app.post('/getfaceattributes', async (req, res) => {
    
    attributes = await setAttributes(req);
    try{
        axios({
            method: 'post',
            url: endpoint,
            params : {
                detectionModel: 'detection_01',
                returnFaceId: true,
                returnFaceAttributes: attributes
            },
            data: {
                url: req.body.imageURL,
            },
            headers: { 'Ocp-Apim-Subscription-Key': subscriptionKey }
            }).then(function (response) {
                console.log('Status text: ' + response.status)
                console.log('Status text: ' + response.statusText)
                console.log()
                //console.log(response.data)
                res.status(200).send(response.data);
            }).catch(function (error) {
                console.log(error)
                res.status(400).send();
        });
    }
    catch{
        res.status(400).send();
    }
    
})


//Find Similarity in the Faces

/**
 * @swagger
 * definitions:
 *   Find Similar:
 *     properties:
 *       faceId:
 *         type: string
 *       faceIds:
 *         type: array
 *         items:
 *           type: string
 *       maxNumOfCandidatesReturned:
 *         type: integer
 *         minimum: 1
 *         maximum: 1000
 *       mode:
 *         type: string
 */
/**
 * @swagger
 * /findsimilars:
 *    post:
 *      description: Find similar has two working modes, "matchPerson" and "matchFace". "matchPerson" is the default mode that it tries to find faces of the same person as possible by using internal same-person thresholds. It is useful to find a known person's other photos. Note that an empty list will be returned if no faces pass the internal thresholds. "matchFace" mode ignores same-person thresholds and returns ranked similar faces anyway, even the similarity is low. It can be used in the cases like searching celebrity-looking faces.
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Successful recognition of similarities on faces provided. 
 *          400:
 *              description: An error occus if the body is invalid. An expired IDs will result in invalid boday. 
 *      parameters:
 *          - name: Face Ids and few other details. 
 *            description: This API requires following attributes. <br> -FaceId = The face id to be matched. This face ID comes from the detect API and expires after 24 hours of creation. <br> -FaceIds = This is an array of faceIds from which the face is to be mathced. These Ids also come from the detect API and expire in 24 hours after creation. <br> -maxNumOfCandidatesReturned = This is the number of top similar faces returned. The valid range is [1, 1000]. <br> -mode = Similar face searching mode. It can be "matchPerson" or "matchFace". It defaults to "matchPerson".
 *            in: body
 *            required: true
 *            schema:
 *              $ref: '#/definitions/Find Similar'
 *
 */
app.post('/findsimilars', async (req, res) => {
    console.log(req.body);
    try{
        axios({
            method: 'post',
            url: 'https://eastus.api.cognitive.microsoft.com/face/v1.0/findsimilars',
            data: {
                faceId: req.body.faceId,
                faceIds: req.body.faceIds,
                maxNumOfCandidatesReturned: req.body.maxNumOfCandidatesReturned,
                mode: req.body.mode
            },
            headers: { 
                'Ocp-Apim-Subscription-Key': subscriptionKey,
                'Content-Type':'application/json'
            }
            }).then(function (response) {
                console.log('Status text: ' + response.status)
                console.log('Status text: ' + response.statusText)
                // console.log()
                // console.log(response.data)
                res.status(200).send(response.data);
            }).catch(function (error) {
                console.log(error)
                res.status(400).send();
        });
    }
    catch{
        res.status(400).send();
    }
    
})


//Verify if two people are same.

/**
 * @swagger
 * definitions:
 *   Face Verify:
 *     properties:
 *       faceId1:
 *         type: string
 *       faceId2:
 *         type: string
 */
/**
 * @swagger
 * /verify:
 *    post:
 *      description: Verify whether two faces belong to a same person.
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Successfully creted verifiation results.  
 *          400:
 *              description: An error occus if the body is invalid. An expired IDs will result in invalid boday. 
 *      parameters:
 *          - name: details
 *            description: This API requires two faceIds. The IDs are to be generated by the detect API. The IDs are valid up to 24 hours after creation. 
 *            in: body
 *            required: true
 *            schema:
 *              $ref: '#/definitions/Face Verify'
 *
 */
app.post('/verify', async (req, res) => {
    console.log(req.body);
    try{
        axios({
            method: 'post',
            url: 'https://eastus.api.cognitive.microsoft.com/face/v1.0/verify',
            data: {
                faceId1: req.body.faceId1,
                faceId2: req.body.faceId2
            },
            headers: { 
                'Ocp-Apim-Subscription-Key': subscriptionKey,
                'Content-Type':'application/json'
            }
            }).then(function (response) {
                console.log('Status text: ' + response.status)
                console.log('Status text: ' + response.statusText)
                console.log()
                console.log(response.data)
                res.status(200).send(response.data);
            }).catch(function (error) {
                console.log(error)
                res.status(400).send();
        });
    }
    catch{
        res.status(400).send();
    }
    
})

function setAttributes(req){
    let attributes = [];
    if(req.body.age == true){
        attributes.push("age");
    }
    if(req.body.gender == true){
        attributes.push("gender");
    }
    if(req.body.headPose == true){
        attributes.push("headPose");
    }
    if(req.body.smile == true){
        attributes.push("smile");
    }
    if(req.body.facialHair == true){
        attributes.push("facialHair");
    }
    if(req.body.glasses == true){
        attributes.push("glasses");
    }
    if(req.body.emotion == true){
        attributes.push("emotion");
    }
    if(req.body.hair == true){
        attributes.push("hair");
    }
    if(req.body.makeup == true){
        attributes.push("makeup");
    }
    if(req.body.occlusion == true){
        attributes.push("occlusion");
    }
    if(req.body.accessories == true){
        attributes.push("accessories");
    }
    if(req.body.blur == true){
        attributes.push("blur");
    }
    if(req.body.exposure == true){
        attributes.push("exposure");
    }
    if(req.body.noise == true){
        attributes.push("noise");
    }
    //console.log(attributes.toString());
    return attributes.toString();
}